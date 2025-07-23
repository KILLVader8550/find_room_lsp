const timeSlots = ["08:35", "09:25", "10:30", "11:20", "12:10", "13:00", "13:50", "14:45", "15:35"];

const roomStatusData = {
    "Library 101": {
        "08:35": "Available",
        "09:25": "Unavailable",
        "10:30": "Available"
    },
    "101": {
        "08:35": "Unavailable",
        "09:25": "Available"
    },
    "102": {
        "08:35": "Available",
        "09:25": "Available"
    },
    "103": {
        "08:35": "Unavailable",
        "13:50": "Available"
    }
    // เพิ่มห้องอื่น ๆ ตามต้องการ
};

function getCurrentSlot() {
    const now = new Date();
    const current = now.getHours() * 60 + now.getMinutes();
    let currentSlot = null;
    for (let i = timeSlots.length - 1; i >= 0; i--) {
        const [h, m] = timeSlots[i].split(":").map(Number);
        if (current >= h * 60 + m) {
            currentSlot = timeSlots[i];
            break;
        }
    }
    return currentSlot;
}

function updateRoomStatuses() {
    const currentSlot = getCurrentSlot();
    if (!currentSlot) return;

    const container = document.querySelector(".scrollview");
    const rooms = Array.from(container.querySelectorAll(".room"));

    rooms.forEach(room => {
        const roomName = room.querySelector("p").textContent.trim();
        const statusText = roomStatusData[roomName]?.[currentSlot] || "Unavailable";

        const statusBox = room.querySelector(".status");
        const statusLabel = room.querySelector(".font-status");

        // ตั้งข้อความสถานะ
        statusLabel.textContent = statusText;

        // ลบคลาสเก่าออก แล้วเพิ่มใหม่
        statusBox.classList.remove("available", "unavailable");
        statusBox.classList.add(statusText.toLowerCase());
    });

    rooms.sort((a, b) => {
        const statusA = a.querySelector(".font-status").textContent.trim().toLowerCase();
        const statusB = b.querySelector(".font-status").textContent.trim().toLowerCase();

        if (statusA === statusB) return 0;
        if (statusA === "available") return -1;
        if (statusB === "available") return 1;
        return 0;
    });

    rooms.forEach(room => container.appendChild(room));
}


window.onload = updateRoomStatuses;
setInterval(updateRoomStatuses, 60 * 1000);
