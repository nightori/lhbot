export const names = ['хуй', 'huy'];
export const description = 'Хуефицирует слова в тексте';
export const args = null;
export const restricted = false;
export const serverOnly = false;
export const botChannelOnly = true;
export const hidden = false;

const vowels = new Map([
    ['а', 'хуя'], ['я', 'хуя'],
    ['у', 'хую'], ['ю', 'хую'],
    ['о', 'хуё'], ['е', 'хуе'],
    ['ё', 'хуё'], ['э', 'хуэ'],
    ['и', 'хуи'], ['ы', 'хуы']
]);

export function execute(msg) {
    if (msg.argsline) {
        const result = msg.argsline
            .split('\n')                    // array of lines
            .map(s => s.split(' '))         // array of arrays of words
            .map(s => s.map(processWord))   // array of arrays of processed words
            .map(s => s.join(' '))          // array of processed lines
            .join('\n');                    // processed text

        msg.channel.send(result);
    }
    else {
        msg.reply("Нужно ввести текст для хуефикации.");
    }
}

function processWord(text) {
    const word = text.toLowerCase();
    const index = getVowelIndex(word);
    const vowel = word.charAt(index);
    const prefix = vowels.get(vowel);

    if (prefix) {
        const spliced = prefix + word.substring(index + 1);
        return restoreCase(text, spliced);
    }
    else return text;
}

function getVowelIndex(s) {
    for (let i = 0; i < s.length; i++) {
        if (vowels.has(s.charAt(i)))
            return i;
    }
    return -1;
}

function restoreCase(before, after) {
    if (before.length > 1 && before == before.toUpperCase())
        return after.toUpperCase();

    if (before.isCapitalized())
        return after.capitalize();

    return after;
}
