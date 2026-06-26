const API_URL = "https://script.google.com/macros/s/AKfycbxcjKsMZAst4_21tJIJ1jeyqyl_pwPBJ0cVX1FFkVcRDhFvJ5TcJT2himxNkwd8GcWU/exec";

const trackerDate = document.getElementById("trackerDate");
const progressFill = document.querySelector(".progress-fill");
const progressText = document.querySelector(".progress-text");

const wakeUp = document.getElementById("wakeUp");
const water = document.getElementById("water");
const gym = document.getElementById("gym");
const hairWash = document.getElementById("hairWash");
const minoxidilAM = document.getElementById("minoxidilAM");
const minoxidilPM = document.getElementById("minoxidilPM");
const medicineAM = document.getElementById("medicineAM");
const medicinePM = document.getElementById("medicinePM");

const saveBtn = document.getElementById("saveBtn");

const checkboxes = document.querySelectorAll('input[type="checkbox"]');

trackerDate.value = new Date().toISOString().split("T")[0];

function updateProgress() {

    const visible = [...checkboxes].filter(cb =>
        cb.parentElement.parentElement.style.display !== "none"
    );

    const completed = visible.filter(cb => cb.checked).length;

    const total = visible.length;

    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    progressFill.style.width = percent + "%";

    progressText.textContent = `${completed} / ${total} Completed (${percent}%)`;
}

function updateHairWash() {

    const day = new Date(trackerDate.value).getDay();

    if (day === 1 || day === 3 || day === 5) {

        hairWash.parentElement.parentElement.style.display = "block";

    } else {

        hairWash.checked = false;
        hairWash.parentElement.parentElement.style.display = "none";

    }

    updateProgress();
}

async function loadData() {

    updateHairWash();

    const response = await fetch(API_URL + "?date=" + trackerDate.value);

    const data = await response.json();

    checkboxes.forEach(cb => cb.checked = false);

    if (data.found) {

        wakeUp.checked = data.wakeUp;
        water.checked = data.water;
        gym.checked = data.gym;
        hairWash.checked = data.hairWash;
        minoxidilAM.checked = data.minoxidilAM;
        minoxidilPM.checked = data.minoxidilPM;
        medicineAM.checked = data.medicineAM;
        medicinePM.checked = data.medicinePM;
    }

    updateProgress();
}

async function saveData() {

    saveBtn.disabled = true;
    saveBtn.innerText = "Saving...";

    const payload = {

        date: trackerDate.value,

        wakeUp: wakeUp.checked,
        water: water.checked,
        gym: gym.checked,
        hairWash: hairWash.checked,
        minoxidilAM: minoxidilAM.checked,
        minoxidilPM: minoxidilPM.checked,
        medicineAM: medicineAM.checked,
        medicinePM: medicinePM.checked

    };

    await fetch(API_URL, {

        method: "POST",

        body: JSON.stringify(payload)

    });

    saveBtn.innerText = "✅ Saved";

    setTimeout(() => {

        saveBtn.innerHTML = "💾 Save Progress";
        saveBtn.disabled = false;

    }, 1500);

}

checkboxes.forEach(cb =>
    cb.addEventListener("change", updateProgress)
);

trackerDate.addEventListener("change", loadData);

saveBtn.addEventListener("click", saveData);

loadData();