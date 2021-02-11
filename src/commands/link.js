import {
    getSurroundingWord,
    setSelection,
    getActiveRange,
} from "../utils/edit";
import insertText from "../utils/text";

const Link = function () {};

/**
 * Toggle link markdown to current word and select it.
 * @param {HTMLDivElement} editor - contentEditable div tag.
 * @param {Object} textState - { text: string, position: number }
 */
Link.prototype.execute = function (editor, state) {
    const regex = /(\[)(.*?)(\])(\(.*?\))/g;
    const wordOffset = getSurroundingWord(state.text, state.position);

    let text = "";
    let selection = { start: 0, end: 0 };

    const addMarkdown = () => {
        text = `[${word}]()`;
        insertText(editor, text);
        const range = getRange();
        selection = {
            start: range.endOffset - 1,
            end: range.endOffset - 1,
        };
        setSelection(selection);
    };

    const stripMarkdown = () => {
        text = word.replace(regex, "$2");
        insertText(editor, text);
        selection = {
            start: state.position - word.length + text.length,
            end: state.position - word.length + text.length,
        };
    };

    const word = setSelection(wordOffset);
    word.match(regex) ? stripMarkdown() : addMarkdown();
};

export default new Link();
