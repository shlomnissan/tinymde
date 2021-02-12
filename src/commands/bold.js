import {
    getSurroundingWord,
    selectContents,
    setCursorInActiveRange,
    getContentsInActiveRange,
} from "../utils/edit";
import insertText from "../utils/text";

const Bold = {
    regex: /\*\*(.*?).\*\*/gm,

    getNode: () => window.getSelection().baseNode?.parentNode,

    offset: 2,

    execute: function (state) {
        const node = this.getNode();
        const sel = window.getSelection();
        if (!node || !sel) return;

        const isMarkdown = state.text.match(this.regex);

        if (isMarkdown) {
            const word = isMarkdown[0];
            selectContents(node, 0);
            insertText(
                node,
                word.substring(this.offset, word.length - this.offset)
            );

            setCursorInActiveRange(state.position - this.offset);
        } else {
            // Get the current selection
            let selectionRange = {
                start: Math.min(sel.anchorOffset, sel.focusOffset),
                end: Math.max(sel.anchorOffset, sel.focusOffset),
            };

            // If there is selection, get the surrounding word and select it
            let selection = "";
            if (sel.isCollapsed) {
                selectionRange = getSurroundingWord(state.text, state.position);
                selection = getContentsInActiveRange(selectionRange);
            }

            // Clean invalid markdown
            if (selection === "****" || selection === "**") {
                insertText(node, "");
                return;
            }

            // Insert selected content in-place
            insertText(node, `**${selection}**`);

            // If a word wasn't selected, set the position
            if (!selection) {
                setCursorInActiveRange(state.position + this.offset);
            } else {
                // If a word was selected, set the position after syntax highlighting
                setTimeout(() => {
                    setCursorInActiveRange(selection.length + this.offset);
                }, 10);
            }
        }
    },
};

export default Bold;
