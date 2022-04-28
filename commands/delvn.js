import cfg from './../config.js';

export const names = ['delvn', 'deletevn'];
export const description = 'Удалить тег из таблицы VNR';
export const args = ['tag'];
export const restricted = false;
export const serverOnly = true;
export const botChannelOnly = false;
export const hidden = true;

// global references
let message;

export function execute(msg) {
	// if the command wasn't called in the right channel
	if (msg.channelId != cfg.channels.vnr) {
		const text = 'Данную команду можно использовать только в специальном канале!';
		msg.reply(text);
		return;
	}

	// save a reference to the message
	message = msg;

	// get the VNR module and call it
	const vnr = msg.client.modules.get('vnr');
	vnr.deleteVn(msg.args[0], callback);
}

function callback(err, resp, body) {
	// if there was an error
	if (err) {
		console.error(err);
		message.reply("Произошла ошибка при обращении к серверу!");
		return;
	}

	switch(body) {
		// success
		case "ok": {
			message.channel.send("Новелла успешно удалена из базы!");
			break;
		}
		// not found
		case "missing": {
			message.channel.send("Такой новеллы в базе нет!");
			break;
		}
		// unknown failure
		default: {
			message.reply(`Что-то пошло не так: ${body}`);
			break;
		}
	}
}
