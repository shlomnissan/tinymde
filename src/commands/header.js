import { stripParagraphMarkdown, selectContentInElement } from "../utils/text";
import Document, { getActiveParagraph } from "../document";
import Cursor from "../utils/cursor";

const Header = {
    regex: /^(\#{1,6}\s)(.*)/g,
    execute(size) {
        const para = getActiveParagraph();
        if (!para) return;

        let offset = size + 1;
        let text = para.innerText;
        const regex = new RegExp(`^(\\#{${size}}\\s)(.*?)`, "g");

        const addMarkdown = () => {
            const stripped = stripParagraphMarkdown(text);
            text = `${"#".repeat(size)} ${stripped.text}`;
            para.innerText = text;
            Document.update();
            offset = pos + offset - stripped.offset;
        };

        const stripMarkdown = () => {
            text = text.substring(offset, text.length);
            para.innerText = text;
            Document.update();
            offset = pos - offset;
        };

        const pos = Cursor.getCurrentCursorPosition(para);
        selectContentInElement(para);

        const match = text.match(regex);
        match ? stripMarkdown() : addMarkdown();
        Cursor.setCurrentCursorPosition(offset, para);
    },
};

export default Header;
