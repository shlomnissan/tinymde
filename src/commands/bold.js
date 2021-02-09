import { getSurroundingWord, selectElement, setSelection } from "../utils/edit";
import insertText from "../utils/text";

const Bold = {
    regex: /(\*{2})(.*?)(\1)/g,
    execute: function (editor, state) {
        const wordOffset = getSurroundingWord(state.text, state.position);
        const mdOffset = 2;
        let text = "";

        const addMarkdown = () => {
            text = `**${word}**`;
            insertText(editor, text);
            setTimeout(() => {
                const node = window.getSelection().baseNode?.parentNode;
                if (node) selectElement(node, mdOffset);
            }, 5);
        };

        const stripMarkdown = () => {
            text = word.replace(this.regex, "$2");
            insertText(editor, text);
            setSelection({
                start: state.position - mdOffset,
                end: state.position - mdOffset,
            });
        };

        const word = setSelection(wordOffset);
        word.match(this.regex) ? stripMarkdown() : addMarkdown();
    },
};

export default Bold;
