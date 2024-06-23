import React from 'react';

const UserPromptInput = ({ userPrompt, setUserPrompt, aiResponse, setAiResponse, addEntry, isSystemPromptSet }) => {
  return (
    <div className="mb-4 p-4 bg-white rounded-lg shadow">
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
          disabled={!isSystemPromptSet}
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
          disabled={!isSystemPromptSet}
        />
      </div>
      <button
        onClick={addEntry}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        disabled={!isSystemPromptSet}
      >
        Add Entry
      </button>
    </div>
  );
};

export default UserPromptInput;