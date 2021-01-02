import Commands from "./commands/commands";
import makeButton from "./utils/make_button";

const Toolbar = function (root, handleCommand) {
    this.handleCommand = handleCommand;
    this.toolbar = document.createElement("div");
    this.toolbar.id = "tinymde-toolbar";
    root.append(this.toolbar);
    renderToolbar.call(this);
};

Toolbar.prototype.onclick = function (cmd) {
    this.handleCommand(cmd);
};

function renderToolbar() {
    const _this = this;
    Object.keys(Commands).forEach((cmd) => {
        const button = makeButton(Commands[cmd].label, Commands[cmd].id);
        button.onclick = () => _this.handleCommand(Commands[cmd]);
        _this.toolbar.append(button);
    });
}

export default Toolbar;
