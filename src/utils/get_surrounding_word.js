/**
 * Returns the position of the surrounding word based on the cursor's location.
 * @param {string} text - The full text.
 * @param {number} position - The cursor's location.
 * @return {Object} - { start: number, end: number }.
 */
export default function getSurroundingWord(text, position) {
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
