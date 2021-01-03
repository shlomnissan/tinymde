import getRange from "./get_range";

/**
 * Make a dynamic text selection in the currently selected range.
 * @param {Object} - { start: number, end: number }.
 */
export default function setSelection({ start, end }) {
    const range = getRange();
    if (!range) return;
    range.setStart(range.startContainer, start);
    range.setEnd(range.endContainer, end);
    return range.cloneContents().textContent;
}
