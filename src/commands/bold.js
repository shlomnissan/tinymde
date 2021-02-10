import {
    getSurroundingWord,
    selectContents,
    setSelection,
} from "../utils/edit";
import insertText from "../utils/text";

// Current issues:
// ----------------------------------------
// 1. do we need to highlight empty markdown? this has a significant impact on the implementation (it probably shouldnt)
// 2. toggle throws and error when the caret is in between **
// 3. toggle resets to the beginning of the line when there's nothing in-between ****
// 4. setSelection does too many things (set cursor, select content, return selected content)

const Bold = {
    regex: /^\*{2}(.*?)\*{2}$/,
    getNode: () => window.getSelection().baseNode?.parentNode,
    execute: function (editor, state) {
        let node = this.getNode();
        let sel = window.getSelection();
        if (!node || !sel) return;

        // match strong pattern, assuming syntax highlighting was already applied:
        // the markdown is already inside its own element <strong>
        const toggle = state.text.match(this.regex);
        if (toggle) {
            // select all the content inside <strong>
            selectContents(node, 0);
            // replace it with the content
            insertText(editor, toggle[1]);
            // reset cursor - this will execute before the text is inserted
            setSelection({
                start: state.position - 2,
                end: state.position - 2,
            });
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
            const selection = setSelection(selectionRange);
            // insert selected content in-place of selection
            insertText(editor, `**${selection}**`);
            setTimeout(() => {
                // select the current node. adding delay to
                // make sure the syntax highlighter added the new node <strong>
                const __node__ = this.getNode();
                // select the contents of this node with offset
                if (__node__) selectContents(__node__, 2);
            }, 10);
        }
    },
};

export default Bold;
