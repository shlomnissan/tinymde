import {
    getSurroundingWord,
    selectContents,
    setCursorInActiveRange,
    getContentsInActiveRange,
} from "../utils/edit";
import insertText from "../utils/text";

// Current issues:
// ----------------------------------------
// 1. [x] don't show markdown if text is empty
// 2. [x] toggle throws and error when the caret is in between **
// 3. [x] toggle throws and error when the care is in between ** beginning
// 4. [x] setSelection does too many things (set cursor, select content, return selected content)
// 5. [x] Toggle doesn't support empty ****

const Bold = {
    regex: /\*\*(.*?).\*\*/gm,

    getNode: () => window.getSelection().baseNode?.parentNode,

    offset: 2,

    execute: function (editor, state) {
        let node = this.getNode();
        let sel = window.getSelection();

        if (!node || !sel) return;

        const toggle = state.text.match(this.regex);

        if (toggle) {
            const word = toggle[0];
            selectContents(node, 0);
            insertText(
                editor,
                word.substring(this.offset, word.length - this.offset)
            );

            setCursorInActiveRange(state.position - this.offset);
        } else {
            // get the current selection
            let selectionRange = {
                start: Math.min(sel.anchorOffset, sel.focusOffset),
                end: Math.max(sel.anchorOffset, sel.focusOffset),
            };

            // if there is selection, get surrounding word
            if (sel.isCollapsed) {
                selectionRange = getSurroundingWord(state.text, state.position);
            }

            // select the range and return the selection content
            const selection = getContentsInActiveRange(selectionRange);

            // invalid mardown
            if (selection === "****" || selection === "**") {
                insertText(editor, "");
                return;
            }

            // insert selected content in-place of selection
            insertText(editor, `**${selection}**`);

            // if a word wasn't selected, set the position
            if (!selection) {
                setCursorInActiveRange(state.position + this.offset);
                return;
            }

            // if a word was selected, insert and select the word
            setTimeout(() => {
                const __node__ = this.getNode();
                if (__node__) selectContents(__node__, this.offset);
            }, 10);
        }
    },
};

export default Bold;
