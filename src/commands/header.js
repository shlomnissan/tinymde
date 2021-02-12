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

        const isMarkdown = node.innerText.match(
            // Dynamic regex, specific to the header size
            new RegExp(`^(\\#{${size}}\\s)(.*?)`, "g")
        );

        // Get the cursor's position, relative to the paragraph
        const pos = Cursor.getCurrentCursorPosition(node);

        selectContents(node, 0);

        if (isMarkdown) {
            // Strip markdown
            text = text.substring(offset, text.length);
            insertText(node, text);
            offset = pos - offset;
        } else {
            // Insert header markdown (strip existing paragraph markdown if needed)
            const stripped = stripParagraphMarkdown(text);
            text = `${"#".repeat(size)} ${stripped.text}`;
            insertText(node, text);
            offset = pos + offset - stripped.offset;
        }

        // Set the cursor's position, relative to the paragraph
        Cursor.setCurrentCursorPosition(offset, node);
    },
};

export default Header;
