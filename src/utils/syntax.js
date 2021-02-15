import Commands from "../commands/commands";

const Syntax = {};

Syntax.tokenize = function tokenize(str) {
    let output = "";
    const paragraphs = str.split("\n");
    paragraphs.forEach((para) => {
        if (para.trim().length) {
            para = tokenizeParagraph(
                para,
                /^(\#{1,6}\s)(.+)/g,
                "<strong>$1</strong>"
            );
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
            if (paragraphs.length) {
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

function tokenizeParagraph(str, regex, pattern) {
    const matches = str.match(regex);
    if (matches) {
        matches.forEach((match) => {
            const markdown = str.match(/^(.+?)\s/g);
            match = match.replace(/^(\#{1,6}\s)/g, "");
            str = `<strong><span class="gutter">${markdown[0]}</span>${match}</strong>`;
        });
    }

    setTimeout(() => {
        const paragraphs = document.querySelectorAll(".tinymde-paragraph");
        paragraphs.forEach((para) => {
            const gutter = para.querySelector(".gutter");
            if (gutter) {
                para.style.textIndent = `-${gutter.offsetWidth}px`;
            } else {
                para.style.textIndent = 0;
            }
        });
    });

    return str;
}
