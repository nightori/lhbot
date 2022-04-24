import gis from 'g-i-s';

export const names = ['picture', 'pic', 'пик'];
export const description = 'Найти и показать картинку по запросу';
export const args = null;
export const restricted = false;
export const serverOnly = false;
export const botChannelOnly = true;
export const hidden = false;

// global references
let message;

export function execute(msg) {
	// save the message object
	message = msg;

	// if the args are empty, set our query to be a random word
	const dict = msg.client.modules.get('dictionary');
	const query = msg.argsline || dict.getRandomWord();

	// perform a search
	gis(query, callback);
}

function callback(error, results) {
	// if we were unable to get a response
	if (error) {
		console.log(error);
		message.channel.send('Что-то пошло не так, ошибка была записана в логи.');
	}

	// if the search was successful but returned nothing
	else if (results.length == 0) {
		message.channel.send('По данному запросу ничего не нашлось.');
	}

	// if everything's fine
	else {
		for (let result of results) {
			// skip the url if it contains weird shit
			if (result.url.match(/[\\\(\)#&?]/)) continue;

			// send the picture by url and stop
			message.channel.send(result.url);
			break;
		}
	}
}
