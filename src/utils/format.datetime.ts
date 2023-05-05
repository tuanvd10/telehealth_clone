function formatTime(time: number | string | Date, format?: string) {
	const currentTime = new Date(time);
	switch (format) {
		case "DD-MM-YYYY HH:mm:ss":
			break;
		default:
			return currentTime.toISOString();
	}
}
export { formatTime };
