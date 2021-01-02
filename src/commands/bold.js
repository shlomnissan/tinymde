import makeButton from "../utils/make_button";

let button;

const Bold = function () {
    button = makeButton("Bold", "tinymde-bold");
    button.onclick = execute;
};

Bold.prototype.getElement = () => {
    return button;
};

const execute = () => {
    // TODO: make bold
};

export default Bold;
