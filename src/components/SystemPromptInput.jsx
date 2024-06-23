import React from 'react';

const SystemPromptInput = ({ systemPrompt, setSystemPrompt, isSystemPromptSet, setIsSystemPromptSet }) => {
  const handleSetSystemPrompt = () => {
    if (systemPrompt.trim()) {
      setIsSystemPromptSet(true);
    }
  };

  return (
    <div className="mb-4 p-4 bg-white rounded-lg shadow">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="systemPrompt">
        System Prompt:
      </label>
      {!isSystemPromptSet ? (
        <>
          <textarea
            id="systemPrompt"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
            rows={3}
            disabled={isSystemPromptSet}
          />
          <button
            onClick={handleSetSystemPrompt}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Set System Prompt
          </button>
        </>
      ) : (
        <div className="p-3 bg-blue-100 rounded">
          <p className="text-sm text-blue-700">{systemPrompt}</p>
        </div>
      )}
    </div>
  );
};

export default SystemPromptInput;