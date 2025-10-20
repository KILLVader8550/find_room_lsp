function updateClock() {
	const now = new Date();

	// Format time
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	document.getElementById('clock').textContent = `${hours}:${minutes}`;

	// Format date
	const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const months = ['January', 'February', 'March', 'April', 'May', 'June',
					'July', 'August', 'September', 'October', 'November', 'December'];

	const dayName = days[now.getDay()];
	const dateNum = now.getDate();
	const monthName = months[now.getMonth()];

	document.getElementById('date').textContent = `${dayName} ${dateNum} ${monthName}`;
}

setInterval(updateClock, 1000);
updateClock();
