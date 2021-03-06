import Cursor from "./utils/cursor";
import Commands from "./commands/commands";

const NodeType = {
    TEXT: "text",
    NEW_LINE: "new-line",
    HEADER: "header",
    BLOCKQUOTE: "blockquote",
    UNORDERED_LIST: "unordered-list",
    ORDERED_LIST: "ordered-list",
};

const Document = {
    dom: {},
    editor: null,
    lastNode: 0,

    /**
     * Initialization - set the document render target
     * and render and empty node.
     * @param {HTMLElement} editor
     */
    init: function (editor) {
        this.editor = editor;
        this.dom[++this.lastNode] = createNode("");
        this.render();
    },

    /**
     * Build the document model, render it, and set cursor at the end.
     * This function should be used when the content is being set dynamically.
     * @param {string} content
     */
    reset: function (content) {
        this.dom = {};
        this.lastNode = 0;
        const paragraphs = content.split(/\n/gm);
        paragraphs.forEach((para) => {
            const nid = ++this.lastNode;
            this.dom[nid] = createNode(para);
        });
        if (paragraphs.length) {
            this.render();
        }
    },

    /**
     * Insert a new paragraph into the document model.
     * This function should be called on carriage return (enter key press).
     */
    insertParagraph: function () {
        const info = getSelection();
        const nid = info.startNode;
        const node = this.dom[nid];
        let offset = 0;

        if (info.isCollapsed) {
            if (info.startOffset === 0) {
                // add empty paragraph above
                const nextNid = nid == 0 ? 1 : nid;
                insertNode.call(this, nextNid, createNode(""));
            } else if (info.startPos === node.text.length) {
                // add empty paragraph below
                insertNode.call(
                    this,
                    nid + 1,
                    createNode(addMarkdownIfNeeded(""))
                );
            } else {
                // add paragraph below with content from the selection until the end
                const node = this.dom[info.startNode];
                const first = node.text.substr(0, info.startPos);
                const second = node.text.substr(info.startPos);
                split.call(this, first, addMarkdownIfNeeded(second));
            }
        } else {
            if (info.startNode === info.endNode) {
                // add paragraph below, remove selected text in a single node
                const first = node.text.substr(0, info.startPos);
                const second = node.text.substr(info.endPos);
                split.call(this, first, addMarkdownIfNeeded(second));
            } else {
                // add paragraph below, remove selected text on multiple nodes
                const range = window.getSelection().getRangeAt(0);
                range.deleteContents();

                const startContainer = getElementWithNid(info.startNode);
                updateNode(this.dom[info.startNode], startContainer.innerText);

                const endContainer = getElementWithNid(info.endNode);
                updateNode(this.dom[info.endNode], endContainer.innerText);

                removeNode.call(this, info.startNode, info.endNode);
            }
        }

        function addMarkdownIfNeeded(text) {
            if (node.type === NodeType.UNORDERED_LIST) {
                // previous node is an unordered list
                if (node.text.length > Commands.UnorderedList.offset) {
                    offset = Commands.UnorderedList.offset;
                    return "- " + text;
                } else {
                    // prev list node is empty, clear list
                    updateNode(node, "");
                }
            }
            if (node.type === NodeType.ORDERED_LIST) {
                // previous node is an ordered list
                const match = Commands.OrderedList.regex.exec(node.text);
                const len = match[0].length;
                if (node.text.length > len) {
                    const next_item = parseInt(match[1]) + 1;
                    offset = len;
                    return `${next_item}. ` + text;
                } else {
                    // prev list node is empty, clear list
                    updateNode(node, "");
                }
            }
            return text;
        }

        function split(first, second) {
            updateNode(this.dom[nid], first);
            insertNode.call(this, nid + 1, createNode(second));
        }

        this.render();
        Cursor.setCurrentCursorPosition(offset, getElementWithNid(nid + 1));
    },

    /**
     * Updates the current node and the HTML element if needed.
     * This function is called on every key press that isn't a document modifier.
     * @param {string} key
     */
    update: function (key = "") {
        if (this.editor.innerText.length === 0) {
            // the editor is empty, reset virtual dom
            setTimeout(() => {
                this.reset(this.editor.innerText);
                this.render();
            });
            return;
        }

        const info = getSelection();
        const node = this.dom[info.startNode];
        const currType = node.type;
        const el = getElementWithNid(info.startNode);
        if (!el) return;

        const triggerUpdate = function () {
            // HTML structure changed, trigger re-render
            const cursorPos = Cursor.getCurrentCursorPosition(el);
            el.innerHTML = node.html;
            Cursor.setCurrentCursorPosition(cursorPos, el);
        };

        if (key === "Backspace") {
            // clear empty list entry
            if (
                node.type === NodeType.UNORDERED_LIST &&
                el.innerText.length === 1
            ) {
                updateNode(node, "");
                el.innerHTML = node.html;
                return;
            }
        }

        updateNode(node, el.innerText);

        if (currType !== node.type) {
            // type was changed, update paragraph classList
            el.classList.forEach((classStr) => {
                if (classStr !== "tinymde-paragraph") {
                    el.classList.remove(classStr);
                }
            });
            el.classList.add(`tinymde-${node.type}`);
        }

        // if space key, force re-render the node
        if (key === " ") {
            triggerUpdate();
            return;
        }

        // TODO: compare HTML (including classes) before triggering an update
        const newEl = document.createElement("div");
        newEl.innerHTML = node.html;
        triggerUpdate();
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
            const node = this.dom[info.startNode];
            const prevNode = this.dom[info.startNode - 1];
            cursorOffset = prevNode.text.length;
            if (node.type !== NodeType.NEW_LINE) {
                if (info.startNode === 1) return true;
                // copy current paragraph content to the one above
                updateNode(
                    this.dom[info.startNode - 1],
                    prevNode.text + node.text
                );
            }
            removeNode.call(this, info.startNode - 1, info.startNode + 1);
            cursorNode = info.startNode - 1;
        } else {
            // handle multi-node selection. merge start/end nodes
            // and remove everything in-between
            const range = window.getSelection().getRangeAt(0);
            range.deleteContents();

            const { startNode, endNode } = info;
            const startContainer = getElementWithNid(startNode);
            const endContainer = getElementWithNid(endNode);

            cursorOffset = startContainer.innerText.length;

            updateNode(
                this.dom[startNode],
                startContainer.innerText + endContainer.innerText
            );

            removeNode.call(this, startNode, endNode + 1);
        }

        this.render();
        Cursor.setCurrentCursorPosition(
            cursorOffset,
            getElementWithNid(cursorNode)
        );

        return true;
    },

    /**
     * Renders the document model and assigns it to the render target.
     */
    render: function () {
        let output = "";
        Object.keys(this.dom).forEach((nid) => {
            const classes = `tinymde-${this.dom[nid].type}`;
            output += `<div class="tinymde-paragraph ${classes}" data-nid="${nid}">${this.dom[nid].html}</div>`;
        });
        this.editor.innerHTML = output;
    },
};

function getSelection() {
    const sel = window.getSelection();
    const el = getActiveParagraph();

    if (!sel || !el) {
        console.error("TinyMDE: Unable to process selection.");
        return;
    }

    const range = sel.getRangeAt(0);
    const isCollapsed = sel.isCollapsed;
    const startNode = parseInt(getNearestNidWithElement(range.startContainer));
    const endNode = parseInt(getNearestNidWithElement(range.endContainer));
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

export function getActiveParagraph() {
    let container = window.getSelection().anchorNode;
    while (container.nodeType === Node.TEXT_NODE) {
        container = container.parentElement;
    }
    while (!container.classList.contains("tinymde-paragraph")) {
        if (container.parentElement === null) {
            container = null;
            break;
        }
        container = container.parentElement;
    }
    if (!container) {
        // if unable to select an active paragraph
        // return the first one
        const paragraphs = document.querySelectorAll(".tinymde-paragraph");
        if (paragraphs.length) {
            container = paragraphs[0];
        }
    }
    return container;
}

function getElementWithNid(nid) {
    const paragraphs = document.querySelectorAll(".tinymde-paragraph");
    for (let i = 0; i < paragraphs.length; ++i) {
        if (paragraphs[i].dataset.nid == nid) {
            return paragraphs[i];
        }
    }
    return null;
}

function getNodeType(para) {
    if (para.length == 0) {
        return { type: NodeType.NEW_LINE, metadata: {} };
    }

    if (para.match(Commands.Header.regex)) {
        const len = Commands.Header.regex.exec(para)[1].length;
        return { type: NodeType.HEADER, metadata: { len } };
    }

    if (para.match(Commands.Blockquote.regex)) {
        return { type: NodeType.BLOCKQUOTE, metadata: {} };
    }

    if (para.match(Commands.UnorderedList.regex)) {
        return { type: NodeType.UNORDERED_LIST, metadata: {} };
    }

    if (para.match(Commands.OrderedList.regex)) {
        return { type: NodeType.ORDERED_LIST, metadata: {} };
    }

    return { type: NodeType.TEXT, metadata: {} };
}

function getNearestNidWithElement(el) {
    while (el && !el.classList?.contains("tinymde-paragraph")) {
        el = el.parentElement;
    }
    return el ? el.dataset.nid : -1;
}

function createNode(text) {
    const { type, metadata } = getNodeType(text);
    const html = processHTML(text, type, metadata);
    return {
        type,
        metadata,
        text,
        html,
    };
}

function updateNode(node, text) {
    const { type, metadata } = getNodeType(text);
    node.text = text;
    node.type = type;
    node.metadata = metadata;
    node.html = processHTML(text, type, metadata);
}

function insertNode(nid, node) {
    const newRoot = {};
    for (let i = 1; i < nid; ++i) {
        newRoot[i] = this.dom[i];
    }
    newRoot[nid] = node;
    for (let i = nid; i <= Object.keys(this.dom).length; ++i) {
        newRoot[i + 1] = this.dom[i];
    }
    this.dom = newRoot;
    updateNode(this.dom[nid], node.text);
}

// TODO: removeNode and removeNodeInRange
function removeNode(fromNid, toNid) {
    const removedNodes = toNid - fromNid - 1;
    const newRoot = {};
    let idx = 1;
    for (; idx <= fromNid; ++idx) {
        newRoot[idx] = this.dom[idx];
    }
    const len = Object.keys(this.dom).length;
    for (let i = toNid; i <= len; ++i) {
        newRoot[idx++] = this.dom[i];
    }
    this.dom = newRoot;
    return toNid - removedNodes - 1;
}

function processHTML(text, type, metadata) {
    let str = "";

    // escape HTML tags
    text = text.replace(/&/g, "&amp;");
    text = text.replace(/</g, "&lt;");
    text = text.replace(/>/g, "&gt;");

    switch (type) {
        case NodeType.NEW_LINE:
            str = "<br>";
            break;
        case NodeType.HEADER:
            const content = text.substr(metadata.len + 1);
            const gutter = "#".repeat(metadata.len) + " ";
            str = `<strong><span class="gutter">${gutter}</span>${content}</strong>`;
            break;
        default:
            str = text;
    }

    const regex = {
        italic: /(?<=(\*\*|\s|^))\*{1}([^\*].+?)(\*{1})(?=(\*\*|\s|$))/g,
    };

    str = str.replace(Commands.Bold.regex, `<span class="md-strong">$&</span>`);
    str = str.replace(regex.italic, `<span class="md-emphasize">$&</span>`);
    str = str.replace(
        Commands.Strikethrough.regex,
        `<span class="md-strike">$&</span>`
    );

    return mergeNestedMarkdown(str);
}

function mergeNestedMarkdown(str) {
    const nestedMatches = str.match(
        /((<span class="(md-[a-z-]+)?">)(~~|\*\*|\*)){2,5}(.[^<]+)((~~|\*\*|\*)<\/span>)+/g
    );

    nestedMatches?.forEach(function (match) {
        const it = match.matchAll(/<span class="([a-zA-Z-]+)">/g);
        let group = it.next();
        const classes = new Set();
        while (!group.done) {
            classes.add(group.value[1]);
            group = it.next();
        }

        let classesStr = "";
        classes.forEach((str) => {
            classesStr += str + " ";
        });

        let text = match.replace(/<span class="[a-zA-Z-\s]+">/g, "");
        text = text.replace(/<\/span>/g, "");
        str = str.replace(match, `<span class="${classesStr}">${text}</span>`);
    });

    return str;
}

export default Document;
