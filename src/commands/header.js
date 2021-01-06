import { setSelection } from "../utils/textarea";
import insertText from "../utils/insert_text";

const Header = function () {};

/**
 * Add header markdown to current paragraph.
 * @param {HTMLDivElement} editor - contentEditable div tag.
 * @param {Object} textState - { text: string, position: number }
 * @param {number} size - 1, 2, ... 6
 */
Header.prototype.execute = function (editor, textState, size) {
    const hash = "#";
    const text = `${hash.repeat(size)} ${textState.text}`;

    setSelection({ start: 0, end: textState.text.length });
    insertText(editor, text);
    setSelection({ start: text.length, end: text.length });
};

const Instance = new Header();
export default Instance;
