// Turns a raw speech-to-text transcript into { crop, qty } — the same
// crop/quantity/location extraction described in Section 2.2 of the
// project guide ("50 kilo tamatar, taiyar hai, Kolar se" -> crop=Tomato,
// qty=50). This is deliberately a simple keyword + regex match, not a
// language model — exactly the kind of rule-based parsing Section 7.3
// of the guide argues is the honest, hackathon-appropriate choice over
// something heavier. Location extraction is left out here since the
// farmer's location already comes from their profile/GPS, matching
// Section 3.1's "GPS auto-tagged" behaviour.

// Every crop keyword the parser recognizes, across both supported
// languages, mapped to the canonical English crop name used elsewhere in
// the app's data (kisanConnectData.js). Hindi crops are listed both in
// Devanagari (what hi-IN speech recognition returns) and romanized (what
// en-IN recognition tends to return when a farmer says the Hindi word),
// so "tamatar" works whichever language is selected.
const CROP_KEYWORDS = {
  Tomato: ["tomato", "tomatoes", "tamatar", "tamaatar", "\u091f\u092e\u093e\u091f\u0930", "\u091f\u092e\u093e\u091f\u0930\u094b\u0902"],
  Onion: ["onion", "onions", "pyaz", "pyaaz", "pyaj", "\u092a\u094d\u092f\u093e\u091c", "\u092a\u094d\u092f\u093e\u091c\u093c"],
  Potato: ["potato", "potatoes", "aloo", "alu", "aalu", "\u0906\u0932\u0942"],
};

// "50 kilo", "50kg", "50 \u0915\u093f\u0932\u094b" all reduce to the plain number 50 — the
// unit word itself doesn't need translating since we only look for digits.
const NUMBER_PATTERN = /\d+(\.\d+)?/;

export function parseVoiceListing(transcript) {
  if (!transcript) return null;

  const lower = transcript.toLowerCase();

  let matchedCrop = null;
  for (const [crop, keywords] of Object.entries(CROP_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      matchedCrop = crop;
      break;
    }
  }

  const numberMatch = transcript.match(NUMBER_PATTERN);
  const qty = numberMatch ? numberMatch[0] : null;

  if (!matchedCrop && !qty) return null;

  return { crop: matchedCrop, qty };
}
