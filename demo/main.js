const TinyMDE = window.TinyMDE.default;
const TinyMDEInstance = new TinyMDE("#root", {
    toggleToolbar: false,
});

TinyMDEInstance.setContent("# Chapter 1 - MR. SHERLOCK HOLMES\n\n**MR. SHERLOCK HOLMES**, who was ~unusually~ *usually* very late in the mornings, save upon those not infrequent occasions when he stayed up all night, was seated at the breakfast table. I stood upon the hearth-rug and picked up the stick which our visitor had left behind him the night before. It was a fine, thick piece of wood, bulbous-headed, of the sort which is known as a “Penang lawyer.” Just under the head was a broad silver band, nearly an inch across. “To James Mortimer, M.R.C.S., from his friends of the C.C.H.,” was engraved upon it, with the date “1884.” It was just such a stick as the old-fashioned family practitioner used to carry—dignified, solid, and reassuring.");

TinyMDEInstance.registerShortcut("ctrl+s", () => {
    console.log("Save document");
});