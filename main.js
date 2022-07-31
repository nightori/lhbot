import { readdirSync } from 'fs';
import { Client, Intents, Collection } from 'discord.js';
import { performance } from 'perf_hooks';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import onDeath from 'death';
import cfg from './config.js';

await import('./extensions.js');

const timeStart = performance.now();

// initialize the client with intents
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_INTEGRATIONS,
		Intents.FLAGS.DIRECT_MESSAGES
	],
	partials: ['CHANNEL']
});

// initialize client parameters
client.modules = new Collection();
client.commands = new Collection();
client.buttons = new Collection();
client.nicknameMap = new Map();
client.welcomerEnabled = true;
client.appDir = dirname(fileURLToPath(import.meta.url));
client.emojiMap = {
	'a': '🇦', 'b': '🇧', 'c': '🇨', 'd': '🇩', 'e': '🇪', 'f': '🇫', 'g': '🇬', 'h': '🇭', 'i': '🇮',
	'j': '🇯', 'k': '🇰', 'l': '🇱', 'm': '🇲', 'n': '🇳', 'o': '🇴', 'p': '🇵', 'q': '🇶', 'r': '🇷',
	's': '🇸', 't': '🇹', 'u': '🇺', 'v': '🇻', 'w': '🇼', 'x': '🇽', 'y': '🇾', 'z': '🇿', '0': '0️⃣',
	'1': '1️⃣', '2': '2️⃣', '3': '3️⃣', '4': '4️⃣', '5': '5️⃣', '6': '6️⃣', '7': '7️⃣', '8': '8️⃣',
	'9': '9️⃣', '10': '🔟', '#': '#️⃣', '*': '*️⃣', '!': '❗', '?': '❓'
};

// load all modules into the collection and initialize them
const moduleFiles = readdirSync('./modules').filter(f => f.endsWith('.js'));
for (const file of moduleFiles) {
	const module = await import(`./modules/${file}`);
	if (module.init) module.init(client);
	client.modules.set(module.name, module);
	console.log(`Initialized module '${module.name}'...`);
}

// load all commands into the collection
const commandFiles = readdirSync('./commands').filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
	const command = await import(`./commands/${file}`);

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

// load all event handlers and set them
const eventFiles = readdirSync('./events').filter(f => f.endsWith('.js'));
for (const file of eventFiles) {
	const event = await import(`./events/${file}`);
	client.on(event.name, event.handler);
}

// load all buttons into the collection
const buttonFiles = readdirSync('./buttons').filter(f => f.endsWith('.js'));
for (const file of buttonFiles) {
	const button = await import(`./buttons/${file}`);
	client.buttons.set(button.name, button);
}

// when the bot is initialized
client.once('ready', () => {
	const timeTotal = Math.floor(performance.now() - timeStart);
	console.log(`Bot initialized in ${timeTotal} ms!`);
	setRandomStatusLoop();
});

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
	const game = cfg.status.games[Math.floor(Math.random() * cfg.status.games.length)];
	client.user.setActivity(game);
	setTimeout(setRandomStatusLoop, cfg.status.interval);
}
