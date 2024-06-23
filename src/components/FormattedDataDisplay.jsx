import React from 'react';

const FormattedDataDisplay = ({ formattedData, exportJSON }) => {
  return (
    <div className="mb-4 p-4 bg-white rounded-lg shadow">
      <h3 className="font-bold mb-2">Formatted Data:</h3>
      <div className="mb-4">
        <button
          onClick={exportJSON}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={!formattedData}
        >
          Export JSON
        </button>
      </div>
      {formattedData && (
        <pre className="bg-gray-100 p-4 rounded overflow-x-auto max-h-96">
          {formattedData}
        </pre>
      )}
    </div>
  );
};

export default FormattedDataDisplay;