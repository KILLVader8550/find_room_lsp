// ===== CONFIG: CSV URL per floor =====
const floorCSV = {
  1: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQhppe7SUcQNiGeuIOVsYS9RowbaWt7wFfMZlzTtwgZeVbLRZjxLJaIdAIN_dIqVDtpZsPQ__GckWgv/pub?gid=440933642&single=true&output=csv",
  2: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQhppe7SUcQNiGeuIOVsYS9RowbaWt7wFfMZlzTtwgZeVbLRZjxLJaIdAIN_dIqVDtpZsPQ__GckWgv/pub?gid=958522716&single=true&output=csv",
  3: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQhppe7SUcQNiGeuIOVsYS9RowbaWt7wFfMZlzTtwgZeVbLRZjxLJaIdAIN_dIqVDtpZsPQ__GckWgv/pub?gid=958522716&single=true&output=csv",
  4: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQhppe7SUcQNiGeuIOVsYS9RowbaWt7wFfMZlzTtwgZeVbLRZjxLJaIdAIN_dIqVDtpZsPQ__GckWgv/pub?gid=1285050&single=true&output=csv"
};

document.addEventListener('DOMContentLoaded', () => {
	const container = document.querySelector('.container-1');
	const periodSelect = container.querySelector('#period');
	const daySelect = container.querySelector('#weekday');

	// Column ranges per day (first column is Room)
	const dayColumnRanges = {
		Monday: { start: 2, end: 10 },
		Tuesday: { start: 11, end: 18 },
		Wednesday: { start: 19, end: 26 },
		Thursday: { start: 27, end: 34 },
		Friday: { start: 35, end: 42 },
	};

	// Get floor CSV
	const floor = document.body.dataset.floor || "1";
	const GOOGLE_SHEET_CSV_URL = floorCSV[floor];

	// Determine current period
	function getCurrentPeriod() {
		const now = new Date();
		const h = now.getHours();
		const m = now.getMinutes();

		if ((h === 8 && m >= 35) || (h === 9 && m < 25)) return 1;
		if ((h === 9 && m >= 25) || (h === 10 && m < 10)) return 2;
		if ((h === 10 && m >= 30) || (h === 11 && m < 15)) return 3;
		if ((h === 11 && m >= 20) || (h === 12 && m < 5)) return 4;
		if ((h === 12 && m >= 10) || (h === 12 && m < 55)) return 5;
		if ((h === 13 && m >= 0) || (h === 13 && m < 45)) return 6;
		if ((h === 13 && m >= 50) || (h === 14 && m < 35)) return 7;
		if ((h === 14 && m >= 45) || (h === 15 && m < 30)) return 8;
		if ((h === 15 && m >= 35) || (h === 16 && m < 20)) return 9;
		return null;
	}

	// Determine current day
	function getCurrentDay() {
		const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		return days[new Date().getDay()];
	}

	// Map CSV headers to column for day/period
	function getColumnForDayPeriod(headers, day, period) {
		const range = dayColumnRanges[day];
		if (!range)
			return null;
		const colIndex = range.start + (period - 1) - 1; // zero-based
		return headers[colIndex];
	}

	// Update room statuses
	function updateRoomStatuses(selectedPeriod, selectedDay) {
	Papa.parse(GOOGLE_SHEET_CSV_URL, {
		download: true,
		header: true,
		complete: function(results) {
		const data = results.data;
		const headers = results.meta.fields;
		const targetColumn = getColumnForDayPeriod(headers, selectedDay, parseInt(selectedPeriod));

		if (!targetColumn) {
			console.error("❌ No column found for this day/period mapping");
			return;
		}

		data.forEach(row => {
			const roomId = row["Room"];
			if (!roomId)
				return;

			// Normalize: match your HTML ids
			const normalizedId = roomId.replace(/\s+/g, "-").replace(/\./g, "").replace(/\//g, "-");
			const roomDiv = document.getElementById(normalizedId);
			if (!roomDiv)
				return;

			const statusText = roomDiv.querySelector(".font-status");
			const status = row[targetColumn];

			if (status && status.toString().trim().toLowerCase() === "false") {
				statusText.textContent = "Not Available";
				statusText.style.color = "white";
			}
			else {
				statusText.textContent = "Available";
				statusText.style.color = "white";
			}
		});
		}
	});
	}

	// Map short day codes to full day names
	const dayMap = { mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday" };

	// Event listeners
	periodSelect.addEventListener('change', () => {
	updateRoomStatuses(periodSelect.value, dayMap[daySelect.value]);
	});

	daySelect.addEventListener('change', () => {
	updateRoomStatuses(periodSelect.value, dayMap[daySelect.value]);
	});



	function autoDetectPeriodAndUpdate() {
		let currentPeriod = getCurrentPeriod();
		const currentDay = getCurrentDay();

		// Create or select warning message element
		let warningMsg = document.getElementById("timeWarning");
		if (!warningMsg) {
			warningMsg = document.createElement("p");
			warningMsg.id = "timeWarning";
			warningMsg.style.color = "orange";
			warningMsg.style.fontWeight = "600";
			warningMsg.style.marginTop = "5px";
			document.querySelector(".period").appendChild(warningMsg);
		}

		if (!currentPeriod) {
			// Out-of-range time → default to period 1
			console.log("⚠️ Current time out of range, defaulting to period 1");
			currentPeriod = 1;
		} else {
			warningMsg.textContent = ""; // clear message if in schedule
		}

		if (currentDay in dayColumnRanges) {
			periodSelect.value = currentPeriod.toString();
			updateRoomStatuses(currentPeriod, currentDay);
		} else {
			console.log("❌ No valid day found");
		}
	}

	autoDetectPeriodAndUpdate();
	setInterval(autoDetectPeriodAndUpdate, 60000);

});
