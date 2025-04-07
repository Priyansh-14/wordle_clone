import React from "react";

const Keyboard = ({ keyboardStatus, onKeyPress, isEnterEnabled }) => {
  const row1 = "QWERTYUIOP".split("");
  const row2 = "ASDFGHJKL".split("");
  const row3 = "ZXCVBNM".split("");
  const row4 = ["Enter", "Backspace"];

  // For special keys, use custom colors; otherwise use the default status-based colors
  const getBgColor = (key, status) => {
    if (key === "Enter") {
      return "bg-blue-500 text-white";
    }
    if (key === "Backspace") {
      return "bg-red-500 text-white";
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
          ${
            isSpecial
              ? "w-12 h-12 text-base sm:w-14 sm:h-14 sm:text-lg md:w-16 md:h-16 md:text-xl"
              : "w-8 h-8 text-xs sm:w-10 sm:h-10 sm:text-sm md:w-12 md:h-12 md:text-base lg:w-14 lg:h-14 lg:text-lg"
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
