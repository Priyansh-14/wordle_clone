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
    // <div className="overflow-x-auto w-full">
    //   <div className="px-2 sm:px-0 flex flex-col items-center my-4">
    //     {rows.map((row, rowIndex) => (
    //       <div
    //         key={rowIndex}
    //         className="flex justify-center gap-1 sm:gap-2 mb-1"
    //       >
    //         {Array.from({ length: wordLength }).map((_, colIndex) => {
    //           const letter = row.word[colIndex]
    //             ? row.word[colIndex].toUpperCase()
    //             : "";
    //           const status = row.feedback[colIndex] || "";
    //           const isEditable = row.isCurrent && !gameOver;
    //           const isSelected = isEditable && cursorIndex === colIndex;
    //           return (
    //             <div
    //               key={colIndex}
    //               onClick={() => isEditable && onCellClick(colIndex)}
    //               className={`
    //                 flex items-center justify-center border border-gray-500 rounded-md font-bold
    //                 ${getBgColor(status)}
    //                 ${isSelected ? "ring-2 ring-blue-500" : ""}
    //                 w-8 h-8 text-sm
    //                 sm:w-10 sm:h-10 sm:text-base
    //                 md:w-12 md:h-12 md:text-lg
    //                 lg:w-14 lg:h-14 lg:text-xl
    //               `}
    //             >
    //               {letter}
    //             </div>
    //           );
    //         })}
    //       </div>
    //     ))}
    //   </div>
    // </div>
    // outer wrapper: full-width on small, caps at md/lg on larger screens
    <div className="w-full max-w-[80vw] md:max-w-sm lg:max-w-md mx-auto px-2 sm:px-0 my-4">
      {rows.map((row, rowIndex) => (
        // each row is a CSS grid with `wordLength` equal columns
        <div
          key={rowIndex}
          className="grid gap-1 sm:gap-2 mb-1 w-full"
          style={{
            gridTemplateColumns: `repeat(${wordLength}, minmax(0, 1fr))`,
          }}
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
                  aspect-square flex items-center justify-center
                  border border-gray-500 rounded-md font-bold
                  ${getBgColor(status)}
                  ${isSelected ? "ring-2 ring-blue-500" : ""}
                `}
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
