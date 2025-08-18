document.addEventListener("DOMContentLoaded", () => {
    const daySelect = document.getElementById("weekday");
    const periodSelect = document.getElementById("period");
    const btn = document.getElementById("search");
    const refreshBtn = document.getElementById("refreshBtn");

    const day = daySelect.value;
    const period = periodSelect.value;
    
    const fetchAndUpdate = async (e) => {
        const url = `/api/rooms?day=${encodeURIComponent(day)}&period=${encodeURIComponent(period)}`;

        try{
            const res = await fetch(url);
            if(!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            updateRoomStatuses(data.list || []);
        }
        catch(err){
            console.error(err);
        }
    };

    btn?.addEventListener("click", (e) => {
        e.preventDefault();
        fetchAndUpdate(day, period);
    })

    refreshBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        fetchAndUpdate(day, period);
    });

    fetchAndUpdate(day,  period);
})

function updateRoomStatuses(listrooms = []) {
    const container = document.querySelector(".scrollview");
    if(!container) return;

    const esc = (s) => (window.CSS && CSS.escape ? CSS.escape(s) : String(s).replace(/[^\w-]/g, "\\$&"));

    listrooms.forEach(room => {
        const roomID = String(room.RoodID || "").trim()
        const status = String(room.status || "").trim();
        if(!roomID || !status) return;

        const cell = container.querySelector(`#${esc(roomID)}`);
        if(!cell) return;

        const statusBox = cell.querySelector(".status");
        const statusLabel = cell.querySelector(".font-status");
        if(!statusBox || !statusLabel) return;

        // ตั้งข้อความสถานะ
        statusLabel.textContent = status;
        // ลบคลาสเก่าออก แล้วเพิ่มใหม่
        statusBox.classList.remove("available", "unavailable");
        statusBox.classList.add(status.toLowerCase() === "available" ? "available" : "unavailable");
    });

    const table = Array.from(container.querySelectorAll(".room"));
    table.sort((a, b) => {
        const statusA = a.querySelector(".font-status").textContent.trim().toLowerCase();
        const statusB = b.querySelector(".font-status").textContent.trim().toLowerCase();

        if (statusA === statusB) return 0;
        if (statusA === "available") return -1;
        if (statusB === "available") return 1;
        return 0;
    });

    table.forEach(room => container.appendChild(room));
}