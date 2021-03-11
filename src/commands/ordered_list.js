import { stripParagraphMarkdown, selectContentInElement } from "../utils/text";
import { getActiveParagraph } from "../document";
import Cursor from "../utils/cursor";

const OrderedList = {
    regex: /^(\d)+.\s/g,
    offset: 3,
    execute() {
        const para = getActiveParagraph();
        if (!para) return;

        let offset = this.offset;
        let text = para.innerText;
        const pos = Cursor.getCurrentCursorPosition(para);

        const addMarkdown = () => {
            const info = stripParagraphMarkdown(text);
            text = `1. ${info.text}`;
            para.innerText = text;
            offset = pos + this.offset - info.offset;
        };

        const stripMarkdown = (len) => {
            text = text.substring(len, text.length);
            para.innerText = text;
            offset = pos - len;
        };

        selectContentInElement(para);
        const match = text.match(this.regex);
        match ? stripMarkdown(match[0].length) : addMarkdown();
        Cursor.setCurrentCursorPosition(offset, para);
    },
};

export default OrderedList;
