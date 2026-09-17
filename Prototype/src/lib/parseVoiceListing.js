// Turns a raw speech-to-text transcript into { crop, qty }
// Supports English, Hindi, and Kannada natural voice listings.
// Example: "50 kilo tomato" / "50 किलो टमाटर" / "50 ಕೆಜಿ ಟೊಮೆಟೊ" / "ಐವತ್ತು ಕೆಜಿ ಈರುಳ್ಳಿ"

const CROP_KEYWORDS = {
  Tomato: [
    "tomato", "tomatoes", "tamatar", "tamater", "tamata",
    "टमाटर", "टमाटरों",
    "ಟೊಮೆಟೊ", "ಟೊಮ್ಯಾಟೊ", "ಟೊಮೇಟೊ", "ತಮಾಟೆ", "ಟೊಮಾಟೋ", "ಟೊಮಾಟೊ",
  ],
  Onion: [
    "onion", "onions", "pyaz", "pyaaz", "pyaj",
    "प्याज", "प्याज़",
    "ಈರುಳ್ಳಿ", "ಉಳ್ಳಾಗಡ್ಡಿ", "ಉಳ್ಳೇಗಡ್ಡಿ", "ಈರುಳ್ಳಿಗಳು", "ಈರುಳ್ಳಿಯ",
  ],
  Potato: [
    "potato", "potatoes", "aloo", "alu", "batata",
    "आलू", "आलूओं",
    "ಆಲೂಗಡ್ಡೆ", "ಆಲೂ", "ಆಲೂಗಡ್ಡೆಗಳು", "ಆಲುಗಡ್ಡೆ",
  ],
};

// Kannada & Hindi numeral word mappings to numbers
const WORD_NUMBERS = {
  // Kannada
  "ಹತ್ತು": "10", "ಇಪ್ಪತ್ತು": "20", "ಮೂವತ್ತು": "30", "ನಲವತ್ತು": "40", "ಐವತ್ತು": "50",
  "ಅರವತ್ತು": "60", "ಎಪ್ಪತ್ತು": "70", "ಎಂಭತ್ತು": "80", "ತೊಂಬತ್ತು": "90", "ನೂರು": "100",
  "ಒಂದು": "1", "ಎರಡು": "2", "ಮೂರು": "3", "ನಾಲ್ಕು": "4", "ಐದು": "5",
  "ಆರು": "6", "ಏಳು": "7", "ಎಂಟು": "8", "ಒಂಬತ್ತು": "9",
  // Hindi
  "दस": "10", "बीस": "20", "तीस": "30", "चालीस": "40", "पचास": "50",
  "साठ": "60", "सत्तर": "70", "अस्सी": "80", "नब्बे": "90", "सौ": "100",
  "एक": "1", "दो": "2", "तीन": "3", "चार": "4", "पांच": "5",
};

// Kannada digits to standard ASCII digits: ೦-೯ -> 0-9
const KANNADA_DIGITS = {
  "೦": "0", "೧": "1", "೨": "2", "೩": "3", "೪": "4",
  "೫": "5", "೬": "6", "೭": "7", "೮": "8", "೯": "9",
};

const NUMBER_PATTERN = /\d+(\.\d+)?/;

export function parseVoiceListing(transcript) {
  if (!transcript) return null;

  let normalized = transcript.toLowerCase();

  // Convert Kannada digits to standard digits
  for (const [kDigit, ascDigit] of Object.entries(KANNADA_DIGITS)) {
    normalized = normalized.replaceAll(kDigit, ascDigit);
  }

  // Convert spoken number words
  for (const [word, num] of Object.entries(WORD_NUMBERS)) {
    if (normalized.includes(word)) {
      normalized = normalized.replace(word, ` ${num} `);
      break;
    }
  }

  // Match crop
  let matchedCrop = null;
  for (const [crop, keywords] of Object.entries(CROP_KEYWORDS)) {
    if (keywords.some((kw) => normalized.includes(kw.toLowerCase()))) {
      matchedCrop = crop;
      break;
    }
  }

  // Match quantity number
  const numberMatch = normalized.match(NUMBER_PATTERN);
  const qty = numberMatch ? numberMatch[0] : null;

  if (!matchedCrop && !qty) return null;

  return { crop: matchedCrop, qty };
}
