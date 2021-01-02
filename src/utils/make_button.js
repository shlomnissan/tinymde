export default function makeButton(label, className) {
    const button = document.createElement("button");
    button.className = className;
    button.innerText = label;
    return button;
}
