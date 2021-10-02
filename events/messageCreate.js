import cfg from './../config.js';

export const name = 'messageCreate';

export function handler(message) {
	// apply wordfilter before any checks
	wordfilter(message);

	// replace the old prefix
	message.content = message.content.replace(/^\$/, cfg.prefix);

	// stop if it doesn't start with the prefix or is sent by a bot
	if (!message.content.startsWith(cfg.prefix) || message.author.bot)
		return;

	// set the args array and get the command name
	message.args = message.content.slice(cfg.prefix.length).trim().split(/ +/);
	const commandName = message.args.shift().toLowerCase();

	// set the args line and get the command object, stop if it's not found
	message.argsline = message.args.join(' ');
	const command = message.client.commands.get(commandName);
	if (!command)
		return;

	// do all the checks and stop if any of them fail
	const failMessage = check(command, message);
	if (failMessage)
		return message.reply(failMessage);

	// set default success and error handlers for API operations
	message.successHandler = () => message.channel.send('Операция успешно выполнена.');
	message.errorHandler = (e) => {
		message.channel.send(`Ошибка: \`${e.message || e.msg || e}\``);
		console.error(e);
	};

	// at last, if all the checks were passed, try to execute the command
	try {
		command.execute(message);
	} catch (error) {
		console.error(error);
		message.reply('Не удалось выполнить данную команду...');
	}
}

// check all the command constraints
// returns null if everything is fine or an error message if not
function check(command, message) {
	// if a creator-only command is used by a pleb
	if (command.restricted && message.author.id != cfg.creator) {
		return (message.channel.type == 'DM') ? 'Пошёл нахуй!' : '<:poshelnahui:456438347259445248>';
	}

	// if a server-only command is used in DM
	if (command.serverOnly && message.channel.type == 'DM') {
		return 'Данную команду нельзя использовать в личных сообщениях.';
	}

	// if a command is called without enough args
	if (command.args && command.args.length > message.args.length) {
		const usage = command.args.join(' ');
		return `Данная команда используется вот так: \`${cfg.prefix}${command.names[0]} ${usage}\``;
	}

	// everything is fine
	return null;
}

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
			for (let i = 0; i < reaction.length; i++) {
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
