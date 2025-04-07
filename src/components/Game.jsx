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

// Main Game component manages the overall game state and logic
const Game = () => {
  // Game settings state
  const [wordLength, setWordLength] = useState(4);
  const [maxAttempts, setMaxAttempts] = useState(4);
  const [infiniteMode, setInfiniteMode] = useState(false);

  // Game state variables
  const [wordList, setWordList] = useState({});
  const [targetWord, setTargetWord] = useState("");
  const [guesses, setGuesses] = useState([]); // Each guess: { word, feedback }
  const [currentGuess, setCurrentGuess] = useState("");
  const [error, setError] = useState("");
  const [keyboardStatus, setKeyboardStatus] = useState({}); // Mapping letter -> status ('correct', 'present', 'absent')
  const [gameOver, setGameOver] = useState(false);

  // New state for sharing features
  const [shareCode, setShareCode] = useState("");
  const [isSharedGame, setIsSharedGame] = useState(false);

  // Load words from the local words.json file on component mount
  useEffect(() => {
    fetch("/words.json")
      .then((res) => res.json())
      .then((data) => {
        setWordList(data);
        // Start a new game once the word list is loaded
        startNewGame(data, wordLength);
      })
      .catch((err) => console.error("Error loading words:", err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Wrap startNewGame with useCallback so it is stable between renders
  const startNewGame = useCallback(
    (words, length) => {
      // Only start a random game if not in shared game mode.
      if (!isSharedGame) {
        // Filter valid words by the selected length
        const validWords = Object.keys(words).filter(
          (word) => word.length === length
        );
        // Randomly select a target word from the valid words
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

  // Reset the game when settings change (but only if not in shared mode)
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

  // Function to handle key presses from the on-screen keyboard
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
      // Append letter if current guess is not full
      if (currentGuess.length < wordLength) {
        setCurrentGuess((prev) => prev + key.toLowerCase());
      }
    }
  };

  // Function to submit the current guess (called on Enter key press)
  const submitGuess = () => {
    if (currentGuess.length !== wordLength) {
      setError(`Guess must be ${wordLength} letters long.`);
      return;
    }
    if (!isValidWord(currentGuess, wordList)) {
      setError("Not a valid word.");
      return;
    }
    // Get feedback for the guess (correct, present, absent)
    const feedback = getFeedback(currentGuess, targetWord);
    // Update the on‑screen keyboard based on feedback
    updateKeyboardStatus(currentGuess, feedback);
    // Add the new guess to the guesses array
    const newGuess = { word: currentGuess, feedback };
    const newGuesses = [...guesses, newGuess];
    setGuesses(newGuesses);
    setCurrentGuess("");

    // Check if the guess matches the target word or if the max attempts are reached
    if (currentGuess === targetWord) {
      setGameOver(true);
    } else if (!infiniteMode && newGuesses.length >= maxAttempts) {
      setGameOver(true);
    }
  };

  // Update the keyboard status mapping based on the feedback of the current guess
  const updateKeyboardStatus = (guess, feedback) => {
    const newStatus = { ...keyboardStatus };
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i].toUpperCase();
      const status = feedback[i];
      // Priority: 'correct' > 'present' > 'absent'
      if (newStatus[letter] === "correct") continue;
      if (newStatus[letter] === "present" && status === "absent") continue;
      newStatus[letter] = status;
    }
    setKeyboardStatus(newStatus);
  };

  // Generate and display a shareable code for the target word (encoded with Base64)
  const handleShare = () => {
    const encoded = encodeWord(targetWord);
    alert(`Share this code with your friends: ${encoded}`);
  };

  // Handle loading a shared word from the provided share code
  const handleLoadShare = () => {
    const decoded = decodeWord(shareCode);
    if (decoded) {
      // Optionally update the word length to match the shared word
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

  // Function to start a new game that cancels shared mode
  const handleNewGame = () => {
    setIsSharedGame(false);
    startNewGame(wordList, wordLength);
  };

  return (
    <div className="max-w-sm w-full bg-white rounded-xl shadow-lg p-6">
      <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
        Wordle-like Game
      </h1>

      <Settings
        wordLength={wordLength}
        setWordLength={setWordLength}
        maxAttempts={maxAttempts}
        setMaxAttempts={setMaxAttempts}
        infiniteMode={infiniteMode}
        setInfiniteMode={setInfiniteMode}
      />

      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={shareCode}
          onChange={(e) => setShareCode(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
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
      />

      {error && (
        <p className="text-red-500 text-center mb-2 font-medium">{error}</p>
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
        isEnterEnabled={currentGuess.length === wordLength}
      />
    </div>
  );
};

export default Game;
