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
            const { type, metadata } = getNodeType(para);
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
                this.root[nid].html = "<br>";
            }
        });
        if (paragraphs.length) {
            setTimeout(() => {
                const nid = getLastNodeId();
                setCursorInNode(nid);
            });
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
            // TODO: use get selection
            const el = getActiveNodeElement();
            const nid = el.dataset.tnode;
            const node = this.root[nid];

            if (node.text === el.text) return; // no modifications

            const cursorPos = Cursor.getCurrentCursorPosition(el);
            const { type, metadata } = getNodeType(el.innerText);

            node.text = el.innerText;
            node.html = el.innerHTML;

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

    create: function () {
        // TODO: handle multiple node selection
        const info = getSelection();
        let nid = info.nid;
        let pos = "end";

        if (info.isCollapsed) {
            if (info.state === "start") {
                // add empty paragraph above
                const nextNid = nid == 0 ? 1 : nid;
                insertNode.call(this, nextNid, "new-line", {}, "", "<br>");
                pos = "start";
            }
            if (info.state === "end") {
                // add empty paragraph below
                insertNode.call(this, nid + 1, "new-line", {}, "", "<br>");
            }
            if (info.state === "inside") {
                // add paragraph below with content from middle
                const first = info.el.innerText.substr(0, info.startPos);
                const second = info.el.innerText.substr(info.startPos);
                split.call(this, first, second);
            }
        } else {
            // split the paragraph and remove selection
            const first = info.el.innerText.substr(0, info.startPos);
            const second = info.el.innerText.substr(
                info.startPos + info.text.length
            );
            split.call(this, first, second);
        }

        function split(first, second) {
            if (!first.length) {
                this.root[nid].text = "";
                this.root[nid].html = "<br>";
                this.root[nid].type = "new-line";
            } else {
                this.root[nid].text = first;
                this.root[nid].html = first; // TODO: process tokens
            }
            if (!second.length) {
                insertNode.call(this, nid + 1, "new-line", {}, "", "<br>");
            } else {
                insertNode.call(this, nid + 1, "text", {}, second, second);
            }
            pos = "start";
        }

        this.render();
        setCursorInNode(nid + 1, pos);
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

    delete: function () {
        const el = getActiveNodeElement();
        // TODO: fix delete on selection
        if (el.innerHTML === "<br>" || !el.innerHTML.length) {
            const nid = parseInt(el.dataset.tnode);
            const newRoot = {};
            for (let i = 1; i < nid; ++i) {
                newRoot[i] = this.root[i];
            }
            for (let i = nid + 1; i <= Object.keys(this.root).length; ++i) {
                newRoot[i - 1] = this.root[i];
            }
            this.root = newRoot;
            this.render();
            setCursorInNode(nid - 1);
            return true;
        }
        return false;
    },
};

// TODO: move into the object and remove last node selection
let lastId = 0;
function getNextId() {
    return ++lastId;
}

function getSelection() {
    const sel = window.getSelection();
    const el = getActiveNodeElement();
    if (!sel || !el) return;

    const range = sel.getRangeAt(0);
    console.log(range.startContainer.parentElement.dataset.tnode);
    console.log(range.endContainer.parentElement.dataset.tnode);

    const nid = parseInt(el.dataset.tnode);
    let startPos = sel.anchorOffset;
    let state = "inside";

    if (startPos === 0) state = "start";
    if (startPos === el.innerText.length) state = "end";
    if (el.innerHTML === "<br>" || !el.innerText.length) {
        state = "end";
    }

    let text = "";
    if (!sel.isCollapsed) {
        text = sel.getRangeAt(0).toString();
        startPos = Math.min(sel.anchorOffset, sel.focusOffset);
    }

    return {
        el,
        nid,
        startPos,
        state,
        text,
        isCollapsed: sel.isCollapsed,
    };
}

function getActiveNodeElement() {
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

function getNodeElement(nid) {
    const paragraphs = document.querySelectorAll(".tinymde-paragraph");
    if (paragraphs.length >= nid) {
        return paragraphs[nid - 1];
    }
    return null;
}

function getNodeType(para) {
    if (para.length == 0) {
        return { type: "new-line", metadata: {} };
    }
    if (para.match(/^(#{1,6})\s/g)) {
        const len = /^(#{1,6})\s/g.exec(para)[1].length;
        return { type: "header", metadata: { len } };
    }
    return { type: "text", metadata: {} };
}

function insertNode(nid, type, metadata = {}, text = "", html = "") {
    const newRoot = {};
    for (let i = 1; i < nid; ++i) {
        newRoot[i] = this.root[i];
    }
    newRoot[nid] = {
        type,
        metadata,
        text,
        html,
    };
    for (let i = nid; i <= Object.keys(this.root).length; ++i) {
        newRoot[i + 1] = this.root[i];
    }
    this.root = newRoot;
}

function setCursorInNode(nid, position = "end") {
    const el = getNodeElement(nid);

    if (!el) return;

    const range = new Range();
    const sel = window.getSelection();

    let child = el;
    if (position === "end") {
        while (child.lastChild) {
            child = child.lastChild;
        }
    } else {
        while (child.firstChild) {
            child = child.firstChild;
        }
    }

    const pos = position === "end" ? child.length : 0;
    range.setStart(child, pos);
    range.setEnd(child, pos);
    sel.removeAllRanges();
    sel.addRange(range);
}

function getLastNodeId() {
    const paragraphs = document.querySelectorAll(".tinymde-paragraph");
    return paragraphs.length;
}

// TODO: generalize to any paragraph markdown
function setHeaderMarkup(content, len) {
    content = content.substr(len + 1);
    const gutter = "#".repeat(len) + " ";
    return `<strong><span class="gutter">${gutter}</span>${content}</strong>`;
}

export default Document;
