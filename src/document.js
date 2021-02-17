import Cursor from "./utils/cursor";

const Document = {
    root: {},
    editor: null,

    init: function (editor) {
        this.editor = editor;
    },

    reset: function (content) {
        const paragraphs = content.split("\n");
        paragraphs.forEach((para) => {
            const nid = getNextId();
            const { type, metadata } = getParagraphType(para);
            this.root[nid] = {
                type,
                metadata,
                text: para,
                html: para,
            };

            if (type === "header") {
                this.root[nid].html = setHeaderMarkup(
                    this.root[nid].text,
                    metadata.len
                );
            }

            if (type === "new-line") {
                this.root[nid].html = "<br/>";
            }
        });
        if (paragraphs.length) {
            setCursorEndDocument(this.editor);
        }
    },

    update: function () {
        if (this.editor.innerText.length === 0) {
            // the editor is empty, reset virtual dom
            setTimeout(() => {
                this.reset(this.editor.innerText);
                this.render();
            });
            return;
        }

        setTimeout(() => {
            // process update
            const el = getActiveParagraphElement();
            const nid = el.dataset.tnode;
            const node = this.root[nid];

            if (node.text === el.text) return; // no modifications

            const cursorPos = Cursor.getCurrentCursorPosition(el);
            const { type, metadata } = getParagraphType(el.innerText);

            node.text = el.innerText;
            let dirty = false;

            // test for paragraph type changes
            if (node.type !== type) {
                dirty = true;
                node.type = type;
                node.metadata = metadata;

                // TODO: ---- DRY ----
                if (node.type === "text") {
                    node.html = el.innerText;
                }

                if (node.type === "header") {
                    node.html = setHeaderMarkup(node.text, node.metadata.len);
                }
                // --------------------
            }

            // TODO: test for markup changes

            if (dirty) {
                // update required
                el.innerHTML = node.html;
                setTimeout(() => {
                    Cursor.setCurrentCursorPosition(cursorPos, el);
                });
            }
        });
    },

    render: function () {
        let output = "";
        Object.keys(this.root).forEach((nodeId) => {
            const node = this.root[nodeId];
            // TODO: this function shouldn't process HTML
            output += `<div class="tinymde-paragraph" data-tnode="${nodeId}">${node.html}</div>`;
        });
        this.editor.innerHTML = output;
    },
};

let lastId = 0;
function getNextId() {
    return ++lastId;
}

function getActiveParagraphElement() {
    let container = window.getSelection().anchorNode;
    while (container.nodeType === Node.TEXT_NODE) {
        container = container.parentElement;
    }
    while (!container.classList.contains("tinymde-paragraph")) {
        if (container.parentElement === null) return;
        container = container.parentElement;
    }
    return container;
}

function getParagraphType(para) {
    if (para.length == 0) {
        return { type: "new-line", metadata: {} };
    }
    if (para.match(/^(#{1,6})\s/g)) {
        const len = /^(#{1,6})\s/g.exec(para)[1].length;
        return { type: "header", metadata: { len } };
    }
    return { type: "text", metadata: {} };
}

function setCursorEndDocument(editor) {
    setTimeout(function () {
        const range = new Range();
        const sel = window.getSelection();

        if (!editor.lastChild?.firstChild) {
            return;
        }

        const el = editor.lastChild.firstChild;
        range.setStart(el, el.length);
        range.setEnd(el, el.length);
        sel.removeAllRanges();
        sel.addRange(range);
    });
}

// TODO: generalize to any paragraph markdown
function setHeaderMarkup(content, len) {
    content = content.substr(len + 1);
    const gutter = "#".repeat(len) + " ";
    return `<strong><span class="gutter">${gutter}</span>${content}</strong>`;
}

export default Document;
