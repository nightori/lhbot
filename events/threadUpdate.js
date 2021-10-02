export const name = 'threadUpdate';

export function handler(oldThread, newThread) {
	// automatically unarchive if it wasn't locked
	if (newThread.archived && !newThread.locked) {
		setTimeout(() => {
			newThread.setArchived(false, 'Автоматическая разархивация');
			console.log(`Unarchived thread: ${newThread.name}`);
		}, 1000);
	}
}
