import React from "react";

const Grid = ({
  guesses,
  wordLength,
  maxAttempts,
  currentGuess,
  gameOver,
  cursorIndex,
  onCellClick,
}) => {
  // Build an array of rows: completed guesses and the current guess row
  const rows = [];
  for (let i = 0; i < maxAttempts; i++) {
    if (i < guesses.length) {
      rows.push({
        word: guesses[i].word,
        feedback: guesses[i].feedback,
        isCurrent: false,
      });
    } else if (i === guesses.length && !gameOver) {
      rows.push({
        word: currentGuess,
        feedback: Array(wordLength).fill(""),
        isCurrent: true,
      });
    } else {
      rows.push({
        word: Array(wordLength).fill(""),
        feedback: Array(wordLength).fill(""),
        isCurrent: false,
      });
    }
  }

  // Determine background color based on feedback status
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
    <div className="overflow-x-auto w-full">
      <div className="px-2 sm:px-0 flex flex-col items-center my-4">
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
              const isEditable = row.isCurrent && !gameOver;
              const isSelected = isEditable && cursorIndex === colIndex;
              return (
                <div
                  key={colIndex}
                  onClick={() => isEditable && onCellClick(colIndex)}
                  className={`
                    flex items-center justify-center border-2 rounded-md font-bold
                    ${getBgColor(status)}
                    ${isSelected ? "ring-2 ring-blue-500" : ""}
                    w-6 h-6 text-xs sm:w-8 sm:h-8 sm:text-sm md:w-10 md:h-10 md:text-base lg:w-12 lg:h-12 lg:text-lg
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
