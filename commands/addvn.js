import cfg from './../config.js';

export const names = ['addvn'];
export const description = 'Добавить новый тег в таблицу VNR';
export const args = null;
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

	// if the command wasn't called with proper args
	if (msg.args.length < 3) {
		const text = `Данная команда используется вот так: \`${cfg.prefix}addvn [tag] [link] [name]\``;
		msg.reply(text);
		return;
	}

	// get the VN object
	const vn = {
		tag: msg.args.shift().toLowerCase(),
		link: msg.args.shift(),
		name: msg.args.join(' ')
	};

	// save a reference to the message
	message = msg;

	// get the VNR module and call it
	const vnr = msg.client.modules.get('vnr');
	vnr.addVn(vn, callback);
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
			message.channel.send("Новелла успешно добавлена в базу!");
			break;
		}
		// already exists
		case "duplicate": {
			message.reply("Такая новелла уже есть в базе!");
			break;
		}
		// bad request
		default: {
			message.reply(`Неверно заполнены поля: ${body}`);
			break;
		}
	}
}
