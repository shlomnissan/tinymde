import getRange from "./get_range";

/**
 * Returns the text and cursor's position.
 * @param {HTMLDivElement} editor - contentEditable div tag.
 * @return {Object} - {text: string, position: number}.
 */
export default function getTextState(editor) {
    const range = getRange();
    if (!range) return;
    const wholeText = range.startContainer?.wholeText || "";
    return {
        text: wholeText,
        position: range.startOffset,
    };
}
