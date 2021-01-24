const exclusions = ["#", "##", "###", "####", "#####", "######", "*", "-"];

/**
 * Returns word count for text exclusing markdown.
 * @param  {string} str
 * @return {number}
 */
export function wordCount(str) {
    const str_arr = str.split(" ");
    return str_arr.filter((word) => {
        word = trim(word);
        return word.length > 0 && !exclusions.includes(word);
    }).length;
}

/**
 * Trims all spaces from text.
 * @param  {string} str
 * @return {string}
 */
const trimRegex = /[\t\v\f\r \u00a0\u2000-\u200b\u2028-\u2029\u3000]+/g;
export function trim(str) {
    return str.replace(trimRegex, "");
}
