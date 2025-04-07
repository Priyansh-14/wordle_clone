import React from "react";

const Grid = ({ guesses, wordLength, maxAttempts, currentGuess, gameOver }) => {
  const rows = [];
  for (let i = 0; i < maxAttempts; i++) {
    if (i < guesses.length) {
      // Past guesses
      rows.push(guesses[i]);
    } else if (i === guesses.length && !gameOver) {
      // Current guess row
      const rowWord = currentGuess.padEnd(wordLength, "");
      rows.push({ word: rowWord, feedback: Array(wordLength).fill("") });
    } else {
      // Empty rows
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
    // overflow-x-auto: allows horizontal scrolling if needed
    <div className="overflow-x-auto w-full mb-4">
      {/* 
        A flex container that stacks rows. 
        We add px-2 for some horizontal padding on smaller screens.
      */}
      <div className="px-2 sm:px-0 flex flex-col items-center">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex justify-center gap-1 sm:gap-2 mb-1"
          >
            {Array.from({ length: wordLength }).map((_, colIndex) => {
              const letter = row.word[colIndex]
                ? row.word[colIndex].toUpperCase()
                : "";
              const status = row.feedback[colIndex] || "";

              return (
                <div
                  key={colIndex}
                  className={`
                    flex items-center justify-center border-2 rounded-md font-bold
                    ${getBgColor(status)}
                    // Responsive square sizes
                    w-6 h-6 text-xs
                    sm:w-8 sm:h-8 sm:text-sm
                    md:w-10 md:h-10 md:text-base
                    lg:w-12 lg:h-12 lg:text-lg
                  `}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Grid;
