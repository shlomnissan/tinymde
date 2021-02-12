import {
    selectContents,
    stripParagraphMarkdown,
    getParagraph,
} from "../utils/edit";
import Cursor from "../utils/cursor";
import insertText from "../utils/text";

const Header = {
    regex: /^(\#{1,6}\s)(.*)/g,
    execute(size) {
        const node = getParagraph();
        if (!node) return;

        let offset = size + 1;
        let text = node.innerText;

        const regex = new RegExp(`^(\\#{${size}}\\s)(.*?)`, "g");

        const addMarkdown = () => {
            const stripped = stripParagraphMarkdown(text);
            text = `${"#".repeat(size)} ${stripped.text}`;
            insertText(node, text);
            offset = pos + offset - stripped.offset;
        };

        const stripMarkdown = () => {
            text = text.substring(offset, text.length);
            insertText(node, text);
            offset = pos - offset;
        };

        // Get the cursor's position, relative to the paragraph
        const pos = Cursor.getCurrentCursorPosition(node);

        // Select the content
        selectContents(node, 0);

        const isMarkdown = node.innerText.match(regex);
        isMarkdown ? stripMarkdown() : addMarkdown();

        // Set the cursor's position, relative to the paragraph
        Cursor.setCurrentCursorPosition(offset, node);
    },
};

export default Header;
