import {
    getContentsInActiveRange,
    getSelectionRange,
    getSurroundingWord,
    selectContents,
    setCursorInActiveRange,
} from "../utils/edit";
import insertText from "../utils/text";

const Strikethrough = {
    regex: /~(.+?)~/g,
    offset: 1,
    execute: function (state) {
        const node = window.getSelection().baseNode?.parentNode;
        const sel = window.getSelection();
        if (!node || !sel) return;

        const addMarkdown = () => {
            let selection = "";
            let selectionRange = getSelectionRange();
            if (sel.isCollapsed) {
                selectionRange = getSurroundingWord(state.text, state.position);
            }
            selection = getContentsInActiveRange(selectionRange);

            insertText(node, `~${selection}~`);

            if (!selection) {
                setCursorInActiveRange(state.position + this.offset);
            } else {
                setTimeout(() => {
                    setCursorInActiveRange(selection.length + this.offset);
                }, 10);
            }
        };

        const stripMarkdown = () => {
            const word = isMarkdown[0];
            selectContents(node, 0);
            insertText(node, word.replace(this.regex, "$1"));
            setCursorInActiveRange(state.position - this.offset);
        };

        const isMarkdown = state.text.match(this.regex);
        isMarkdown ? stripMarkdown() : addMarkdown();
    },
};

export default Strikethrough;
