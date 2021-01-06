import { getSurroundingWord, setSelection } from "../utils/textarea";
import insertText from "../utils/insert_text";

const Bold = function () {};

/**
 * Add bold markdown to current word and select it.
 * @param {HTMLDivElement} editor - contentEditable div tag.
 * @param {Object} textState - { text: string, position: number }
 */
Bold.prototype.execute = function (editor, textState) {
    const wordOffset = getSurroundingWord(textState.text, textState.position);
    const word = setSelection(wordOffset);
    const text = `**${word}**`;

    insertText(editor, text);
    setSelection({
        start: wordOffset.start + 2,
        end: wordOffset.end + 2,
    });
};

const Instance = new Bold();
export default Instance;
