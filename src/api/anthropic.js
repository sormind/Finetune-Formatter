const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

export const generateSyntheticData = async (systemPrompt, entries, numSynthetic, progressCallback) => {
  if (!ANTHROPIC_API_KEY) {
    console.error('Anthropic API key is not set');
    throw new Error('API key not configured');
  }

  console.log('Generating synthetic data with:', { systemPrompt, entries, numSynthetic });
  console.log('Anthropic API Key:', ANTHROPIC_API_KEY);

  const API_URL = 'https://api.anthropic.com/v1/messages';

  const synthetic = [];
  let completed = 0;

  for (let i = 0; i < numSynthetic; i++) {
    if (await progressCallback((completed / numSynthetic) * 100)) {
      console.log('Generation stopped by user');
      break;
    }

    const entry = entries[i % entries.length]; // Cycle through entries if numSynthetic > entries.length

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1000,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "human", content: `Based on this user prompt: "${entry.user}" and AI response: "${entry.assistant}", generate a new, similar but distinct user prompt and AI response pair. Maintain a similar style and tone and format. Respond in the format "User: [new user prompt]\n\nAssistant: [new AI response]"` },
          ],
        }),
      });

      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Result:', result);
      
      const generatedContent = result.content[0].text;
      const [newUserPrompt, newAIResponse] = generatedContent.split('\n\n');

      synthetic.push({
        user: newUserPrompt.replace('User: ', ''),
        assistant: newAIResponse.replace('Assistant: ', ''),
      });

      completed++;
      await progressCallback((completed / numSynthetic) * 100);
    } catch (error) {
      console.error('Error calling Anthropic API:', error);
      throw error;
    }
  }

  return synthetic;
};
