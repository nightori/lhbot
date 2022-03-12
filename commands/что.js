export const names = ['что'];
export const description = 'Выбрать случайное существительное (и дописать заданный текст)';
export const args = null;
export const restricted = false;
export const serverOnly = false;
export const botChannelOnly = true;
export const hidden = false;

export function execute(msg) {
	const dict = msg.client.modules.get('dictionary');

	// get a random word and capitalize the first letter
	let word = dict.getRandomWord();
	word = word.charAt(0).toUpperCase() + word.slice(1);

	// prepare and send the message
	const desc = msg.argsline;
	const text = desc ? `**${word} ${desc}!**` : `**${word}!**`;
	msg.channel.send(text);
}
