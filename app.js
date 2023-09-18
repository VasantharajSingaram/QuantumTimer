let timerInterval;
let titleInterval;
let startTime;
let elapsedTime = 0;
let isRunning = false;
let serialNumber = 1;

function startTimer() {
    if (!isRunning) {
        document.title = "Timer Running";
        document.getElementById('favicon').href = "/Images/run.png";
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateTimer, 10);
        titleInterval = setInterval(toggleTitle, 2000);
        isRunning = true;
    }

    var playBtn = document.getElementById("play");
    var pauseBtn = document.getElementById("pause");
    var stopBtn = document.getElementById("stop");
    playBtn.classList.remove("animation");
    pauseBtn.classList.add("animation");
    stopBtn.classList.add("animation");
}

function toggleTitle() {
    if (document.title === "Timer Running") {
        document.title = "QT";
    } else {
        document.title = "Timer Running";
    }
}

function updateTimer() {
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;

    const hours = Math.floor(elapsedTime / 3600000).toString().padStart(2, '0');
    const minutes = Math.floor((elapsedTime % 3600000) / 60000).toString().padStart(2, '0');
    const seconds = Math.floor((elapsedTime % 60000) / 1000).toString().padStart(2, '0');
    const milliseconds = Math.floor(elapsedTime % 1000 / 10).toString().padStart(2, '0');

    document.getElementById('timer').textContent = `${hours}:${minutes}:${seconds}`;
    document.getElementById('microseconds').textContent = milliseconds;
}

function pauseTimer() {
    clearInterval(timerInterval);
    clearInterval(titleInterval);
    isRunning = false;
    document.title = "Timer Paused";
    document.getElementById('favicon').href = "/Images/24.png";

    var playBtn = document.getElementById("play");
    var pauseBtn = document.getElementById("pause");
    var stopBtn = document.getElementById("stop");
    playBtn.classList.add("animation");
    pauseBtn.classList.remove("animation");
    stopBtn.classList.add("animation");
}

function stopTimer() {
    clearInterval(timerInterval);
    clearInterval(titleInterval);
    isRunning = false;

    const projectName = document.getElementById('projectName').value;
    const projectDetails = document.getElementById('projectDetails').value;
    const hours = document.getElementById('timer').textContent.slice(0, 2);
    const minutes = document.getElementById('timer').textContent.slice(3, 5);

    var playBtn = document.getElementById("play");
    var pauseBtn = document.getElementById("pause");
    var stopBtn = document.getElementById("stop");
    playBtn.classList.add("animation");
    pauseBtn.classList.remove("animation");
    stopBtn.classList.remove("animation");

    const confirmed = confirm(
        `Project Name: ${projectName}\nProject Details: ${projectDetails}\nTime: ${hours}:${minutes}\n\nClick OK to stop or Cancel to resume.`
    );

    if (confirmed) {
        addToProjectTable(serialNumber, projectName, projectDetails, `${hours}:${minutes}`);
        serialNumber++;
        document.getElementById('favicon').href = "/Images/24.png";
    } else {
        startTimer(); // Resume timer
        document.getElementById('favicon').href = "/Images/stop.png";
    }

    elapsedTime = 0;
    document.getElementById('timer').textContent = '00:00:00';
    document.getElementById('microseconds').textContent = '00';
    document.getElementById('projectName').value = '';
    document.getElementById('projectDetails').value = '';

}

function addToProjectTable(serial, name, details, timings) {
    const tableBody = document.getElementById('projectTableBody');
    const row = document.createElement('tr');

    const serialCell = document.createElement('td');
    serialCell.textContent = serial;

    const nameCell = document.createElement('td');
    nameCell.textContent = name;

    const detailsCell = document.createElement('td');
    detailsCell.textContent = details;

    const timingsCell = document.createElement('td');
    timingsCell.textContent = timings;

    row.appendChild(serialCell);
    row.appendChild(nameCell);
    row.appendChild(detailsCell);
    row.appendChild(timingsCell);

    tableBody.appendChild(row);
}

function downloadTableData() {
    const table = document.querySelector('table');
    const rows = table.querySelectorAll('tr');

    let csvContent = "data:text/csv;charset=utf-8,";

    rows.forEach(row => {
        const cols = row.querySelectorAll('td,th');
        cols.forEach((col, index) => {
            csvContent += col.innerText;
            if (index < cols.length - 1) {
                csvContent += ",";
            }
        });
        csvContent += "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "table_data.csv");
    document.body.appendChild(link);
    link.click();
}