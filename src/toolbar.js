const commands = [["header"], ["bold", "italic", "strikethrough"]];

/**
 * Toolbar object.
 * @constructor
 * @param {HTMLDivElement} root - The root HTML object.
 */
const Toolbar = function (root, handleCommand) {
    this.handleCommand = handleCommand;
    this.toolbar = document.createElement("div");
    this.toolbar.id = "tinymde-toolbar";
    root.append(this.toolbar);
    renderToolbar.call(this);
};

/**
 * Renders toolbar buttons.
 */
function renderToolbar() {
    commands.forEach((group) => {
        const group_el = document.createElement("div");
        group_el.classList = ["tinymde-cmd-group"];
        group.forEach((command) => {
            const button = makeButton(`tinymde-cmd-${command}`);
            button.onclick = () => this.handleCommand(command);
            group_el.append(button);
        });
        this.toolbar.append(group_el);
    });
}

/**
 * Creates a simple HTML button.
 * @param {string} className
 * @return {HTMLButtonElement}
 */
function makeButton(className) {
    const button = document.createElement("button");
    button.className = `tinymde-command ${className}`;
    return button;
}

export default Toolbar;
