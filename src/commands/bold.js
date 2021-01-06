import { getSurroundingWord, setSelection } from "../utils/textarea";
import insertText from "../utils/insert_text";

const Bold = function () {};

/**
 * Add bold markdown to current word and select it.
 * @param {HTMLDivElement} editor - contentEditable div tag.
 * @param {Object} textState - { text: string, position: number }
 */
Bold.prototype.execute = function (editor, state) {
    const regex = /(\*{2})(.*?)(\1)/g;
    const wordOffset = getSurroundingWord(state.text, state.position);

    let text = "";
    let selection = { start: 0, end: 0 };

    const addMarkdown = () => {
        text = `**${word}**`;
        selection = {
            start: wordOffset.start + 2,
            end: wordOffset.end + 2,
        };
    };

    const stripMarkdown = () => {
        text = word.replace(regex, "$2");
        selection = {
            start: state.position - 2,
            end: state.position - 2,
        };
    };

    const word = setSelection(wordOffset);
    word.match(regex) ? stripMarkdown() : addMarkdown();
    insertText(editor, text);
    setSelection(selection);
};

const Instance = new Bold();
export default Instance;
