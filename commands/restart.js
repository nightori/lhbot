export const names = ['restart'];
export const description = 'Перезапустить бота';
export const args = null;
export const restricted = true;
export const serverOnly = false;
export const hidden = true;

export function execute(msg) {
	// this actually just shuts it down
	// but systemd will restart it automatically
	msg.client.shutdown();
}
