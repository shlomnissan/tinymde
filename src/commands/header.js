import { stripParagraphMarkdown, selectContentInElement } from "../utils/text";
import { getActiveParagraph } from "../document";
import Cursor from "../utils/cursor";

const Header = {
    regex: /^(#{1,6})\s/g,
    execute(size) {
        const para = getActiveParagraph();
        if (!para) return;

        let offset = size + 1;
        let text = para.innerText;
        const pos = Cursor.getCurrentCursorPosition(para);
        const regex = new RegExp(`^(\\#{${size}}\\s)(.*?)`, "g");

        const addMarkdown = () => {
            const info = stripParagraphMarkdown(text);
            text = `${"#".repeat(size)} ${info.text}`;
            para.innerText = text;
            offset = pos + offset - info.offset;
        };

        const stripMarkdown = () => {
            text = text.substring(offset, text.length);
            para.innerText = text;
            offset = pos - offset;
        };

        selectContentInElement(para);
        const match = text.match(regex);
        match ? stripMarkdown() : addMarkdown();
        Cursor.setCurrentCursorPosition(offset, para);
    },
};

export default Header;
