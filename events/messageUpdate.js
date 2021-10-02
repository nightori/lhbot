import { handler as messageCreate} from './messageCreate.js';

export const name = 'messageUpdate';

export function handler(oldMessage, newMessage) {
	// if the content changed
	if (oldMessage.content != newMessage.content) {
		// do the same things as on new message
		messageCreate(newMessage);
	}
}
