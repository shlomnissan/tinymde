import { setSelection } from "../utils/textarea";
import insertText from "../utils/insert_text";

const Header = function () {};

/**
 * Add header markdown to current paragraph.
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
        text = `${"#".repeat(size)} ${state.text}`;
        cursor = state.position + offset;
        setSelection({ start: 0, end: state.text.length });
    };

    const stripMarkdown = () => {
        text = state.text.substring(size + 1, state.text.length);
        cursor = state.position - offset;
        setSelection({ start: 0, end: state.text.length });
    };

    state.text.match(regex) ? stripMarkdown() : addMarkdown();
    insertText(editor, text);
    setSelection({ start: cursor, end: cursor });
};

const Instance = new Header();
export default Instance;
