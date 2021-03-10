import { stripParagraphMarkdown, selectContentInElement } from "../utils/text";
import { getActiveParagraph } from "../document";
import Cursor from "../utils/cursor";

const Blockquote = {
    regex: /^>\s/g,
    offset: 2,
    execute() {
        const para = getActiveParagraph();
        if (!para) return;

        let offset = this.offset;
        let text = para.innerText;
        const pos = Cursor.getCurrentCursorPosition(para);

        const addMarkdown = () => {
            const info = stripParagraphMarkdown(text);
            text = `> ${info.text}`;
            para.innerText = text;
            offset = pos + offset - info.offset;
        };

        const stripMarkdown = () => {
            text = text.substring(offset, text.length);
            para.innerText = text;
            offset = pos - offset;
        };

        selectContentInElement(para);
        const match = text.match(this.regex);
        match ? stripMarkdown() : addMarkdown();
        Cursor.setCurrentCursorPosition(offset, para);
    },
};

export default Blockquote;
