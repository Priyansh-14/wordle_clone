import React from "react";

const Keyboard = ({ keyboardStatus, onKeyPress, isEnterEnabled }) => {
  const row1 = "QWERTYUIOP".split("");
  const row2 = "ASDFGHJKL".split("");
  const row3 = ["Enter", ..."ZXCVBNM".split(""), "Backspace"];

  const getBgColor = (status) => {
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
    let extraClasses = "cursor-pointer hover:opacity-90 transition-opacity";
    if (key === "Enter") {
      extraClasses += isEnterEnabled ? "" : " opacity-50 cursor-not-allowed";
    }
    return (
      <button
        key={key}
        onClick={() => onKeyPress(key)}
        disabled={key === "Enter" && !isEnterEnabled}
        className={`px-3 py-2 rounded text-sm font-bold min-w-[2rem] ${getBgColor(
          keyboardStatus[key] || ""
        )} ${extraClasses}`}
      >
        {key === "Backspace" ? "⌫" : key}
      </button>
    );
  };

  return (
    <div className="mt-4 flex flex-col items-center gap-1">
      <div className="flex justify-center gap-1">{row1.map(renderKey)}</div>
      <div className="flex justify-center gap-1">{row2.map(renderKey)}</div>
      <div className="flex justify-center gap-1">{row3.map(renderKey)}</div>
    </div>
  );
};

export default Keyboard;
