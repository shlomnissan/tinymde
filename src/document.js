import Cursor from "./utils/cursor";

const Document = {
    root: {},
    editor: null,
    lastNode: 0,

    /**
     * Initialization - set the document render target.
     * @param {HTMLElement} editor
     */
    init: function (editor) {
        this.editor = editor;
    },

    /**
     * Build the document model, render it, and set cursor at the end.
     * This function should be used when the content is being set dynamically.
     * @param {string} content
     */
    reset: function (content) {
        this.root = {};
        const paragraphs = content.split(/\n/gm);
        paragraphs.forEach((para) => {
            const nid = ++this.lastNode;
            const { type, metadata } = getNodeType(para);
            // TODO: call create node
            this.root[nid] = {
                type,
                metadata,
                text: para,
                html: para,
            };
            // TODO: update node
            generateHTML.call(this, nid);
        });
        if (paragraphs.length) {
            setTimeout(() => {
                Cursor.setCurrentCursorPosition(
                    this.root[this.lastNode].text.length,
                    getNodeElement(this.lastNode)
                );
            });
        }
    },

    /**
     * Insert a new paragraph into the document model.
     * This function should be called on carriage return (enter key press).
     */
    insertParagraph: function () {
        const info = getSelection();
        const nid = info.startNode;
        const node = this.root[nid];

        if (info.isCollapsed) {
            if (info.startOffset === 0) {
                // add empty paragraph above
                const nextNid = nid == 0 ? 1 : nid;
                insertNode.call(this, nextNid, "new-line", {}, "");
            } else if (info.startPos === node.text.length) {
                // add empty paragraph below
                insertNode.call(this, nid + 1, "new-line", {}, "");
            } else {
                // add paragraph below with content from the selection until the end
                const node = this.root[info.startNode];
                const first = node.text.substr(0, info.startPos);
                const second = node.text.substr(info.startPos);
                split.call(this, first, second);
            }
        } else {
            if (info.startNode === info.endNode) {
                // add paragraph below, remove selected text in a single node
                const first = node.text.substr(0, info.startPos);
                const second = node.text.substr(info.endPos);
                split.call(this, first, second);
            } else {
                // add paragraph below, remove selected text on multiple nodes
                const range = window.getSelection().getRangeAt(0);
                range.deleteContents();

                const startContainer = getNodeElement(info.startNode);
                this.root[info.startNode].text = startContainer.innerText;
                generateHTML.call(this, info.startNode);

                const endContainer = getNodeElement(info.endNode);
                this.root[info.endNode].text = endContainer.innerText;
                generateHTML.call(this, info.endNode);

                removeNode.call(this, info.startNode, info.endNode);
            }
        }

        function split(first, second) {
            const firstType = first.length ? this.root[nid].type : "new-line";
            this.root[nid].text = first;
            this.root[nid].type = firstType;
            generateHTML.call(this, nid);

            const secondType = second.length ? "text" : "new-line";
            insertNode.call(this, nid + 1, secondType, {}, second);
        }

        this.render();
        Cursor.setCurrentCursorPosition(0, getNodeElement(nid + 1));
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
            // TODO: use get selection
            const el = getActiveNodeElement();
            const nid = el.dataset.tnode;
            const node = this.root[nid];

            if (node.text === el.innerText || node.html === el.innerHTML)
                return; // no modifications

            const cursorPos = Cursor.getCurrentCursorPosition(el);
            const { type, metadata } = getNodeType(el.innerText);

            node.text = el.innerText;
            node.html = el.innerHTML;

            let dirty = true;

            // test for paragraph type changes
            if (node.type !== type) {
                dirty = true;
                node.type = type;
                node.metadata = metadata;
                generateHTML.call(this, nid);
            }

            // TODO: test for markup changes
            if (dirty) {
                // update required
                generateHTML.call(this, nid);
                el.innerHTML = node.html;
                Cursor.setCurrentCursorPosition(cursorPos, el);
            }
        });
    },

    /**
     * Remove paragraph from the document model if needed.
     * This function should be called on backspace (delete key press).
     */
    removeParagraph: function () {
        const info = getSelection();

        let cursorOffset = 0;
        let cursorNode = info.startNode;

        const isMultiNode = info.startNode !== info.endNode;
        if (!isMultiNode) {
            if (info.startPos !== 0 || !info.isCollapsed) {
                return false;
            }
        }

        if (!isMultiNode) {
            const node = this.root[info.startNode];
            const prevNode = this.root[info.startNode - 1];
            cursorOffset = prevNode.text.length;
            if (node.type !== "new-line") {
                if (info.startNode === 1) return true;
                // copy current paragraph content to the one above
                prevNode.text += node.text;
                generateHTML.call(this, info.startNode - 1);
            }
            removeNode.call(this, info.startNode - 1, info.startNode + 1);
            cursorNode = info.startNode - 1;
        } else {
            // handle multi-node selection. merge start/end nodes
            // and remove everything in-between
            const range = window.getSelection().getRangeAt(0);
            range.deleteContents();

            const { startNode, endNode } = info;
            const startContainer = getNodeElement(startNode);
            const endContainer = getNodeElement(endNode);

            cursorOffset = startContainer.innerText.length;

            this.root[startNode].text =
                startContainer.innerText + endContainer.innerText;
            generateHTML.call(this, info.startNode);

            removeNode.call(this, startNode, endNode + 1);
        }

        this.render();
        Cursor.setCurrentCursorPosition(
            cursorOffset,
            getNodeElement(cursorNode)
        );

        return true;
    },

    render: function () {
        let output = "";
        Object.keys(this.root).forEach((nid) => {
            output += `<div class="tinymde-paragraph" data-tnode="${nid}">${this.root[nid].html}</div>`;
        });
        this.editor.innerHTML = output;
    },
};

function getSelection() {
    const sel = window.getSelection();
    const el = getActiveNodeElement();

    if (!sel || !el) return;

    const range = sel.getRangeAt(0);
    const isCollapsed = sel.isCollapsed;
    const startNode = parseInt(getNodeIdFromElement(range.startContainer));
    const endNode = parseInt(getNodeIdFromElement(range.endContainer));
    const cursorPos = Cursor.getCurrentCursorPosition(el);
    const textLen = range.cloneContents().textContent.length;

    let startPos = cursorPos - textLen;
    let endPos = cursorPos;
    if (sel.anchorOffset > sel.focusOffset) {
        startPos = cursorPos;
        endPos = cursorPos + textLen;
    }

    return {
        endNode,
        endOffset: range.endOffset,
        endPos,
        isCollapsed,
        startNode,
        startOffset: range.startOffset,
        startPos,
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
    for (let i = 0; i < paragraphs.length; ++i) {
        if (paragraphs[i].dataset.tnode == nid) {
            return paragraphs[i];
        }
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

function getNodeIdFromElement(el) {
    while (el && !el.classList?.contains("tinymde-paragraph")) {
        el = el.parentElement;
    }
    return el ? el.dataset.tnode : -1;
}

function insertNode(nid, type, metadata = {}, text = "") {
    const newRoot = {};
    for (let i = 1; i < nid; ++i) {
        newRoot[i] = this.root[i];
    }
    // TODO: add create node function
    newRoot[nid] = {
        type,
        metadata,
        text,
        html: "",
    };
    for (let i = nid; i <= Object.keys(this.root).length; ++i) {
        newRoot[i + 1] = this.root[i];
    }
    this.root = newRoot;
    generateHTML.call(this, nid);
}

function removeNode(fromNid, toNid) {
    const removedNodes = toNid - fromNid - 1;
    const newRoot = {};
    let idx = 1;
    for (; idx <= fromNid; ++idx) {
        newRoot[idx] = this.root[idx];
    }
    const len = Object.keys(this.root).length;
    for (let i = toNid; i <= len; ++i) {
        newRoot[idx++] = this.root[i];
    }
    this.root = newRoot;
    return toNid - removedNodes - 1;
}

function generateHTML(nid) {
    let base = `$1`;
    const node = this.root[nid];

    // TODO: temporary node processing
    node.type = getNodeType(node.text).type;

    if (node.type === "text") {
        base = base.replace(/\$1/g, node.text);
    }

    if (node.type === "header") {
        let content = node.text.substr(node.metadata.len + 1);
        const gutter = "#".repeat(node.metadata.len) + " ";
        content = `<strong><span class="gutter">${gutter}</span>${content}</strong>`;
        base = base.replace(/\$1/g, content);
    }

    if (node.type === "new-line") {
        base = base.replace(/\$1/g, "<br>");
    }

    node.html = base;

    const regex = {
        bold: /(\*{2,3})(.+?)(\1)/gm,
        italic: /(?<=(\*\*|\s|^))\*{1}([^\*].+?)(\*{1})(?=(\*\*|\s|$))/gm,
    };

    node.html = node.html.replace(regex.bold, "<strong>$&</strong>");
    node.html = node.html.replace(regex.italic, "<em>$&</em>");
}

export default Document;
