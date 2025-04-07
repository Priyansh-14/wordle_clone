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
  // Game settings state
  const [wordLength, setWordLength] = useState(4);
  const [maxAttempts, setMaxAttempts] = useState(4);
  const [infiniteMode, setInfiniteMode] = useState(false);

  // Game state variables
  const [wordList, setWordList] = useState({});
  const [targetWord, setTargetWord] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [error, setError] = useState("");
  const [keyboardStatus, setKeyboardStatus] = useState({});
  const [gameOver, setGameOver] = useState(false);

  // Sharing features
  const [shareCode, setShareCode] = useState("");
  const [isSharedGame, setIsSharedGame] = useState(false);

  // Load words from local words.json on mount
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

  // Start or restart the game
  const startNewGame = useCallback(
    (words, length) => {
      if (!isSharedGame) {
        // Filter valid words by selected length
        const validWords = Object.keys(words).filter(
          (w) => w.length === length
        );
        const newTarget = getRandomWord(validWords);
        setTargetWord(newTarget);
      }
      setGuesses([]);
      setCurrentGuess("");
      setError("");
      setKeyboardStatus({});
      setGameOver(false);
    },
    [isSharedGame]
  );

  // Reset the game if settings change (unless we are in a shared game)
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

  // Handle on-screen keyboard input
  const handleKeyPress = (key) => {
    if (gameOver) return;
    setError("");

    if (key === "Enter") {
      if (currentGuess.length === wordLength) {
        submitGuess();
      }
    } else if (key === "Backspace") {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else {
      if (currentGuess.length < wordLength) {
        setCurrentGuess((prev) => prev + key.toLowerCase());
      }
    }
  };

  // Submit the current guess
  const submitGuess = () => {
    if (currentGuess.length !== wordLength) {
      setError(`Guess must be ${wordLength} letters long.`);
      return;
    }
    if (!isValidWord(currentGuess, wordList)) {
      setError("Not a valid word.");
      return;
    }

    const feedback = getFeedback(currentGuess, targetWord);
    updateKeyboardStatus(currentGuess, feedback);

    const newGuess = { word: currentGuess, feedback };
    const newGuesses = [...guesses, newGuess];
    setGuesses(newGuesses);
    setCurrentGuess("");

    // Check if correct or out of attempts
    if (currentGuess === targetWord) {
      setGameOver(true);
    } else if (!infiniteMode && newGuesses.length >= maxAttempts) {
      setGameOver(true);
    }
  };

  // Update keyboard letters based on feedback
  const updateKeyboardStatus = (guess, feedback) => {
    const newStatus = { ...keyboardStatus };
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i].toUpperCase();
      const status = feedback[i];
      // Priority: correct > present > absent
      if (newStatus[letter] === "correct") continue;
      if (newStatus[letter] === "present" && status === "absent") continue;
      newStatus[letter] = status;
    }
    setKeyboardStatus(newStatus);
  };

  // Generate a share code
  const handleShare = () => {
    const encoded = encodeWord(targetWord);
    alert(`Share this code with your friends: ${encoded}`);
  };

  // Load a shared word from a code
  const handleLoadShare = () => {
    const decoded = decodeWord(shareCode);
    if (decoded) {
      setWordLength(decoded.length);
      setTargetWord(decoded);
      setGuesses([]);
      setCurrentGuess("");
      setError("");
      setKeyboardStatus({});
      setGameOver(false);
      setIsSharedGame(true);
    } else {
      setError("Invalid share code.");
    }
    setShareCode("");
  };

  // Cancel shared mode and start fresh
  const handleNewGame = () => {
    setIsSharedGame(false);
    startNewGame(wordList, wordLength);
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
        Wordle-like Game
      </h1>

      {/* Settings */}
      <Settings
        wordLength={wordLength}
        setWordLength={setWordLength}
        maxAttempts={maxAttempts}
        setMaxAttempts={setMaxAttempts}
        infiniteMode={infiniteMode}
        setInfiniteMode={setInfiniteMode}
      />

      {/* Share code input */}
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

      {/* Game Grid */}
      <Grid
        guesses={guesses}
        wordLength={wordLength}
        maxAttempts={infiniteMode ? guesses.length + 1 : maxAttempts}
        currentGuess={currentGuess}
        gameOver={gameOver}
      />

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-center mb-2 font-medium">{error}</p>
      )}

      {/* Win / Loss Message */}
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

      {/* Share & New Game Buttons */}
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

      {/* On-screen keyboard */}
      <Keyboard
        keyboardStatus={keyboardStatus}
        onKeyPress={handleKeyPress}
        isEnterEnabled={currentGuess.length === wordLength}
      />
    </div>
  );
};

export default Game;
