module.exports = {
	name: 'messageDelete',
	handler(message) {
		// don't log deleted messages in DM
		if (message.channel.type == 'dm') return;

		// get the full username
		const username = `${message.author.username}#${message.author.discriminator}`;

		// create a record to be logged
		let record = `${username} deleted message in #${message.channel.name}`;
		if (message.content) {
			// escape new lines
			const content = message.content.replace(/\n/g, '\\n');
			record += `, text: "${content}"`;
		}

		console.log(record);
		return;

		///////////////////////////////////////////////////////////////////////////////////

		const BLANK = String.fromCharCode(7356);

		// get the bot as a member object and its nickname
		const member = message.guild.members.cache.get(this.user.id);
		const nickname = member.nickname;

		// if a nickname is set
		if (nickname) {
			// add an empty character to the nickname, then restore the old one
			member.setNickname(nickname + BLANK, record)
				.then(() => member.setNickname(nickname))
				.catch(e => console.log);
		}
		// if it isn't
		else {
			// set the nickname to be the same as username, then delete it
			member.setNickname(member.user.username + BLANK, record)
				.then(() => member.setNickname(''))
				.catch(e => console.log);
		}
		// the purpose of the code above to make an unnoticable action
		// only to create an entry in the audit log with the record set as "reason"
	}
};