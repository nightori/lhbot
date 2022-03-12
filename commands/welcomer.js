export const names = ['welcomer', 'welcome'];
export const description = 'Включить или выключить приветствия';
export const args = ['[on/off]'];
export const restricted = true;
export const serverOnly = true;
export const botChannelOnly = false;
export const hidden = true;

export function execute(msg) {
	// no persistence here, it's just temporary
	switch (msg.args[0]) {
		case "on": case "enable":
			msg.client.welcomerEnabled = true;
			msg.channel.send('Приветственные сообщения включены.');
			break;
		case "off": case "disable":
			msg.client.welcomerEnabled = false;
			msg.channel.send('Приветственные сообщения выключены.');
			break;
		default:
			msg.channel.send('Ты дурак что ли?');
	}
}
