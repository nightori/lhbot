export const names = ['zv', 'vz'];
export const description = 'Патриотично zаменяет букvы';
export const args = null;
export const restricted = false;
export const serverOnly = false;
export const botChannelOnly = true;
export const hidden = false;

export function execute(msg) {
    let text = msg.argsline;
    text = text.replace(/з/g, 'z');
    text = text.replace(/З/g, 'Z');
    text = text.replace(/в/g, 'v');
    text = text.replace(/В/g, 'V');
    msg.channel.send(text);
}
