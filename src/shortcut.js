let didInitialize = false;

let thisContainer = null;

let activeModifiers = new Set();

let activeKeys = new Set();

let keyWatch = {};

let callbacks = {};

let deferred = [];

const modifiersMap = {
    shift: 16,
    alt: 18,
    option: 18,
    ctrl: 17,
    control: 17,
    cmd: 91,
    command: 91,
};

const modifiers = [
    16, // shift
    17, // ctrl
    18, // alt
    91, // cmd
];

/**
 * Add keyboard event listeners if needed.
 */
export function initShortcuts(container) {
    if (!didInitialize) {
        didInitialize = true;
        thisContainer = container;
        thisContainer.addEventListener("keydown", handleKeyDown);
        thisContainer.addEventListener("keyup", handleKeyUp);
        deferred.forEach((shortcut) => {
            Shortcut(shortcut.keys, shortcut.callback);
            delete deferred[shortcut];
        });
    } else {
        console.error("TinyMDE: shortcuts are already initialized.");
    }
}

/**
 * Remove event listeners and clear callbacks.
 */
export function deinitShortcuts() {
    thisContainer.removeEventListener("keydown", handleKeyDown);
    thisContainer.removeEventListener("keyup", handleKeyUp);

    activeModifiers = new Set();
    activeKeys = new Set();
    keyWatch = {};
    callbacks = {};

    didInitialize = false;
}

/**
 * Add active key and test for key combinations
 * @param {KeyboardEvent} event
 */
function handleKeyDown(event) {
    const { key, keyCode } = event;
    if (modifiers.includes(keyCode)) {
        activeModifiers.add(keyCode);
    } else {
        activeKeys.add(key);
    }
    if (Object.keys(keyWatch).includes(key)) {
        testKeyCombination(event, keyWatch[key]);
    }
}

/**
 * Remove active key
 * @param {KeyboardEvent} event
 */
function handleKeyUp(event) {
    const { key, keyCode } = event;
    if (modifiers.includes(keyCode)) {
        activeModifiers.delete(keyCode);
    } else {
        activeKeys.delete(key);
    }
}

/**
 * Iterate through potential key combinations.
 * If a match is found, execute callbacks.
 * @param {KeyboardEvent} event
 * @param {Array<Object>} candidates
 */
function testKeyCombination(event, candidates) {
    candidates.forEach((candidate) => {
        let shouldDispatch = true;
        callbacks[candidate].keys.forEach((key) => {
            if (!activeKeys.has(key)) {
                shouldDispatch = false;
            }
        });
        callbacks[candidate].modifiers.forEach((modifier) => {
            if (!activeModifiers.has(modifier)) {
                shouldDispatch = false;
            }
        });
        if (!shouldDispatch) return;
        callbacks[candidate].callback.forEach((c) => c(event));
    });
}

/**
 * Split key combinations string. Each string can have
 * multiple key combinations separated by a comma.
 * @param  {string} str
 */
function getKeyCombinations(str) {
    str = str.replace(/\s/g, "");
    const output = [];
    str.split(",").forEach((combo_str) => {
        const keys = combo_str.split("+");
        const keyCombo = {
            keys: [],
            modifiers: [],
            label: combo_str,
        };
        keys.forEach((key) => {
            if (Object.keys(modifiersMap).includes(key)) {
                keyCombo.modifiers.push(modifiersMap[key]);
            } else {
                keyCombo.keys.push(key);
            }
        });
        output.push(keyCombo);
    });
    return output;
}

/**
 * Registers a callback for a given key combination.
 * @param  {string} keys
 * @param  {function} callback
 */
function Shortcut(keys, callback, defer) {
    if (!didInitialize) {
        if (!defer) {
            console.error("TinyMDE: shortcuts aren't initialized.");
        } else {
            deferred.push({ keys, callback });
        }
        return;
    }
    const keyCombinations = getKeyCombinations(keys);
    keyCombinations.forEach((register) => {
        const { label } = register;
        register.callback = [];
        register.keys.forEach((key) => {
            if (!keyWatch[key]) keyWatch[key] = [];
            keyWatch[key].push(label);
        });
        if (!callbacks[label]) {
            callbacks[label] = register;
        }
        callbacks[label]["callback"].push(callback);
    });
}

export default Shortcut;
