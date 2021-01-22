/**
 * Returns the range of the current selection. This function assumes that a selection is set.
 * @return {Range}
 */
export function getRange() {
    if (!document.getSelection) {
        console.error("documnt.getSelection() isn't supported.");
        return;
    }
    const selection = document.getSelection();
    return selection.getRangeAt(0);
}

/**
 * Returns the position of the surrounding word based on the cursor's location.
 * @param {string} text - The full text.
 * @param {number} position - The cursor's location.
 * @return {Object} - { start: number, end: number }.
 */
export function getSurroundingWord(text, position) {
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

/**
 * Returns the text and cursor's position.
 * @param {HTMLDivElement} editor - contentEditable div tag.
 * @return {Object} - {text: string, position: number}.
 */
export function getTextState(editor) {
    editor.focus();
    const range = getRange();
    if (!range) return;
    const wholeText = range.startContainer?.wholeText || "";
    return {
        text: wholeText,
        position: range.startOffset,
    };
}

/**
 * Make a dynamic text selection in the currently selected range.
 * @param {Object} - { start: number, end: number }.
 */
export function setSelection({ start, end }) {
    const range = getRange();
    if (!range) return;
    range.setStart(range.startContainer, start);
    range.setEnd(range.endContainer, end);
    return range.cloneContents().textContent;
}