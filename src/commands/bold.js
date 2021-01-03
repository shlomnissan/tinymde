import getSurroundingWord from "../utils/get_surrounding_word";
import setSelection from "../utils/set_selection";
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
    insertText(editor, `**${word}**`);
    setSelection({
        start: wordOffset.start + 2,
        end: wordOffset.end + 2,
    });
};

export default Bold;
