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
  const [wordLength, setWordLength] = useState(5);
  const [maxAttempts, setMaxAttempts] = useState(5);
  const [infiniteMode, setInfiniteMode] = useState(false);

  // Game state
  const [wordList, setWordList] = useState({});
  const [targetWord, setTargetWord] = useState("");
  const [currentGuess, setCurrentGuess] = useState([]);
  const [cursorIndex, setCursorIndex] = useState(0);
  const [guesses, setGuesses] = useState([]);
  const [keyboardStatus, setKeyboardStatus] = useState({});
  const [gameOver, setGameOver] = useState(false);
  const [error, setError] = useState("");

  // Share modal state
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const [isSharedGame, setIsSharedGame] = useState(false);

  // On mount: load words & check for ?code=…
  useEffect(() => {
    // load word list
    fetch(`${import.meta.env.BASE_URL}words.json`)
      .then((res) => res.json())
      .then((data) => {
        setWordList(data);
        // after loading, check URL
        const params = new URLSearchParams(window.location.search);
        if (params.has("code")) {
          const decoded = decodeWord(params.get("code"));
          if (decoded && isValidWord(decoded, data)) {
            setWordLength(decoded.length);
            setTargetWord(decoded);
            setIsSharedGame(true);
          } else {
            setError("Invalid share code in URL");
            startNewGame(data, wordLength);
          }
        } else {
          startNewGame(data, wordLength);
        }
      })
      .catch((err) => {
        console.error("Error loading words:", err);
        startNewGame({}, wordLength);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Start new game
  const startNewGame = useCallback(
    (words, length) => {
      if (!isSharedGame && Object.keys(words).length) {
        const valid = Object.keys(words).filter((w) => w.length === length);
        setTargetWord(getRandomWord(valid));
      }
      setGuesses([]);
      setCurrentGuess(Array(length).fill(""));
      setCursorIndex(0);
      setKeyboardStatus({});
      setGameOver(false);
      setError("");
    },
    [isSharedGame]
  );

  // Whenever settings change (and not a shared game), restart
  useEffect(() => {
    if (!isSharedGame && Object.keys(wordList).length) {
      startNewGame(wordList, wordLength);
    }
  }, [
    wordLength,
    maxAttempts,
    infiniteMode,
    isSharedGame,
    wordList,
    startNewGame,
  ]);

  // Initialize currentGuess on wordLength
  useEffect(() => {
    setCurrentGuess(Array(wordLength).fill(""));
    setCursorIndex(0);
  }, [wordLength]);

  // Update keyboard status
  const updateKeyboardStatus = useCallback((guess, feedback) => {
    setKeyboardStatus((prev) => {
      const next = { ...prev };
      guess.split("").forEach((ch, i) => {
        const L = ch.toUpperCase(),
          s = feedback[i];
        if (next[L] === "correct") return;
        if (next[L] === "present" && s === "absent") return;
        next[L] = s;
      });
      return next;
    });
  }, []);

  // Submit guess
  const submitGuess = useCallback(() => {
    if (currentGuess.some((c) => !c || c === "-")) {
      setError("Fill every cell (no dashes) before submitting.");
      return;
    }
    const str = currentGuess.join("");
    if (!isValidWord(str, wordList)) {
      setError("Not valid");
      return;
    }
    const fb = getFeedback(str, targetWord);
    updateKeyboardStatus(str, fb);
    const nextGuesses = [...guesses, { word: str, feedback: fb }];
    setGuesses(nextGuesses);
    setCurrentGuess(Array(wordLength).fill(""));
    setCursorIndex(0);
    if (str === targetWord) setGameOver(true);
    else if (!infiniteMode && nextGuesses.length >= maxAttempts)
      setGameOver(true);
  }, [
    currentGuess,
    guesses,
    infiniteMode,
    maxAttempts,
    targetWord,
    wordList,
    wordLength,
    updateKeyboardStatus,
  ]);

  // Handle key (onscreen + physical)
  const handleKeyPress = useCallback(
    (key) => {
      if (gameOver) return;
      setError("");
      if (key === "ArrowLeft") {
        if (cursorIndex > 0) setCursorIndex(cursorIndex - 1);
        return;
      }
      if (key === "ArrowRight") {
        if (cursorIndex < wordLength - 1) setCursorIndex(cursorIndex + 1);
        return;
      }
      if (key === "Enter") {
        if (currentGuess.some((c) => !c || c === "-")) {
          setError("Fill every cell before submitting.");
          return;
        }
        submitGuess();
        return;
      }
      if (key === "Backspace" || key === "Delete") {
        const g = [...currentGuess];
        if (g[cursorIndex]) {
          g[cursorIndex] = "";
          setCurrentGuess(g);
        } else if (cursorIndex > 0) {
          const ni = cursorIndex - 1;
          g[ni] = "";
          setCursorIndex(ni);
          setCurrentGuess(g);
        }
        return;
      }
      if (key === "Space" || key === " ") {
        const g = [...currentGuess];
        g[cursorIndex] = "-";
        setCurrentGuess(g);
        if (cursorIndex < wordLength - 1) setCursorIndex(cursorIndex + 1);
        return;
      }
      if (/^[a-zA-Z]$/.test(key)) {
        const g = [...currentGuess];
        g[cursorIndex] = key.toLowerCase();
        setCurrentGuess(g);
        if (cursorIndex < wordLength - 1) setCursorIndex(cursorIndex + 1);
      }
    },
    [cursorIndex, currentGuess, gameOver, wordLength, submitGuess]
  );

  // Physical keyboard listener
  useEffect(() => {
    const onDown = (e) => {
      const k = e.key;
      if (
        /^[a-zA-Z]$/.test(k) ||
        [
          "Enter",
          "Backspace",
          "Delete",
          "ArrowLeft",
          "ArrowRight",
          "Space",
          " ",
        ].includes(k)
      ) {
        e.preventDefault();
        handleKeyPress(k === " " ? "Space" : k);
      }
    };
    window.addEventListener("keydown", onDown);
    return () => window.removeEventListener("keydown", onDown);
  }, [handleKeyPress]);

  // Share URL modal
  const onShare = () => {
    const code = encodeWord(targetWord);
    const url = `${window.location.origin}${window.location.pathname}?code=${code}`;
    setShareUrl(url);
    setCopied(false);
    setShowShareModal(true);
  };
  const onCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => setCopied(true));
  };

  // New Game at top
  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-4 sm:p-6 relative">
      {/* New Game button */}
      <div className="flex justify-end mb-2">
        <button
          onClick={() => {
            setIsSharedGame(false);
            window.history.replaceState(null, "", window.location.pathname);
            startNewGame(wordList, wordLength);
          }}
          className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          New Game
        </button>
      </div>

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

      {/* Share button only after game over */}
      {gameOver && (
        <div className="flex justify-center mb-4">
          <button
            onClick={onShare}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Share
          </button>
        </div>
      )}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-11/12 max-w-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Share this Game
            </h2>
            <p className="text-gray-600 mb-4">
              Copy the link below to invite your friends to play:
            </p>
            <div className="flex">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={onCopy}
                className={`px-4 py-2 rounded-r-lg text-white font-medium transition ${
                  copied
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <button
              onClick={() => setShowShareModal(false)}
              className="mt-5 w-full text-center text-sm text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Game grid */}
      <Grid
        guesses={guesses}
        wordLength={wordLength}
        maxAttempts={infiniteMode ? guesses.length + 1 : maxAttempts}
        currentGuess={currentGuess}
        gameOver={gameOver}
        cursorIndex={cursorIndex}
        onCellClick={(ci) => !gameOver && setCursorIndex(ci)}
      />

      {error && <p className="text-red-500 text-center mb-2">{error}</p>}

      {gameOver && (
        <div className="text-center my-4">
          {guesses[guesses.length - 1].word === targetWord ? (
            <p className="text-green-600 font-bold">
              Congratulations! You’ve guessed it!
            </p>
          ) : (
            <p className="text-red-600 font-bold">
              Game Over! It was: {targetWord.toUpperCase()}
            </p>
          )}
        </div>
      )}

      {/* On-screen keyboard */}
      <Keyboard
        keyboardStatus={keyboardStatus}
        onKeyPress={handleKeyPress}
        isEnterEnabled={currentGuess.every((c) => c)}
      />
    </div>
  );
};

export default Game;
