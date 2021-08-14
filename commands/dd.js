const dayjs = require('dayjs');

dayjs.extend(require('dayjs/plugin/customParseFormat'));

module.exports = {
	names: ['dd', 'diff'],
	description: 'Посчитать разницу между двумя датами',
	args: ['[date 1]', '[date 2]'],
	restricted: false,
	serverOnly: false,
	hidden: false,
	execute(msg) {
		// get the utils module
		const utils = msg.client.modules.get('utils');

		// convert both dates to Date objects
		const date1 = toDate(msg.args[0]);
		const date2 = toDate(msg.args[1]);

		// if both are valid
		if (date1.isValid() && date2.isValid()) {
			// get the difference in ms
			const diff = Math.abs(date1.diff(date2));

			// get the humanized duration string
			let dur = utils.getDurationString(diff);
			
			// get total days
			const days = Math.abs(date1.diff(date2, 'd'));
			if (days > 30) dur += `\nВсего дней: ${days}`;
			
			// if it's null, the duration is less than a day
			msg.channel.send(dur ? `Разница: ${dur}` : 'Между этими датами нет разницы!');
		}
		else {
			msg.respond('Даты не соответствуют формату ДД.ММ.ГГГГ.');
		}		
	}
};

function toDate(date) {
	const nowKeywords = ['now', 'today', 'сейчас', 'сегодня'];

	// if the date is not a keyword
	if (nowKeywords.indexOf(date) == -1) {
		// parse it as date
		return dayjs(date, 'DD.MM.YYYY');
	}
	else {
		const today = new Date(dayjs().year(), dayjs().month(), dayjs().date());
		return dayjs(today);
	}
}