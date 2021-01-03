/**
 * Returns the range of the current selection. This function assumes that a selection is set. 
 * @return {Range}
 */
export default function getRange() {
    if (!document.getSelection) {
        console.error("documnt.getSelection() isn't supported.");
        return;
    }
    const selection = document.getSelection();
    return selection.getRangeAt(0);
}
