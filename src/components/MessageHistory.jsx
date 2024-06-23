import React from 'react';

const MessageHistory = ({ entries, removeEntry, editEntry }) => {
  return (
    <div className="mb-4 p-4 bg-white rounded-lg shadow max-h-96 overflow-y-auto">
      <h3 className="font-bold mb-2">Message History:</h3>
      {entries.map((entry, index) => (
        <div key={index} className="mb-2 p-2 bg-gray-100 rounded">
          <p><strong>User:</strong> {entry.user}</p>
          <p><strong>Assistant:</strong> {entry.assistant}</p>
          <div className="mt-2">
            <button
              onClick={() => editEntry(index)}
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => removeEntry(index)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageHistory;