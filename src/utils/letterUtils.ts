
import { LoveLetter } from "../types";

// Generate a unique ID for the letter
export const generateUniqueId = (): string => {
  return Math.random().toString(36).substring(2, 8) + 
         Date.now().toString(36).substring(4);
};

// Save letter to localStorage
export const saveLetter = (letter: LoveLetter): void => {
  try {
    // Get existing letters
    const existingLetters = localStorage.getItem('loveLetters');
    const letters = existingLetters ? JSON.parse(existingLetters) : {};
    
    // Add new letter
    letters[letter.id] = letter;
    
    // Save back to localStorage
    localStorage.setItem('loveLetters', JSON.stringify(letters));
  } catch (error) {
    console.error('Error saving letter:', error);
  }
};

// Get letter by ID
export const getLetter = (id: string): LoveLetter | null => {
  try {
    const existingLetters = localStorage.getItem('loveLetters');
    if (!existingLetters) return null;
    
    const letters = JSON.parse(existingLetters);
    return letters[id] || null;
  } catch (error) {
    console.error('Error retrieving letter:', error);
    return null;
  }
};

// Get all background style options
export const getBackgroundStyles = () => [
  {
    id: 'default',
    name: 'Default',
    className: 'bg-gradient-to-r from-love-pink to-love-peach'
  },
  {
    id: 'roses',
    name: 'Roses',
    className: 'bg-gradient-to-r from-love-red/20 to-love-pink'
  },
  {
    id: 'lavender',
    name: 'Lavender',
    className: 'bg-gradient-to-r from-love-purple to-love-secondary/30'
  },
  {
    id: 'sunset',
    name: 'Sunset',
    className: 'bg-gradient-to-r from-orange-100 to-love-peach'
  },
  {
    id: 'elegant',
    name: 'Elegant',
    className: 'bg-gradient-to-r from-white to-gray-100'
  }
];
