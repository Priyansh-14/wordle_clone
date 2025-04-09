/**
 * Utility functions for the Wordle-like game.
 */

const TEST_MODE = false;
const TEST_WORD = "broom";

// Returns a random word from the provided list
export const getRandomWord = (words) => {
  if (TEST_MODE) {
    console.log("Test mode active. Returning test word:", TEST_WORD);
    return TEST_WORD;
  }
  if (!words || words.length === 0) return "";
  const randomIndex = Math.floor(Math.random() * words.length);
  console.log("Random word:", words[randomIndex]);
  return words[randomIndex];
};

// Validates whether a guessed word exists in the word list
export const isValidWord = (word, wordList) => {
  return Object.prototype.hasOwnProperty.call(wordList, word.toLowerCase());
};

// Generates feedback for each letter in the guess relative to the target word.
// 'correct'  : letter is in the right position
// 'present'  : letter exists in the word but in the wrong position
// 'absent'   : letter does not exist in the target word
export const getFeedback = (guess, target) => {
  guess = guess.toLowerCase();
  target = target.toLowerCase();
  const feedback = Array(guess.length).fill("absent");
  const targetLetters = target.split("");
  const guessLetters = guess.split("");

  // First pass: mark letters that are correct (right letter, right position)
  for (let i = 0; i < guessLetters.length; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      feedback[i] = "correct";
      targetLetters[i] = null; // Remove letter from consideration
    }
  }
  // Second pass: mark letters that are present but in the wrong position
  for (let i = 0; i < guessLetters.length; i++) {
    if (feedback[i] === "correct") continue;
    const index = targetLetters.indexOf(guessLetters[i]);
    if (index !== -1) {
      feedback[i] = "present";
      targetLetters[index] = null;
    }
  }
  return feedback;
};

// Encodes the target word using Base64 encoding for the share feature
export const encodeWord = (word) => {
  return btoa(word);
};

// Decodes the target word using Base64 decoding (for loading a shared word)
export const decodeWord = (encoded) => {
  try {
    return atob(encoded);
  } catch (err) {
    console.error("Failed to decode word:", err);
    return "";
  }
};
