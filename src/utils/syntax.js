import Bold from "../commands/bold";

const Syntax = {};

Syntax.tokenize = function tokenize(str) {
    let output = "";
    const paragraphs = str.split("\n");
    paragraphs.forEach((para) => {
        if (para.trim().length) {
            para = tokenizeHeader(para);
            para = tokenizeBold(para);
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

function tokenizeBold(paragraph) {
    const bold_md = paragraph.match(Bold.regex);
    if (bold_md) {
        bold_md.forEach((match) => {
            paragraph = paragraph
                .split(match)
                .join(`<strong>${match}</strong>`);
        });
    }
    return paragraph;
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
