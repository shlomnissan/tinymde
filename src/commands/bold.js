import {
    getSurroundingWord,
    selectContents,
    setCursorInActiveRange,
    getContentsInActiveRange,
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
            // Get the current selection
            let selection = "";
            let selectionRange = {
                start: Math.min(sel.anchorOffset, sel.focusOffset),
                end: Math.max(sel.anchorOffset, sel.focusOffset),
            };

            if (sel.isCollapsed) {
                // There's no selection, get nearest word
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
                    // Set the position after syntax highlighting
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
