import {
    selectContentInActiveRange,
    getSurroundingWord,
    getContainerFromActiveRange,
} from "../utils/text";
import Cursor from "../utils/cursor";
import insertText from "../utils/text";

const Strikethrough = {
    regex: /(~{2})(.+?)(\1)/g,
    offset: 2,
    execute: function () {
        let sel = window.getSelection();
        let range = sel.getRangeAt(0);
        const node = sel.baseNode?.parentNode;
        if (!sel || !range || !node) return;

        const cText = range.startContainer?.wholeText || "";
        const cOffset = range.startOffset;

        const addMarkdown = () => {
            let selectionRange = {
                start: range.startOffset,
                end: range.endOffset,
            };
            if (sel.isCollapsed) {
                selectionRange = getSurroundingWord(cText, cOffset);
            }
            const selection = selectContentInActiveRange(selectionRange);
            if (selection === "~~~~") {
                return;
            }

            insertText(node, `~~${selection}~~`);

            if (!selection) {
                // if the selection is empty (not near a word)
                // place the cursor in the middle
                Cursor.setCurrentCursorPosition(
                    cOffset + this.offset,
                    getContainerFromActiveRange()
                );
                return;
            }

            setTimeout(() => {
                Cursor.setCurrentCursorPosition(
                    selection.length + this.offset,
                    getContainerFromActiveRange()
                );
            }, 10);
        };

        const stripMarkdown = () => {
            selectContentInActiveRange({
                start: 0,
                end: node.innerText.length,
            });
            node.innerText = match[0].replace(this.regex, "$2");
            const len = match[0].length;
            const offset = Math.min(cOffset, len - this.offset);
            Cursor.setCurrentCursorPosition(
                offset - this.offset,
                sel.anchorNode
            );
        };

        const match = cText.match(this.regex);
        match ? stripMarkdown() : addMarkdown();
    },
};

export default Strikethrough;
