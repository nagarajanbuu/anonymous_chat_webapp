
// List of inappropriate words and patterns to moderate
const INAPPROPRIATE_WORDS = [
  "stupid", "idiot", "dumb", "hate", "kill", "violence", "scam", "fraud", "fake", 
  "worthless", "trash", "ugly", "loser", "creep", "pervert", "bully", "harassment", 
  "racist", "sexist", "abuse", "threat", "destroy", "nasty", "disgusting", "gross", 
  "foul", "toxic", "insane", "maniac", "psycho", "pathetic", "jerk", "moron", 
  "troll", "spam", "explicit", "illegal", "banned", "obscene"
];

const INAPPROPRIATE_PATTERNS = [
  /you are so stupid/i,
  /i hate everyone/i,
  /go kill yourself/i,
  /full of trash/i,
  /worthless loser/i,
  /you're such a creep/i,
  /dumbest thing ever/i,
  /find you and hurt you/i,
  /nobody wants you/i,
  /you're disgusting/i,
  /don't belong here/i,
  /destroy your life/i,
  /fake person/i,
  /so ugly it hurts/i,
  /worst community ever/i,
  /hope you get banned/i,
  /get out.* moron/i,
  /mentally insane/i,
  /nothing but a scammer/i,
  /look like trash/i,
  /ideas are pathetic/i,
  /act like a.* psycho/i,
  /place for real people.* not losers/i,
  /everyone knows you're a fraud/i,
  /sound so dumb/i,
  /never show your face/i,
  /make your life miserable/i,
  /no one cares about you/i,
  /should be ashamed to exist/i,
  /why are you even alive/i,
  /opinion is worthless/i,
  /act like a spoiled brat/i,
  /such a toxic person/i,
  /could ruin you/i,
  /must have no life/i,
  /laughs at you behind your back/i,
  /face makes me sick/i,
  /go cry somewhere/i,
  /worst thing that happened/i,
  /no one will miss you/i
];

export const detectInappropriateContent = (text: string): boolean => {
  if (!text) return false;
  
  const lowerCaseText = text.toLowerCase();
  
  // Check for inappropriate words
  for (const word of INAPPROPRIATE_WORDS) {
    // Check if the text contains the word as a whole word (not part of another word)
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(lowerCaseText)) {
      return true;
    }
  }
  
  // Check for inappropriate patterns
  for (const pattern of INAPPROPRIATE_PATTERNS) {
    if (pattern.test(text)) {
      return true;
    }
  }
  
  return false;
};

export const moderateMessage = (text: string): string => {
  if (detectInappropriateContent(text)) {
    return text; // Return original text, but it will be flagged
  }
  return text;
};
