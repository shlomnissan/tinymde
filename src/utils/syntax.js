import Commands from "../commands/commands";

const Syntax = {};

Syntax.tokenize = function tokenize(str) {
    let output = "";
    const paragraphs = str.split("\n");
    paragraphs.forEach((para) => {
        if (para.trim().length) {
            para = tokenizeHeader(para);
            para = tokenizeWord(
                para,
                Commands.Bold.regex,
                "<strong>$1</strong>"
            );
            para = tokenizeWord(
                para,
                Commands.Strikethrough.regex,
                "<strike>$1</strike>"
            );
            if (paragraphs.length > 1) {
                output += `<div class="tinymde-paragraph">${para}</div>`;
            } else {
                output += para;
            }
        } else {
            output += "<br/>";
        }
    });
    return output;
};

export default Syntax;

function tokenizeWord(str, regex, pattern) {
    const matches = str.match(regex);
    if (matches) {
        matches.forEach((match) => {
            str = str.split(match).join(pattern.replace("$1", match));
        });
    }
    return str;
}

function tokenizeHeader(paragraph) {
    const header_md = paragraph.match(/^(\#{1,6}\s)(.*)/g);
    if (header_md) {
        header_md.forEach((match) => {
            paragraph = paragraph
                .split(match)
                .join(`<strong>${match}</strong>`);
        });
    }
    return paragraph;
}
