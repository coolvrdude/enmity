import { emoji_mappings } from "./emoji-mappings";

const MAX_EMOJIS_PER_BLOCK = 2;

export function generateEmojipasta(text: string): string {
    let blocks = splitIntoBlocks(text);
    let newBlocks = [];
    blocks.forEach(block => {
        newBlocks.push(block);
        let emojis = generateEmojisFrom(block);
        if (emojis) {
            newBlocks.push(" " + emojis);
        }
    });
    return newBlocks.join("");
}

function splitIntoBlocks(text: string): RegExpMatchArray {
    return text.match(/\s*[^\s]*/g);
}

function generateEmojisFrom(block: string): string {
    var trimmedBlock = trimNonAlphanumericalChars(block);
    var matchingEmojis = getMatchingEmojis(trimmedBlock);
    var emojis = [];
    if (matchingEmojis) {
        var numEmojis = Math.floor(Math.random() * (MAX_EMOJIS_PER_BLOCK + 1));
        for (var i = 0; i < numEmojis; i++) {
            emojis.push(matchingEmojis[Math.floor(Math.random() * matchingEmojis.length)]);
        }
    }
    return emojis.join("");
}

function trimNonAlphanumericalChars(text: string): string {
    return text.replace(/^\W*/, "").replace(/\W*$/, "");
}

function getMatchingEmojis(word: string): string[] {
    var key = String(getAlphanumericPrefix(word.toLowerCase()));
    if (key in emoji_mappings) {
        return emoji_mappings[key];
    }
    return [];
}

function getAlphanumericPrefix(s: string): RegExpMatchArray {
    return s.match(/^[a-z0-9]*/i);
}
