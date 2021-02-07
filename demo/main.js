const TinyMDE = window.TinyMDE.default;
const TinyMDEInstance = new TinyMDE("#root", {
    toggleToolbar: false,
});

TinyMDEInstance.setContent("# Welcome to TinyMDE");

TinyMDEInstance.registerShortcut("ctrl+s", () => {
    console.log("Save document");
});