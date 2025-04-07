import React from "react";

const Settings = ({
  wordLength,
  setWordLength,
  maxAttempts,
  setMaxAttempts,
  infiniteMode,
  setInfiniteMode,
}) => {
  const MIN_WORD_LENGTH = 3;
  const MIN_MAX_ATTEMPTS = 1;

  const handleWordLengthChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (!value || value < MIN_WORD_LENGTH) value = MIN_WORD_LENGTH;
    setWordLength(value);
  };

  const handleMaxAttemptsChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (!value || value < MIN_MAX_ATTEMPTS) value = MIN_MAX_ATTEMPTS;
    setMaxAttempts(value);
  };

  const handleInfiniteToggle = () => {
    setInfiniteMode(!infiniteMode);
  };

  return (
    <div className="mb-4 border border-gray-200 rounded-lg p-3 bg-gray-50 w-full">
      <h2 className="font-bold mb-2 text-gray-700">Settings</h2>
      <div className="flex flex-col gap-3">
        <label className="flex items-center justify-between">
          <span className="text-gray-700">Word Length:</span>
          <input
            type="number"
            value={wordLength}
            onChange={handleWordLengthChange}
            min={MIN_WORD_LENGTH}
            max="20"
            className="border border-gray-300 rounded p-1 w-16 text-center focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </label>
        <label className="flex items-center justify-between">
          <span className="text-gray-700">Max Attempts:</span>
          <input
            type="number"
            value={maxAttempts}
            onChange={handleMaxAttemptsChange}
            min={MIN_MAX_ATTEMPTS}
            max="20"
            disabled={infiniteMode}
            className="border border-gray-300 rounded p-1 w-16 text-center focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
          />
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
