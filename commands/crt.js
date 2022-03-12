import dayjs from 'dayjs';

export const names = ['crt'];
export const description = 'Определить дату создания объекта';
export const args = ['[discord entity]'];
export const restricted = false;
export const serverOnly = false;
export const botChannelOnly = false;
export const hidden = false;

export function execute(msg) {
	// get the utils module
	const utils = msg.client.modules.get('utils');

	// convert ID to timestamp
	const id = utils.getIdFromObjectString(msg.args[0]);
	const ms = (id / 4194304) + 1420070400000;

	// if we got a valid number
	if (ms) {
		// get the date, difference and duration
		const date = dayjs(ms);
		const diff = Math.abs(dayjs().diff(date));
		const dur = utils.getDurationString(diff);

		// if it was more than a day ago
		if (dur) {
			const datetime = date.format('DD.MM.YYYY, HH:mm:ss ([UTC]Z)');
			const response = `Дата и время создания: ${datetime}\nЭто было ${dur} назад`;
			msg.channel.send(response);
		}

		// if it was today
		else {
			const datetime = date.format('сегодня, HH:mm:ss ([UTC]Z)');
			const response = `Дата и время создания: ${datetime}`;
			msg.channel.send(response);
		}
	} else {
		msg.reply('Указан некорректный дискорд-объект.');
	}
}
