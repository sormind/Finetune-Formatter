import React, { useState, useRef } from 'react';
import { generateSyntheticData } from '../api/anthropic';
import { PlusIcon, TrashIcon, PencilIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const FineTuneDataFormatter = () => {
  const [systemPrompt, setSystemPrompt] = useState('');
  const [isSystemPromptSet, setIsSystemPromptSet] = useState(false);
  const [userPrompt, setUserPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [formattedData, setFormattedData] = useState('');
  const [entries, setEntries] = useState([]);
  const [syntheticData, setSyntheticData] = useState([]);
  const [isGeneratingSynthetic, setIsGeneratingSynthetic] = useState(false);
  const [numSynthetic, setNumSynthetic] = useState(1);
  const [generationProgress, setGenerationProgress] = useState(0);
  const stopGenerationRef = useRef(false);
  const [activeTab, setActiveTab] = useState('Input');
  const [editingEntry, setEditingEntry] = useState(null);

  const setInitialSystemPrompt = () => {
    if (systemPrompt.trim()) {
      setIsSystemPromptSet(true);
    }
  };

  const addEntry = () => {
    if (userPrompt.trim() && aiResponse.trim()) {
      setEntries([...entries, { user: userPrompt, assistant: aiResponse }]);
      setUserPrompt('');
      setAiResponse('');
    }
  };

  const formatData = () => {
    const data = entries.map(entry => ({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: entry.user },
        { role: "assistant", content: entry.assistant }
      ]
    }));
    setFormattedData(JSON.stringify(data, null, 2));
    console.log("Data formatted:", JSON.stringify(data, null, 2));
  };

  const generateSyntheticDataHandler = async () => {
    console.log("Generating synthetic data...");
    setIsGeneratingSynthetic(true);
    stopGenerationRef.current = false;
    try {
      const synthetic = await generateSyntheticData(systemPrompt, entries, numSynthetic, (progress) => {
        setGenerationProgress(progress);
        return stopGenerationRef.current;
      });
      setSyntheticData(synthetic);
      console.log("Synthetic data generated:", synthetic);
    } catch (error) {
      console.error('Error generating synthetic data:', error);
      alert(`Failed to generate synthetic data: ${error.message}`);
    } finally {
      setIsGeneratingSynthetic(false);
      setGenerationProgress(0);
    }
  };

  const stopGeneration = () => {
    stopGenerationRef.current = true;
  };

  const exportJSON = () => {
    console.log("Exporting JSON...");
    const exportData = {
      original: entries.map(entry => ({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: entry.user },
          { role: "assistant", content: entry.assistant }
        ]
      })),
      synthetic: syntheticData.map(entry => ({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: entry.user },
          { role: "assistant", content: entry.assistant }
        ]
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'finetune_data_with_synthetic.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log("JSON exported");
  };

  const editEntry = (index) => {
    setEditingEntry(index);
    setUserPrompt(entries[index].user);
    setAiResponse(entries[index].assistant);
  };

  const updateEntry = () => {
    if (editingEntry !== null) {
      const updatedEntries = [...entries];
      updatedEntries[editingEntry] = { user: userPrompt, assistant: aiResponse };
      setEntries(updatedEntries);
      setEditingEntry(null);
      setUserPrompt('');
      setAiResponse('');
    }
  };

  const deleteEntry = (index) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Input':
        return (
          <>
            {/* System Prompt Input */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="systemPrompt">
                System Prompt:
              </label>
              <textarea
                id="systemPrompt"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={3}
                disabled={isSystemPromptSet}
              />
              {!isSystemPromptSet && (
                <button
                  onClick={setInitialSystemPrompt}
                  className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Set System Prompt
                </button>
              )}
            </div>

            {/* User Prompt and AI Response Inputs */}
            {isSystemPromptSet && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userPrompt">
                    User Prompt:
                  </label>
                  <input
                    id="userPrompt"
                    type="text"
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="aiResponse">
                    AI Response:
                  </label>
                  <textarea
                    id="aiResponse"
                    value={aiResponse}
                    onChange={(e) => setAiResponse(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    rows={5}
                  />
                </div>
                <button
                  onClick={editingEntry !== null ? updateEntry : addEntry}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                >
                  {editingEntry !== null ? (
                    <>
                      <PencilIcon className="h-5 w-5 mr-2" />
                      Update Entry
                    </>
                  ) : (
                    <>
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Add Entry
                    </>
                  )}
                </button>
              </>
            )}

            {/* Entries List */}
            {entries.length > 0 && (
              <div className="mt-6">
                <h3 className="font-bold mb-2">Entries:</h3>
                {entries.map((entry, index) => (
                  <div key={index} className="mb-2 p-2 bg-gray-100 rounded flex justify-between items-center">
                    <div>
                      <p><strong>User:</strong> {entry.user}</p>
                      <p><strong>Assistant:</strong> {entry.assistant}</p>
                    </div>
                    <div>
                      <button
                        onClick={() => editEntry(index)}
                        className="text-blue-500 hover:text-blue-700 mr-2"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => deleteEntry(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        );
      case 'Formatted Data':
        return (
          <>
            {/* Formatted JSON Display */}
            {formattedData && (
              <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h3 className="font-bold mb-2">Formatted JSON:</h3>
                <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                  {formattedData}
                </pre>
              </div>
            )}
          </>
        );
      case 'Synthetic Data':
        return (
          <>
            {/* Synthetic Data Generation and Display */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numSynthetic">
                Number of Synthetic Data Points:
              </label>
              <input
                id="numSynthetic"
                type="number"
                value={numSynthetic}
                onChange={(e) => setNumSynthetic(Math.max(1, parseInt(e.target.value)))}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                min="1"
              />
            </div>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={generateSyntheticDataHandler}
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                disabled={entries.length === 0 || isGeneratingSynthetic}
              >
                <ArrowPathIcon className="h-5 w-5 mr-2" />
                {isGeneratingSynthetic ? 'Generating...' : 'Generate Synthetic Data'}
              </button>
              {isGeneratingSynthetic && (
                <button
                  onClick={stopGeneration}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Stop Generation
                </button>
              )}
            </div>
            {isGeneratingSynthetic && (
              <div className="mb-4">
                <div className="bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${generationProgress}%` }}
                  ></div>
                </div>
                <p className="text-center mt-2">{`${generationProgress.toFixed(0)}% Complete`}</p>
              </div>
            )}
            {syntheticData.length > 0 && (
              <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h3 className="font-bold mb-2">Synthetic Data:</h3>
                {syntheticData.map((entry, index) => (
                  <div key={index} className="mb-2 p-2 bg-gray-100 rounded">
                    <p><strong>User:</strong> {entry.user}</p>
                    <p><strong>Assistant:</strong> {entry.assistant}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Fine-tune Data Formatter</h1>
      
      <div className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-4">
        {['Input', 'Formatted Data', 'Synthetic Data'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
              ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2
              ${activeTab === tab ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {renderTabContent()}

      <div className="mt-6">
        <button
          onClick={exportJSON}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          disabled={entries.length === 0 && syntheticData.length === 0}
        >
          Export JSON
        </button>
      </div>
    </div>
  );
};

export default FineTuneDataFormatter;