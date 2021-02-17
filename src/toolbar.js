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
        "unordered-list",
        "ordered-list",
        "blockquote",
    ],
    ["link"],
];

const Toolbar = {
    toolbar: document.createElement("div"),

    init: function (root, handleCommand) {
        this.handleCommand = handleCommand;
        this.toolbar = document.createElement("div");
        this.toolbar.id = "tinymde-toolbar";
        root.append(this.toolbar);
        renderToolbar.call(this);
    },

    hide: function () {
        this.toolbar.classList.add("hide");
    },

    show: function () {
        this.toolbar.classList.remove("hide");
    },

    setWordCount: function (count) {
        let wordCountEl = this.toolbar.querySelector("#tinymde-word-count");
        if (!wordCountEl) {
            wordCountEl = document.createElement("div");
            wordCountEl.id = "tinymde-word-count";
            this.toolbar.append(wordCountEl);
        }
        wordCountEl.innerHTML = `<p>${count} Words</p>`;
    },
};

export default Toolbar;

function renderToolbar() {
    commands.forEach((group) => {
        const group_el = document.createElement("div");
        group_el.classList.add("tinymde-cmd-group");
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
                    button.onmouseover = () => {
                        document
                            .querySelectorAll(".options")
                            .forEach((options) => {
                                options.classList.remove("show");
                            });
                        group_el
                            .querySelector(".options")
                            .classList.add("show");
                    };
                    group_el.onmouseout = () => {
                        group_el
                            .querySelector(".options")
                            .classList.remove("show");
                    };
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

function makeOptions(command, button, optionsList, optionsType) {
    const options = document.createElement("div");
    options.className = `options ${optionsType}`;
    Object.keys(optionsList).forEach((key) => {
        const button = makeButton(`${command}-option`, key);
        button.onclick = () =>
            this.handleCommand(command, parseInt(optionsList[key]));
        options.append(button);
    });
    button.append(options);
}
