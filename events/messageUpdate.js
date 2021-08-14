const onMessage = require('./message.js');

module.exports = {
	name: 'messageUpdate',
	handler(oldMessage, newMessage) {
		// if the content changed
		if (oldMessage.content != newMessage.content) {
			// do the same things as on new message
			onMessage.handler(newMessage);
		}
	}
};