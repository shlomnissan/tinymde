import { setSelection, stripParagraphMarkdown } from "../utils/textarea";
import insertText from "../utils/insert_text";

const Header = function () {};

/**
 * Toggle header markdown to current paragraph.
 * @param {HTMLDivElement} editor - contentEditable div tag.
 * @param {Object} state - { text: string, position: number }
 * @param {number} size - 1, 2, ... 6
 */
Header.prototype.execute = function (editor, state, size) {
    const regex = new RegExp(`^(\\#{${size}}\\s)(.*?)`, "g");
    const offset = size + 1;

    let text = "";
    let cursor = { start: 0, end: 0 };

    const addMarkdown = () => {
        const stripped = stripParagraphMarkdown(state.text);
        text = `${"#".repeat(size)} ${stripped.text}`;
        cursor = state.position + offset - stripped.offset;
        setSelection({ start: 0, end: state.text.length });
    };

    const stripMarkdown = () => {
        text = state.text.substring(size + 1, state.text.length);
        cursor = Math.max(state.position - offset, 0);
        setSelection({ start: 0, end: state.text.length });
    };

    state.text.match(regex) ? stripMarkdown() : addMarkdown();
    insertText(editor, text);
    setSelection({ start: cursor, end: cursor });
};

export default new Header();
