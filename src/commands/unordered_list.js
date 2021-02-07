import { setSelection, stripParagraphMarkdown } from "../utils/edit";
import insertText from "../utils/text";
import Shortcut from "../shortcut";

const regex = /^(\-{1}\s)(.*?)/g;

const UnorderedList = function () {
    insertBeforeNewLine();
};

/**
 * Toggle unordered-list markdown on current paragraph.
 * @param {HTMLDivElement} editor - contentEditable div tag.
 * @param {Object} state - { text: string, position: number }
 */
UnorderedList.prototype.execute = function (editor, state) {
    const offset = 2;
    let text = "";
    let cursor = { start: 0, end: 0 };

    const addMarkdown = () => {
        const stripped = stripParagraphMarkdown(state.text);
        text = `- ${stripped.text}`;
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

function insertBeforeNewLine() {
    Shortcut(
        "Enter",
        (event) => {
            const sel = window.getSelection();
            if (sel.anchorNode.textContent.match(regex)) {
                setTimeout(() => {
                    insertText(sel.anchorNode.parentElement, "- ");
                });
            }
        },
        true /* defer */
    );
}

export default new UnorderedList();
