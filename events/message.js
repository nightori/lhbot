const cfg = require('./../config.json');

module.exports = {
	name: 'message',
	handler(message) {
		// apply wordfilter before any checks
		wordfilter(message);

		// replace the old prefix
		message.content = message.content.replace(/^\$/, cfg.prefix);

		// stop if it doesn't start with the prefix or is sent by a bot
		if (!message.content.startsWith(cfg.prefix) || message.author.bot) return;

		// set the args array and get the command name
		message.args = message.content.slice(cfg.prefix.length).trim().split(/ +/);
		const commandName = message.args.shift().toLowerCase();

		// get the command object and stop if it's not found
		const command = message.client.commands.get(commandName);
		if (!command) return;
		
		// set custom reply() wrapper function
		message.respond = function(response) {
			// if we're not in DM and it's a string
			if (this.channel.type != 'dm' && response.charAt) {
				// make the first letter small because it won't be the start of the sentence
				this.reply(response.charAt(0).toLowerCase() + response.slice(1));
			}
			// otherwise just reply normally
			else this.reply(response);
		};

		// do all the checks and stop if any of them fail
		const failMessage = check(command, message);
		if (failMessage) return message.respond(failMessage);

		// set default success and error handlers for API operations
		message.successHandler = () => message.channel.send('Операция успешно выполнена.');
		message.errorHandler = (e) => {
			message.channel.send(`Ошибка: \`${e.message || e.msg || e}\``);
			console.error(e);
		}

		// at last, if all the checks were passed, try to execute the command
		try {
			command.execute(message);
		} catch (error) {
			console.error(error);
			message.respond('Не удалось выполнить данную команду...');
		}
	}
};

// react to blacklisted words
function wordfilter(message) {
	// get the message text in lower case
	const text = message.content.toLowerCase();

	// get a random word and transfrom it to an emoji array
	const reactionString = cfg.wfReactions[Math.floor(Math.random() * cfg.wfReactions.length)];
	const reaction = reactionString.split('').map(c => message.client.emojiMap[c]);

	// for each blacklisted word
	cfg.wfWords.forEach(w => {
		// if the message contains the word
		if (text.search(w) != -1) {
			let promise;
			for (var i = 0; i < reaction.length; i++) {
				const letter = reaction[i];

				// if this isn't the first letter, add a promise to the chain
				if (promise) {
					promise
						.then(() => message.react(letter))
						.catch(() => {});
				}
				// if it is, create a promise chain by making the first one
				else {
					promise = message.react(letter);

					// if reaction failed, write a message instead
					promise.catch(() => {
						message.reply('гоните его, насмехайтесь над ним!');
					});
				}
			}
			return;
		}
	});
}

// check all the command constraints
// returns null if everything is fine or an error message if not
function check(command, message) {
	// if a creator-only command is used by a pleb
	if (command.restricted && message.author.id != cfg.creator) {
		return (message.channel.type == 'dm') ? 'Пошёл нахуй!' : '<:poshelnahui:456438347259445248>';
	}

	// if a server-only command is used in DM
	if (command.serverOnly && message.channel.type == 'dm') {
		return 'Данную команду нельзя использовать в личных сообщениях.';
	}

	// if a command is called without enough args
	if (command.args && command.args.length > message.args.length) {
		let usage = command.args.join(' ');
		return `Данная команда используется вот так: \`${cfg.prefix}${command.name} ${usage}\``;
	}

	// everything is fine
	return null;
}