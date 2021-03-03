/**
 * Returns the currently active range.
 * @return {Range}
 */
function getActiveRange() {
    if (!document.getSelection) {
        console.error("TinyMDE: documnt.getSelection() isn't supported.");
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
 * @keep
 */
export function getContainerFromActiveRange() {
    const range = getActiveRange();
    if (!range) return null;

    let container = range.startContainer;
    if (!container) return;

    return container.nodeType === Node.TEXT_NODE
        ? container
        : range.startContainer.firstChild;
}

/**
 * @keep
 */
export function selectContentInActiveRange({ start, end }) {
    const container = getContainerFromActiveRange();
    if (!container) return;

    const range = getActiveRange();

    range.setStart(container, start);
    range.setEnd(container, end);

    return range.cloneContents().textContent;
}

/**
 * @deprecated
 */
export function getParagraph() {
    let container = window.getSelection().anchorNode.parentElement;
    while (!container.classList.contains("tinymde-paragraph")) {
        if (container.parentElement === null) return;
        container = container.parentElement;
    }
    return container;
}

/**
 * @deprecated
 */
export function selectContents(element, offset) {
    const sel = window.getSelection();
    const range = new Range();
    if (element.nodeType === Node.TEXT_NODE) {
        range.setStart(element.firstChild, offset);
        range.setEnd(element.firstChild, element.innerText.length - offset);
    } else {
        range.setStart(element.firstChild, 0);
        range.setEndAfter(element.lastChild);
    }
    sel.removeAllRanges();
    sel.addRange(range);
}

/**
 * @keep
 */
const regex = new RegExp(`^(\\#{1,6}\\s)|(\\>\\s)(.*?)`, "g");
export function stripParagraphMarkdown(text) {
    const match = text.match(regex);
    if (match) {
        const offset = match[0].length;
        return {
            text: text.substring(offset),
            offset,
        };
    }
    return { text, offset: 0 };
}
