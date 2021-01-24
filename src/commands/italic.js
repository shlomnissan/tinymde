import { getSurroundingWord, setSelection } from "../utils/edit";
import insertText from "../utils/text";

const Italic = function () {};

/**
 * Toggle italic markdown to current word and select it.
 * @param {HTMLDivElement} editor - contentEditable div tag.
 * @param {Object} textState - { text: string, position: number }
 */
Italic.prototype.execute = function (editor, state) {
    const regex = /(\*{1})(.*?)(\1)/g;
    const wordOffset = getSurroundingWord(state.text, state.position);
    const mdOffset = 1;

    let text = "";
    let selection = { start: 0, end: 0 };

    const addMarkdown = () => {
        text = `*${word}*`;
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

export default new Italic();
