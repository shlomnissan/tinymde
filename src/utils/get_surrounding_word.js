/**
 * Returns the position of the surrounding word based on the cursor's location
 * @param {string} text - The full text
 * @param {position} number - The cursor's location
 */
export default function getSurroundingWord(text, position) {
    if (!text) {
        console.error("Text parameter can't be empty.");
    }

    const isWordDelimiter = (c) => {
        return c === " " || c.charCodeAt(0) === 10 || c.charCodeAt(0) === 160;
    };

    let start = 0;
    for (let i = position; i - 1 >= 0; i--) {
        if (isWordDelimiter(text[i - 1])) {
            start = i;
            break;
        }
    }
    
    let end = text.length;
    for (let i = position; i < text.length; i++) {
        if (isWordDelimiter(text[i])) {
            end = i;
            break;
        }
    }

    return { start, end };
}
