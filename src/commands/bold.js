import { getSurroundingWord, setSelection } from "../utils/textarea";
import insertText from "../utils/insert_text";

const Bold = function () {};

/**
 * Toggle bold markdown to current word and select it.
 * @param {HTMLDivElement} editor - contentEditable div tag.
 * @param {Object} textState - { text: string, position: number }
 */
Bold.prototype.execute = function (editor, state) {
    const regex = /(\*{2})(.*?)(\1)/g;
    const wordOffset = getSurroundingWord(state.text, state.position);
    const mdOffset = 2;

    let text = "";
    let selection = { start: 0, end: 0 };

    const addMarkdown = () => {
        text = `**${word}**`;
        selection = {
            start: wordOffset.start + mdOffset,
            end: wordOffset.end + mdOffset,
        };
    };

    const stripMarkdown = () => {
        text = word.replace(regex, "$2");
        selection = {
            start: state.position - mdOffset,
            end: state.position - mdOffset,
        };
    };

    const word = setSelection(wordOffset);
    word.match(regex) ? stripMarkdown() : addMarkdown();
    insertText(editor, text);
    setSelection(selection);
};

export default new Bold();
