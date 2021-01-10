/**
 * Creates a simple HTML button.
 * @param {string} label
 * @param {string} className
 * @return {HTMLButtonElement}
 */
export default function makeButton(label, className) {
    const button = document.createElement("button");
    button.className = `tinymde-command ${className}`;
    return button;
}
