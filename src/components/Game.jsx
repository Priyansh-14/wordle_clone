import React, { useState, useEffect, useCallback } from "react";
import Grid from "./Grid";
import Keyboard from "./Keyboard";
import Settings from "./Settings";
import {
  getRandomWord,
  getFeedback,
  isValidWord,
  encodeWord,
  decodeWord,
} from "../utils/wordUtils";

const Game = () => {
  // Game settings
  const [wordLength, setWordLength] = useState(4);
  const [maxAttempts, setMaxAttempts] = useState(4);
  const [infiniteMode, setInfiniteMode] = useState(false);

  // Game state variables
  const [wordList, setWordList] = useState({});
  const [targetWord, setTargetWord] = useState("");
  // currentGuess is stored as an array of characters; initially empty.
  const [currentGuess, setCurrentGuess] = useState([]);
  // cursorIndex determines which cell is selected for editing.
  const [cursorIndex, setCursorIndex] = useState(0);
  const [guesses, setGuesses] = useState([]); // Completed guesses: { word, feedback }
  const [error, setError] = useState("");
  const [keyboardStatus, setKeyboardStatus] = useState({});
  const [gameOver, setGameOver] = useState(false);

  // Sharing features
  const [shareCode, setShareCode] = useState("");
  const [isSharedGame, setIsSharedGame] = useState(false);

  // Initialize currentGuess array whenever wordLength changes.
  useEffect(() => {
    setCurrentGuess(Array(wordLength).fill(""));
    setCursorIndex(0);
  }, [wordLength]);

  // Load words from words.json on mount.
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}words.json`)
      .then((res) => res.json())
      .then((data) => {
        setWordList(data);
        startNewGame(data, wordLength);
      })
      .catch((err) => console.error("Error loading words:", err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Start or restart the game.
  const startNewGame = useCallback(
    (words, length) => {
      if (!isSharedGame) {
        const validWords = Object.keys(words).filter(
          (w) => w.length === length
        );
        const newTarget = getRandomWord(validWords);
        setTargetWord(newTarget);
      }
      setGuesses([]);
      setCurrentGuess(Array(wordLength).fill(""));
      setCursorIndex(0);
      setError("");
      setKeyboardStatus({});
      setGameOver(false);
    },
    [isSharedGame, wordLength]
  );

  // Restart game when settings change (and not in shared mode).
  useEffect(() => {
    if (Object.keys(wordList).length > 0 && !isSharedGame) {
      startNewGame(wordList, wordLength);
    }
  }, [
    wordList,
    wordLength,
    maxAttempts,
    infiniteMode,
    startNewGame,
    isSharedGame,
  ]);

  // Wrap submitGuess in useCallback.
  const submitGuess = useCallback(() => {
    // Do not allow submission if any cell is empty or contains a dash.
    if (currentGuess.some((ch) => ch === "" || ch === "-")) {
      setError("Cannot submit: please fill every cell without dashes.");
      return;
    }
    const guessStr = currentGuess.join("");
    if (!isValidWord(guessStr, wordList)) {
      setError("Not a valid word.");
      return;
    }
    const feedback = getFeedback(guessStr, targetWord);
    updateKeyboardStatus(guessStr, feedback);
    const newGuess = { word: guessStr, feedback };
    const newGuesses = [...guesses, newGuess];
    setGuesses(newGuesses);
    setCurrentGuess(Array(wordLength).fill(""));
    setCursorIndex(0);

    if (guessStr === targetWord) {
      setGameOver(true);
    } else if (!infiniteMode && newGuesses.length >= maxAttempts) {
      setGameOver(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentGuess,
    wordList,
    targetWord,
    guesses,
    infiniteMode,
    maxAttempts,
    wordLength,
  ]);

  // Wrap updateKeyboardStatus in useCallback using a functional update.
  const updateKeyboardStatus = useCallback((guess, feedback) => {
    setKeyboardStatus((prevStatus) => {
      let newStatus = { ...prevStatus };
      for (let i = 0; i < guess.length; i++) {
        const letter = guess[i].toUpperCase();
        const status = feedback[i];
        if (newStatus[letter] === "correct") continue;
        if (newStatus[letter] === "present" && status === "absent") continue;
        newStatus[letter] = status;
      }
      return newStatus;
    });
  }, []);

  // Wrap handleKeyPress in useCallback.
  const handleKeyPress = useCallback(
    (key) => {
      if (gameOver) return;
      setError("");

      // Navigation: Arrow keys.
      if (key === "ArrowLeft") {
        if (cursorIndex > 0) setCursorIndex(cursorIndex - 1);
        return;
      }
      if (key === "ArrowRight") {
        if (cursorIndex < wordLength - 1) setCursorIndex(cursorIndex + 1);
        return;
      }

      // Enter: submit only if all cells are filled and none has a dash.
      if (key === "Enter") {
        if (currentGuess.some((ch) => ch === "" || ch === "-")) {
          setError(
            "Please fill every cell (dashes are not allowed) before submitting."
          );
          return;
        }
        submitGuess();
        return;
      }

      // Backspace / Delete: clear current cell or move left.
      if (key === "Backspace" || key === "Delete") {
        const newGuess = [...currentGuess];
        if (newGuess[cursorIndex] !== "") {
          newGuess[cursorIndex] = "";
          setCurrentGuess(newGuess);
        } else if (cursorIndex > 0) {
          const newIndex = cursorIndex - 1;
          newGuess[newIndex] = "";
          setCursorIndex(newIndex);
          setCurrentGuess(newGuess);
        }
        return;
      }

      // Space: instead of inserting an empty space, insert a dash.
      if (key === "Space" || key === " ") {
        const newGuess = [...currentGuess];
        newGuess[cursorIndex] = "-";
        setCurrentGuess(newGuess);
        if (cursorIndex < wordLength - 1) setCursorIndex(cursorIndex + 1);
        return;
      }

      // Letter keys: update the cell with the letter.
      if (/^[a-zA-Z]$/.test(key)) {
        const newGuess = [...currentGuess];
        newGuess[cursorIndex] = key.toLowerCase();
        setCurrentGuess(newGuess);
        if (cursorIndex < wordLength - 1) setCursorIndex(cursorIndex + 1);
        return;
      }
    },
    [gameOver, currentGuess, cursorIndex, wordLength, submitGuess]
  );

  // Listen for physical keyboard events.
  useEffect(() => {
    const handlePhysicalKeyDown = (event) => {
      const allowedKeys = [
        "Enter",
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "Space",
        " ",
      ];
      if (/^[a-zA-Z]$/.test(event.key)) {
        handleKeyPress(event.key);
      } else if (allowedKeys.includes(event.key)) {
        if (event.key === "Delete") {
          handleKeyPress("Backspace");
        } else if (event.key === " " || event.key === "Space") {
          handleKeyPress("Space");
        } else {
          handleKeyPress(event.key);
        }
      } else {
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handlePhysicalKeyDown);
    return () => {
      window.removeEventListener("keydown", handlePhysicalKeyDown);
    };
  }, [handleKeyPress]);

  const handleShare = () => {
    const encoded = encodeWord(targetWord);
    alert(`Share this code with your friends: ${encoded}`);
  };

  const handleLoadShare = () => {
    const decoded = decodeWord(shareCode);
    if (decoded && isValidWord(decoded, wordList)) {
      setWordLength(decoded.length);
      setTargetWord(decoded);
      setGuesses([]);
      setCurrentGuess(Array(decoded.length).fill(""));
      setCursorIndex(0);
      setError("");
      setKeyboardStatus({});
      setGameOver(false);
      setIsSharedGame(true);
    } else {
      setError("Invalid share code. Please enter a valid encoded word.");
    }
    setShareCode("");
  };

  const handleNewGame = () => {
    setIsSharedGame(false);
    startNewGame(wordList, wordLength);
  };

  const handleCellClick = (colIndex) => {
    if (!gameOver) {
      setCursorIndex(colIndex);
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
        Wordle
      </h1>

      <Settings
        wordLength={wordLength}
        setWordLength={setWordLength}
        maxAttempts={maxAttempts}
        setMaxAttempts={setMaxAttempts}
        infiniteMode={infiniteMode}
        setInfiniteMode={setInfiniteMode}
      />

      <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
        <input
          type="text"
          value={shareCode}
          onChange={(e) => setShareCode(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="Enter share code"
        />
        <button
          onClick={handleLoadShare}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
        >
          Load Word
        </button>
      </div>

      <Grid
        guesses={guesses}
        wordLength={wordLength}
        maxAttempts={infiniteMode ? guesses.length + 1 : maxAttempts}
        currentGuess={currentGuess}
        gameOver={gameOver}
        cursorIndex={cursorIndex}
        onCellClick={handleCellClick}
      />

      {error && (
        <p className="text-red-500 text-center mb-2 font-medium">{error}</p>
      )}

      {gameOver && (
        <div className="text-center my-4">
          {guesses[guesses.length - 1]?.word === targetWord ? (
            <p className="text-green-600 font-bold">
              Congratulations! You've guessed the word!
            </p>
          ) : (
            <p className="text-red-600 font-bold">
              Game Over! The word was: {targetWord.toUpperCase()}
            </p>
          )}
        </div>
      )}

      <div className="flex justify-center gap-3 mb-4">
        <button
          onClick={handleShare}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Share
        </button>
        <button
          onClick={handleNewGame}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          New Game
        </button>
      </div>

      <Keyboard
        keyboardStatus={keyboardStatus}
        onKeyPress={handleKeyPress}
        isEnterEnabled={currentGuess.every((ch) => ch !== "")}
      />
    </div>
  );
};

export default Game;
