import getRange from "./get_range";

/**
 * Make a dynamic text selection in the currently selected range.
 * @param {start: number, end: number} - selection range.
 */
export default function setSelection({ start, end }) {
    const range = getRange();
    if (!range) return;
    range.setStart(range.startContainer, start);
    range.setEnd(range.endContainer, end);
    return range.cloneContents().textContent;
}
