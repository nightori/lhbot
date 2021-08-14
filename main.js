const fs = require('fs');
const Discord = require('discord.js');
const cfg = require('./config.json');
const {performance} = require('perf_hooks');
const onDeath = require('death');

const timeStart = performance.now();

// initialize the client and its parameters
const client = new Discord.Client();
require("discord-buttons")(client);

client.modules = new Discord.Collection();
client.commands = new Discord.Collection();
client.buttons = new Discord.Collection();
client.nicknameMap = new Map();
client.welcomerEnabled = true;
client.emojiMap = {
	'a': '🇦', 'b': '🇧', 'c': '🇨', 'd': '🇩', 'e': '🇪', 'f': '🇫', 'g': '🇬', 'h': '🇭', 'i': '🇮',
	'j': '🇯', 'k': '🇰', 'l': '🇱', 'm': '🇲', 'n': '🇳', 'o': '🇴', 'p': '🇵', 'q': '🇶', 'r': '🇷',
	's': '🇸', 't': '🇹', 'u': '🇺', 'v': '🇻', 'w': '🇼', 'x': '🇽', 'y': '🇾', 'z': '🇿', '0': '0️⃣',
	'1': '1️⃣', '2': '2️⃣', '3': '3️⃣', '4': '4️⃣', '5': '5️⃣', '6': '6️⃣', '7': '7️⃣', '8': '8️⃣',
	'9': '9️⃣', '10': '🔟', '#': '#️⃣', '*': '*️⃣', '!': '❗', '?': '❓'
};

// load all modules into the collection and initialize them
const moduleFiles = fs.readdirSync('./modules').filter(f => f.endsWith('.js'));
for (const file of moduleFiles) {
	const module = require(`./modules/${file}`);
	if (module.init) module.init(client);
	client.modules.set(module.name, module);
	console.log(`Initialized module '${module.name}'...`);
}

// load all commands into the collection
const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// for every command alias
	command.names.forEach((name) => {
		if (client.commands.has(name)) {
			console.error(`Ignoring duplicate name: ${name}`);
		}
		else {
			client.commands.set(name, command);
		}
	});
}

// load all buttons into the collection
const buttonFiles = fs.readdirSync('./buttons').filter(f => f.endsWith('.js'));
for (const file of buttonFiles) {
	const button = require(`./buttons/${file}`);
	client.buttons.set(button.name, button);
}

// when the bot is initialized
client.once('ready', () => {
	const timeTotal = Math.floor(performance.now() - timeStart);
	console.log(`Bot initialized in ${timeTotal} ms!`);
	setRandomStatusLoop();
});

// load all event handlers and set them
const eventFiles = fs.readdirSync('./events').filter(f => f.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	client.on(event.name, event.handler);
}

// the "shutdown everything" function
client.shutdown = function() {
	// destroy each module
	client.modules.forEach(module => {
		if (module.destroy) module.destroy();
	});

	// destroy the client
	client.destroy();

	// exit the process
	process.exit(0);
}

// shutdown on SIGINT, SIGQUIT or SIGTERM
onDeath(client.shutdown);

// log in with the bot token
client.login(cfg.tokens.discord);

// endlessly randomize activity
function setRandomStatusLoop() {
	var game = cfg.status.games[Math.floor(Math.random() * cfg.status.games.length)];
	client.user.setActivity(game)
		.then(() => setTimeout(setRandomStatusLoop, cfg.status.interval))
		.catch(console.error);
}