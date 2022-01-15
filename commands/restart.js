export const names = ['restart'];
export const description = 'Перезапустить что-нибудь';
export const args = null;
export const restricted = true;
export const serverOnly = false;
export const hidden = true;

export function execute(msg) {
	switch(msg.argsline) {
		case 'vk':
			// get the VK module and call its init function
			const vk = msg.client.modules.get('vk');
			vk.init(msg.client);
			break;
		case 'bot':
			// this actually just shuts it down
			// but systemd will restart it automatically
			msg.client.shutdown();
			return;
		default:
			msg.reply('Что перезагружать-то?');
			return;
	}
	msg.successHandler();
}
