import React from "react";

const Grid = ({ guesses, wordLength, maxAttempts, currentGuess, gameOver }) => {
  const rows = [];
  for (let i = 0; i < maxAttempts; i++) {
    if (i < guesses.length) {
      rows.push(guesses[i]);
    } else if (i === guesses.length && !gameOver) {
      const rowWord = currentGuess.padEnd(wordLength, "");
      rows.push({ word: rowWord, feedback: Array(wordLength).fill("") });
    } else {
      rows.push({ word: "", feedback: Array(wordLength).fill("") });
    }
  }

  const getBgColor = (status) => {
    switch (status) {
      case "correct":
        return "bg-green-500 text-white";
      case "present":
        return "bg-yellow-500 text-white";
      case "absent":
        return "bg-gray-400 text-white";
      default:
        return "bg-gray-200 text-gray-900";
    }
  };

  return (
    <div className="grid gap-2 mb-4">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-2">
          {Array.from({ length: wordLength }).map((_, colIndex) => {
            const letter = row.word[colIndex]
              ? row.word[colIndex].toUpperCase()
              : "";
            const status = row.feedback[colIndex] || "";
            return (
              <div
                key={colIndex}
                className={`w-12 h-12 border-2 border-gray-300 flex items-center justify-center text-2xl font-bold rounded-md ${getBgColor(
                  status
                )}`}
              >
                {letter}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Grid;
