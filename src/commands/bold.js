import {
    getSurroundingWord,
    selectContents,
    setCursorInActiveRange,
    getContentsInActiveRange,
    getSelectionRange,
} from "../utils/edit";
import insertText from "../utils/text";

const Bold = {
    regex: /(\*{2,3})(.+?)(\1)/gm,
    offset: 2,
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

            // Clean invalid markdown
            if (selection === "****" || selection === "**") {
                insertText(node, "");
                return;
            }

            insertText(node, `**${selection}**`);

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
            insertText(node, word.replace(this.regex, "$2"));
            setCursorInActiveRange(state.position - this.offset);
        };

        const isMarkdown = state.text.match(this.regex);
        isMarkdown ? stripMarkdown() : addMarkdown();
    },
};

export default Bold;
