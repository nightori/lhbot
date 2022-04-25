export const names = ['zv', 'vz', 'зв', 'вз'];
export const description = 'Патриотично zаменяет букvы';
export const args = null;
export const restricted = false;
export const serverOnly = false;
export const botChannelOnly = true;
export const hidden = false;

export function execute(msg) {
    let text = msg.argsline;
    if (text) {
        text = text.replace(/з/g, 'z');
        text = text.replace(/З/g, 'Z');
        text = text.replace(/в/g, 'v');
        text = text.replace(/В/g, 'V');
        msg.channel.send(text);
    }
    else {
        msg.reply("Нужно ввести текст, в котором будут заменяться буквы.");
    }
}
