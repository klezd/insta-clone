export function getTimeAgo(date) {
	const seconds = Math.floor((new Date() - date) / 1000);

	const minuteInterval = seconds / 60;
	const hourInterval = seconds / (60 * 60);
	const dayInterval = seconds / (60 * 60 * 24);
	if (minuteInterval <= 1) {
		return Math.floor(minuteInterval) + ' seconds ago';
	} else if (minuteInterval > 1) {
		return Math.floor(minuteInterval) + ' minutes ago';
	} else if (hourInterval > 1) {
		return Math.floor(hourInterval) + ' hours ago';
	} else if (dayInterval > 1 && dayInterval <= 7) {
		return Math.floor(dayInterval) + ' days ago';
	} else {
		return 'More than 1 week ago';
	}
}

// var aDay = 24 * 60 * 60 * 1000;
// console.log(timeSince(new Date(Date.now() - aDay)));
