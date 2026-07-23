/**
 * Student Name Validator
 * Ensures student provides a real, coherent full name (First and Last Name)
 * Blocks joke names (e.g. "pepito", "tomate"), single words, numbers, and gibberish.
 */

const JOKE_WORDS = new Set([
  "pepito", "tomate", "banana", "manzana", "pera", "papaya", "limon", "cebolla",
  "gato", "perro", "hola", "test", "prueba", "admin", "user", "unknown",
  "anonymous", "anonimo", "nadie", "asdf", "qwerty", "zxcv", "abcd", "1234",
  "ninguno", "chiste", "loco", "fea", "feo", "tonto", "tonta", "caca", "pipi",
  "puto", "puta", "pendejo", "verga", "mierda", "basura", "tarado", "idiota",
  "burro", "mula", "tontin", "null", "undefined", "none", "n/a", "na"
]);

export interface NameValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateStudentName(name: string): NameValidationResult {
  if (!name || typeof name !== "string") {
    return { isValid: false, error: "Please enter your full name." };
  }

  const trimmed = name.trim();

  // 1. Length check
  if (trimmed.length < 5) {
    return { isValid: false, error: "Please enter your real full name (First and Last Name)." };
  }

  if (trimmed.length > 60) {
    return { isValid: false, error: "Name is too long. Please enter a valid name." };
  }

  // 2. Character check (letters, accents, spaces, hyphens, apostrophes)
  const validCharsRegex = /^[a-zA-ZáéíóúñÁÉÍÓÚÑüÜ\s'-]+$/;
  if (!validCharsRegex.test(trimmed)) {
    return { isValid: false, error: "Name must contain only letters." };
  }

  // 3. Must contain at least 2 words (First Name + Last Name)
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length < 2) {
    return { isValid: false, error: "Please enter both your First Name and Last Name (e.g. Juan Pérez)." };
  }

  // 4. Each word must be at least 2 letters long
  for (const word of words) {
    if (word.length < 2) {
      return { isValid: false, error: "Each part of your name must be at least 2 letters long." };
    }
  }

  // 5. Joke word / Blacklist check
  for (const word of words) {
    const cleanWord = word.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (JOKE_WORDS.has(cleanWord)) {
      return { isValid: false, error: `"${word}" is not recognized as a valid name. Please enter your real name.` };
    }
  }

  // 6. Repeated characters check (e.g. "aaaaa", "zzzzz")
  if (/(.)\1{3,}/i.test(trimmed)) {
    return { isValid: false, error: "Please enter a valid human name without repeating letters." };
  }

  return { isValid: true };
}
