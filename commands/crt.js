var dayjs = require('dayjs');

module.exports = {
	names: ['crt'],
	description: 'Определить дату создания дискорд-объекта',
	args: ['[object]'],
	restricted: false,
	serverOnly: false,
	hidden: false,
	execute(msg) {
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
			msg.respond('Указан некорректный дискорд-объект.');
		}
	}
};