let browserSupportsTextareaTextNodes;

/**
 * @param {HTMLElement} input
 * @return {boolean}
 */
function canManipulateViaTextNodes(input) {
    if (input.nodeName !== "TEXTAREA") {
        return false;
    }
    if (typeof browserSupportsTextareaTextNodes === "undefined") {
        const textarea = document.createElement("textarea");
        textarea.value = 1;
        browserSupportsTextareaTextNodes = !!textarea.firstChild;
    }
    return browserSupportsTextareaTextNodes;
}

/**
 * @param {HTMLTextAreaElement|HTMLInputElement} input
 * @param {string} text
 * @returns {void}
 */
export default function (input, text) {
    /**
     * The MIT License
     * Copyright (c) 2018 Dmitriy Kubyshkin
     * https://github.com/grassator/insert-text-at-cursor
     */

    // Most of the used APIs only work with the field selected
    input.focus();

    // IE 8-10
    if (document.selection) {
        const ieRange = document.selection.createRange();
        ieRange.text = text;

        // Move cursor after the inserted text
        ieRange.collapse(false /* to the end */);
        ieRange.select();

        return;
    }

    // Webkit + Edge
    const isSuccess = document.execCommand("insertText", false, text);
    if (!isSuccess) {
        const start = input.selectionStart;
        const end = input.selectionEnd;
        // Firefox (non-standard method)
        if (typeof input.setRangeText === "function") {
            input.setRangeText(text);
        } else {
            // To make a change we just need a Range, not a Selection
            const range = document.createRange();
            const textNode = document.createTextNode(text);

            if (canManipulateViaTextNodes(input)) {
                let node = input.firstChild;

                // If textarea is empty, just insert the text
                if (!node) {
                    input.appendChild(textNode);
                } else {
                    // Otherwise we need to find a nodes for start and end
                    let offset = 0;
                    let startNode = null;
                    let endNode = null;

                    while (node && (startNode === null || endNode === null)) {
                        const nodeLength = node.nodeValue.length;

                        // if start of the selection falls into current node
                        if (start >= offset && start <= offset + nodeLength) {
                            range.setStart((startNode = node), start - offset);
                        }

                        // if end of the selection falls into current node
                        if (end >= offset && end <= offset + nodeLength) {
                            range.setEnd((endNode = node), end - offset);
                        }

                        offset += nodeLength;
                        node = node.nextSibling;
                    }

                    // If there is some text selected, remove it as we should replace it
                    if (start !== end) {
                        range.deleteContents();
                    }
                }
            }

            // If the node is a textarea and the range doesn't span outside the element
            //
            // Get the commonAncestorContainer of the selected range and test its type
            // If the node is of type `#text` it means that we're still working with text nodes within our textarea element
            // otherwise, if it's of type `#document` for example it means our selection spans outside the textarea.
            if (
                canManipulateViaTextNodes(input) &&
                range.commonAncestorContainer.nodeName === "#text"
            ) {
                // Finally insert a new node. The browser will automatically split start and end nodes into two if necessary
                range.insertNode(textNode);
            } else {
                // If the node is not a textarea or the range spans outside a textarea the only way is to replace the whole value
                const value = input.value;
                input.value = value.slice(0, start) + text + value.slice(end);
            }
        }

        // Correct the cursor position to be at the end of the insertion
        input.setSelectionRange(start + text.length, start + text.length);

        // Notify any possible listeners of the change
        const e = document.createEvent("UIEvent");
        e.initEvent("input", true, false);
        input.dispatchEvent(e);
    }
}

/**
 * Returns the currently active range.
 * @return {Range}
 */
function getActiveRange() {
    if (!document.getSelection) {
        console.error("TinyMDE: documnt.getSelection() isn't supported.");
        return;
    }
    const selection = document.getSelection();
    return selection.getRangeAt(0);
}

/**
 * Returns the position of the surrounding word based on the cursor position.
 * @param {string} text - The full text.
 * @param {number} position - The cursor's location.
 * @return {Object} - { start: number, end: number }.
 */
export function getSurroundingWord(text, position) {
    const isWordDelimiter = (c) => {
        return c === " " || c.charCodeAt(0) === 10 || c.charCodeAt(0) === 160;
    };

    let start = 0;
    for (let i = position; i - 1 >= 0; i--) {
        if (isWordDelimiter(text[i - 1])) {
            start = i;
            break;
        }
    }

    let end = text.length;
    for (let i = position; i < text.length; i++) {
        if (isWordDelimiter(text[i])) {
            end = i;
            break;
        }
    }

    return { start, end };
}

/**
 */
export function getContainerFromActiveRange() {
    const range = getActiveRange();
    if (!range) return null;

    let container = range.startContainer;
    if (!container) return;

    return container.nodeType === Node.TEXT_NODE
        ? container
        : range.startContainer.firstChild;
}

/**
 */
export function selectContentInActiveRange({ start, end }) {
    const container = getContainerFromActiveRange();
    if (!container) return;

    const range = getActiveRange();

    range.setStart(container, start);
    range.setEnd(container, end);

    return range.cloneContents().textContent;
}

/**
 */
export function selectContentInElement(element) {
    const sel = window.getSelection();
    const range = new Range();
    if (element.nodeType === Node.TEXT_NODE) {
        range.setStart(element.firstChild, 0);
        range.setEnd(element.firstChild, element.innerText.length);
    } else {
        range.setStart(element.firstChild, 0);
        range.setEndAfter(element.lastChild);
    }
    sel.removeAllRanges();
    sel.addRange(range);

    return range.cloneContents().textContent;
}

/**
 */
export function stripParagraphMarkdown(text) {
    const regex = new RegExp(`^(\\#{1,6}\\s)|(\\>\\s)(.*?)`, "g");
    const match = text.match(regex);
    if (match) {
        const offset = match[0].length;
        return {
            text: text.substring(offset),
            offset,
        };
    }
    return { text, offset: 0 };
}
