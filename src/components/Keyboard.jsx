import React from "react";

const Keyboard = ({ keyboardStatus, onKeyPress, isEnterEnabled }) => {
  // Three rows of letters
  const row1 = "QWERTYUIOP".split("");
  const row2 = "ASDFGHJKL".split("");
  const row3 = "ZXCVBNM".split("");
  // Fourth row with special keys
  const row4 = ["Enter", "Backspace"];

  /**
   * Returns a background + text color for each key.
   * Enter and Backspace have custom colors. Other keys get feedback-based colors.
   */
  const getBgColor = (key, status) => {
    if (key === "Enter") {
      return "bg-blue-500 text-white"; // Enter key color
    }
    if (key === "Backspace") {
      return "bg-red-500 text-white"; // Backspace key color
    }
    switch (status) {
      case "correct":
        return "bg-green-500 text-white";
      case "present":
        return "bg-yellow-500 text-white";
      case "absent":
        return "bg-gray-400 text-white";
      default:
        return "bg-gray-300 text-gray-800";
    }
  };

  /**
   * Renders an individual key. Special keys are sized larger.
   */
  const renderKey = (key) => {
    const disabled = key === "Enter" && !isEnterEnabled;
    const isSpecial = key === "Enter" || key === "Backspace";
    return (
      <button
        key={key}
        onClick={() => onKeyPress(key)}
        disabled={disabled}
        className={`
          flex items-center justify-center rounded font-bold transition-opacity
          ${getBgColor(key, keyboardStatus[key] || "")}
          ${disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}

          /* Different sizing for special keys vs. regular letters */
          ${
            isSpecial
              ? /* Bigger for Enter & Backspace */
                "w-16 h-10 text-sm sm:w-20 sm:h-12 sm:text-base md:w-24 md:h-14 md:text-lg px-2"
              : /* Default letter keys */
                "w-8 h-8 text-xs sm:w-10 sm:h-10 sm:text-sm md:w-12 md:h-12 md:text-base lg:w-14 lg:h-14 lg:text-lg"
          }
        `}
      >
        {key === "Backspace" ? "⌫" : key}
      </button>
    );
  };

  return (
    <div className="mt-4 w-full overflow-x-auto">
      <div className="flex flex-col items-center space-y-1">
        <div className="flex justify-center gap-1 sm:gap-2">
          {row1.map(renderKey)}
        </div>
        <div className="flex justify-center gap-1 sm:gap-2">
          {row2.map(renderKey)}
        </div>
        <div className="flex justify-center gap-1 sm:gap-2">
          {row3.map(renderKey)}
        </div>
        <div className="flex justify-center gap-1 sm:gap-2">
          {row4.map(renderKey)}
        </div>
      </div>
    </div>
  );
};

export default Keyboard;
