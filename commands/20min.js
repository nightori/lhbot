export const names = ['20min', '20мин', '20минут'];
export const description = 'Ответить на заданное сообщение фразой про 20 минут';
export const args = null;
export const restricted = false;
export const serverOnly = false;
export const botChannelOnly = true;
export const hidden = false;

const phrases = ['У тебя есть 20 минут на ответ, жду.',
    'Если через 20 минут не ответишь — дам пермак.',
    'Даю тебе 20 минут, чтобы ответить.',
    'Через 20 минут приду, если не будет твоего ответа — бан.'];

export function execute(msg) {
    // get the module and the referenced message
    const utils = msg.client.modules.get('utils');
    const link = msg.args[0];
    utils.getMessageByLinkAndCall(link, msg, callback);
}

// callback of getRefMessageAndCall()
function callback(msg) {
    if (msg) {
        const text = phrases[Math.floor(Math.random() * phrases.length)];
        msg.reply(text);
    }
}
