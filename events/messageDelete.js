export const name = 'messageDelete';

export function handler(message) {
	// don't log deleted messages in DM
	if (message.channel.type == 'DM')
		return;

	// get the full username
	const username = `${message.author.username}#${message.author.discriminator}`;

	// create a record to be logged
	let record = `Deleted message by ${username} in #${message.channel.name}`;
	if (message.content) {
		// escape new lines
		const content = message.content.replace(/\n/g, '\\n');
		record += `, text: "${content}"`;
	}

	console.log(record);
	return;
}
