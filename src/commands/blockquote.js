import { setSelection, stripParagraphMarkdown } from "../utils/edit";
import insertText from "../utils/text";

const Blockquote = function () {};

/**
 * Toggle blockquote markdown to current paragraph.
 * @param {HTMLDivElement} editor - contentEditable div tag.
 * @param {Object} state - { text: string, position: number }
 */
Blockquote.prototype.execute = function (editor, state) {
    const regex = /^(\>{1}\s)(.*?)/g;
    const offset = 2;

    let text = "";
    let cursor = { start: 0, end: 0 };

    const addMarkdown = () => {
        const stripped = stripParagraphMarkdown(state.text);
        text = `> ${stripped.text}`;
        cursor = state.position + offset - stripped.offset;
        setSelection({ start: 0, end: state.text.length });
    };

    const stripMarkdown = () => {
        text = state.text.substring(offset, state.text.length);
        cursor = Math.max(state.position - offset, 0);
        setSelection({ start: 0, end: state.text.length });
    };

    state.text.match(regex) ? stripMarkdown() : addMarkdown();
    insertText(editor, text);
    setSelection({ start: cursor, end: cursor });
};

export default new Blockquote();
