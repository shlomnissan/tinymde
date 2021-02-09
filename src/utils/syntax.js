export function tokenize(str) {
    let output = "";
    const paragraphs = str.split("\n");
    paragraphs.forEach((para) => {
        if (para.length) {
            para = transformBold(para);
            output += `<div class="tinymde-paragraph">${para}</div>`;
        } else {
            output += "<br/>";
        }
    });
    return output;
}

function transformBold(paragraph) {
    const bold_md = paragraph.match(/(\*{2})(.*?)(\1)/g);
    if (bold_md) {
        bold_md.forEach((bold) => {
            paragraph = paragraph.split(bold).join(`<strong>${bold}</strong>`);
        });
    }
    return paragraph;
}
