let didInitialize = false;

const activeModifiers = new Set();

const activeKeys = new Set();

const keyWatch = {};

const callbacks = {};

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
function initialize() {
    if (!didInitialize) {
        didInitialize = true;
        window.addEventListener("keydown", (event) => {
            handleKeyDown(event);
        });
        window.addEventListener("keyup", (event) => {
            handleKeyUp(event);
        });
    }
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
        event.preventDefault();
        callbacks[candidate].callback.forEach((c) => c(event));
    });
}

/**
 * Split key combinations string, use '+' as dilimiter.
 * This function DOESN'T trim spaces or validates formatting.
 * @param  {string} str
 */
function getKeys(str) {
    const keys = str.split("+");
    const output = {
        keys: [],
        modifiers: [],
    };
    keys.forEach((key) => {
        if (Object.keys(modifiersMap).includes(key)) {
            output.modifiers.push(modifiersMap[key]);
        } else {
            output.keys.push(key);
        }
    });
    return output;
}

/**
 * Registers a callback for a given key combination.
 * @param  {string} keys
 * @param  {function} callback
 */
function Shortcut(keys, callback) {
    initialize();

    const register = getKeys(keys);
    register.callback = [];

    register.keys.forEach((key) => {
        if (!keyWatch[key]) keyWatch[key] = [];
        keyWatch[key].push(keys);
    });

    if (!callbacks[keys]) {
        callbacks[keys] = register;
    }
    callbacks[keys]["callback"].push(callback);
}

export default Shortcut;
