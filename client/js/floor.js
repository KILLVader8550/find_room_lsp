document.addEventListener('DOMContentLoaded', () => {
    const floorContainer = document.getElementById('floorContainer');
    const buttons = document.querySelectorAll('.page-number');

    // ฟังก์ชันโหลดเนื้อหา
    function loadFloor(floorNum) {
        fetch(`public/floor-${floorNum}.html`) //find the path
        .then(response => response.text())
        .then(html => {
            floorContainer.innerHTML = html;
        })
        .catch(error => {
            floorContainer.innerHTML = `<p style="color:red;">Error loading floor ${floorNum}</p>`;
            console.error('Error:', error);
        });
    }

    loadFloor(1);

    buttons.forEach(button => {
        button.addEventListener('click', e => {
        e.preventDefault();
        const floor = button.getAttribute('data-floor');
        loadFloor(floor);
        });
    });
});
