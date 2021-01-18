const commands = [
    ["bold", "italic", "strikethrough"],
    [
        {
            header: {
                options: {
                    H1: "1",
                    H2: "2",
                    H3: "3",
                    H4: "4",
                    H5: "5",
                    H6: "6",
                },
                optionsType: "grid",
            },
        },
    ],
];

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
            if (typeof command === "object") {
                Object.keys(command).forEach((label) => {
                    const button = makeButton(
                        `tinymde-cmd-${label} has-options`
                    );
                    makeOptions.call(
                        this,
                        label,
                        button,
                        command[label].options,
                        command[label].optionsType
                    );
                    group_el.append(button);
                });
            } else {
                const button = makeButton(`tinymde-cmd-${command}`);
                button.onclick = () => this.handleCommand(command);
                group_el.append(button);
            }
        });
        this.toolbar.append(group_el);
    });
}

/**
 * Creates a simple HTML button.
 * @param {string} className
 * @return {HTMLButtonElement}
 */
function makeButton(className, label = "") {
    const buttonWrapper = document.createElement("div");
    buttonWrapper.className = "button-wrapper";

    const button = document.createElement("div");
    button.className = `tinymde-command ${className}`;
    if (label) {
        button.innerHTML = label;
    }

    buttonWrapper.append(button);
    return buttonWrapper;
}

/**
 * Creates command options selection.
 * @param {string} command
 * @param {HTMLDivElement} button
 * @param {Object} options - key/value options.
 * @param {string} optionsType
 */
function makeOptions(command, button, optionsList, optionsType) {
    const options = document.createElement("div");
    options.className = `options ${optionsType}`;
    Object.keys(optionsList).forEach((key) => {
        const button = makeButton(`${command}-option`, key);
        button.onclick = () => this.handleCommand(command, optionsList[key]);
        options.append(button);
    });
    button.append(options);
}

export default Toolbar;
