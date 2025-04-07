import React from "react";

const Settings = ({
  wordLength,
  setWordLength,
  maxAttempts,
  setMaxAttempts,
  infiniteMode,
  setInfiniteMode,
}) => {
  // Minimum values for the fields
  const MIN_WORD_LENGTH = 3;
  const MAX_WORD_LENGTH = 31;
  const MIN_MAX_ATTEMPTS = 1;

  // Handle changes to the word length input
  const handleWordLengthChange = (e) => {
    const value = e.target.value;
    let length = parseInt(value, 10);
    // If the field is empty or the value is less than the min, default to the minimum
    if (!value || isNaN(length) || length < MIN_WORD_LENGTH) {
      length = MIN_WORD_LENGTH;
    } else if (length > MAX_WORD_LENGTH) {
      length = MAX_WORD_LENGTH;
    }
    setWordLength(length);
  };

  // Handle changes to the max attempts input
  const handleMaxAttemptsChange = (e) => {
    const value = e.target.value;
    let attempts = parseInt(value, 10);
    // If the field is empty or the value is less than the min, default to the minimum
    if (!value || isNaN(attempts) || attempts < MIN_MAX_ATTEMPTS) {
      attempts = MIN_MAX_ATTEMPTS;
    }
    setMaxAttempts(attempts);
  };

  const handleInfiniteToggle = () => {
    setInfiniteMode(!infiniteMode);
  };

  return (
    <div className="mb-4 border border-gray-200 rounded-lg p-3 bg-gray-50">
      <h2 className="font-bold mb-2 text-gray-700">Settings</h2>
      <div className="flex flex-col gap-3">
        <label className="flex items-center justify-between">
          <span className="text-gray-700">Word Length:</span>
          <input
            type="number"
            value={wordLength}
            onChange={handleWordLengthChange}
            min={MIN_WORD_LENGTH}
            max={MAX_WORD_LENGTH}
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
            max="10"
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
