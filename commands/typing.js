export const names = ['typing', 'type', 'набор'];
export const description = 'Включить имитацию набора в указанном канале';
export const args = ['channel'];
export const restricted = false;
export const serverOnly = false;
export const botChannelOnly = true;
export const hidden = false;

export function execute(msg) {
    // get the module and channel id
    const utils = msg.client.modules.get('utils');
    const channelId = utils.getIdFromObjectString(msg.args[0]);

    // validate the id
    if (!utils.isSnowflake(channelId)) {
        msg.reply('Указан некорректный канал!');
        return;
    }

    // start the thing
    const channel = msg.client.channels.cache.get(channelId);
    sendTyping(0, channel);
}

function sendTyping(count, channel) {
    // this is ~ 35 seconds of typing
    if (count < 6) {
        channel.sendTyping();
        setTimeout(() => sendTyping(count + 1, channel), 5000);
    }
}
