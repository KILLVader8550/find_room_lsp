document.addEventListener('DOMContentLoaded', () => {
	const floorContainer = document.getElementById('floorContainer');
	const buttons = document.querySelectorAll('.page-number');

	function loadFloor(floorNum) {
	fetch(`../public/floor${floorNum}.html`)
		.then(response => response.text())
		.then(html => {
		floorContainer.innerHTML = html;

		// Initialize room status for newly loaded content
		if (typeof initRoomStatus === "function") {
			initRoomStatus(floorContainer);
		}
		})
		.catch(error => {
			floorContainer.innerHTML = `<p style="color:red;">Error loading floor ${floorNum}</p>`;
			console.error('Error:', error);
		});
	}

	// Load default floor
	loadFloor(1);
	buttons[0].classList.add('active'); // Highlight default floor

	// Add click events to floor buttons
	buttons.forEach(button => {
	button.addEventListener('click', e => {
		e.preventDefault();
		const floor = button.getAttribute('data-floor');
		loadFloor(floor);

		// Highlight active floor
		buttons.forEach(btn => btn.classList.remove('active'));
		button.classList.add('active');
	});
	});
});
