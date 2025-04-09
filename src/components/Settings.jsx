import React from "react";

const Settings = ({
  wordLength,
  setWordLength,
  maxAttempts,
  setMaxAttempts,
  infiniteMode,
  setInfiniteMode,
}) => {
  // Handler for word length dropdown change
  const handleWordLengthChange = (e) => {
    setWordLength(parseInt(e.target.value, 10));
  };

  // Handler for max attempts dropdown change
  const handleMaxAttemptsChange = (e) => {
    setMaxAttempts(parseInt(e.target.value, 10));
  };

  // Toggle infinite mode
  const handleInfiniteToggle = () => {
    setInfiniteMode(!infiniteMode);
  };

  // Generate options for word length (3 to 10)
  const wordLengthOptions = [];
  for (let i = 3; i <= 10; i++) {
    wordLengthOptions.push(i);
  }

  // Generate options for max attempts (1 to 10)
  const maxAttemptsOptions = [];
  for (let i = 1; i <= 10; i++) {
    maxAttemptsOptions.push(i);
  }

  return (
    <div className="mb-4 border border-gray-200 rounded-lg p-3 bg-gray-50 w-full">
      <h2 className="font-bold mb-2 text-gray-700">Settings</h2>
      <div className="flex flex-col gap-3">
        <label className="flex items-center justify-between">
          <span className="text-gray-700">Word Length:</span>
          <select
            value={wordLength}
            onChange={handleWordLengthChange}
            className="border border-gray-300 rounded p-1 w-16 text-center focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {wordLengthOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center justify-between">
          <span className="text-gray-700">Max Attempts:</span>
          <select
            value={maxAttempts}
            onChange={handleMaxAttemptsChange}
            disabled={infiniteMode}
            className="border border-gray-300 rounded p-1 w-16 text-center focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
          >
            {maxAttemptsOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={infiniteMode}
            onChange={handleInfiniteToggle}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="text-gray-700">Infinite Mode</span>
        </label>
      </div>
    </div>
  );
};

export default Settings;
