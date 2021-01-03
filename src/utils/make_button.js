/**
 * Creates a simple HTML button.
 * @param {string} label
 * @param {string} className
 * @return {HTMLButtonElement}
 */
export default function makeButton(label, className) {
    const button = document.createElement("button");
    button.className = `tinymde-command ${className}`;

    const icon = document.createElement("img");
    icon.src = `../src/svg/${label}.svg`;

    button.append(icon);
    return button;
}
