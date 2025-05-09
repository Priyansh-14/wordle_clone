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
    window.history.replaceState(null, "", window.location.pathname);
    setWordLength(parseInt(e.target.value, 10));
  };

  // Handler for max attempts dropdown change (including infinite as the last option)
  const handleMaxAttemptsChange = (e) => {
    const val = e.target.value;
    if (val === "∞") {
      setInfiniteMode(true);
      setMaxAttempts(null);
    } else {
      setInfiniteMode(false);
      setMaxAttempts(parseInt(val, 10));
    }
  };

  // Generate options for word length (3 to 10)
  const wordLengthOptions = Array.from({ length: 8 }, (_, i) => i + 3);

  // Generate options for max attempts (5 to 10), plus infinite
  const maxAttemptsOptions = Array.from({ length: 6 }, (_, i) => i + 5);
  maxAttemptsOptions.push("∞");

  return (
    <div className="mb-4 border border-gray-200 rounded-lg p-3 bg-gray-50 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between gap-4">
        {/* <label className="flex-1 flex items-center justify-between">
          <span className="text-gray-700">Word Length:</span>
          <select
            value={wordLength}
            onChange={handleWordLengthChange}
            className="border border-gray-300 rounded p-1 w-16 text-center focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {wordLengthOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label> */}
        <div className="relative flex-1">
          {/* pad-top to make room for the label */}
          <select
            id="word-length"
            value={wordLength}
            onChange={handleWordLengthChange}
            className="block w-full border border-gray-300 rounded px-2 pt-5 pb-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {wordLengthOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <label
            htmlFor="word-length"
            className="absolute top-0 left-2 -translate-y-1/2 bg-gray-50 px-1 text-gray-700 text-sm"
          >
            Word Length
          </label>
        </div>
        {/* Divider */}
        <div className="border-l border-gray-300 h-6" />
        {/* Max Attempts */}
        <div className="relative flex-1">
          <select
            id="max-attempts"
            value={infiniteMode ? "∞" : maxAttempts}
            onChange={handleMaxAttemptsChange}
            className="block w-full border border-gray-300 rounded px-2 pt-5 pb-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {maxAttemptsOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <label
            htmlFor="max-attempts"
            className="absolute top-0 left-2 -translate-y-1/2 bg-gray-50 px-1 text-gray-700 text-sm"
          >
            Max Attempts
          </label>
        </div>

        {/* <label className="flex-1 flex items-center justify-between">
          <span className="text-gray-700">Max Attempts:</span>
          <select
            value={infiniteMode ? "∞" : maxAttempts}
            onChange={handleMaxAttemptsChange}
            className="border border-gray-300 rounded p-1 w-16 text-center focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {maxAttemptsOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label> */}
      </div>
    </div>
  );
};

export default Settings;
