const audioPlayer = document.getElementById("audioPlayer");
const fileTitleDisplay = document.getElementById("fileTitleDisplay");
const noteInput = document.getElementById("noteInput");

const urlParams = new URLSearchParams(window.location.search);
const mp3Url = urlParams.get("mp3");
let fileName = "";
if (mp3Url) {
    audioPlayer.src = mp3Url;
    fileName = decodeURIComponent(mp3Url.split("/").pop().split("?")[0]);
    fileTitleDisplay.textContent = fileName;
}

function skipTime(seconds) {
    audioPlayer.currentTime += seconds;
}

function setPlaybackRate(rate) {
    audioPlayer.playbackRate = rate;
}

function togglePlayPause() {
    if (audioPlayer.paused) {
        audioPlayer.play();
    } else {
        audioPlayer.pause();
    }
}

function addNote() {
    if (noteInput.value.trim() !== "") {
        const time = new Date(audioPlayer.currentTime * 1000).toISOString().substr(11, 8);
        const note = document.createElement("li");
        note.textContent = `[${time}] ${noteInput.value}`;
        document.getElementById("notesList").appendChild(note);
        noteInput.value = "";
        navigator.vibrate(50);
    }
}

// ✅ Enter na iPhonech přidává poznámku správně
noteInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        addNote();
    }
});

// ✅ 100% funkční kopírování na iPhonech
function copyNotes() {
    const notesList = document.getElementById("notesList");
    const notes = Array.from(notesList.children).map(note => note.textContent).join("\n");
    const fullText = `Soubor: ${fileName}\n\nPoznámky:\n${notes}`;

    const textArea = document.createElement("textarea");
    textArea.value = fullText;
    document.body.appendChild(textArea);
    textArea.select();
    textArea.setSelectionRange(0, 99999); // Pro jistotu na mobilních zařízeních
    document.execCommand("copy");
    document.body.removeChild(textArea);

    alert("Zkopírováno!");
}

// ✅ Odesílání poznámek e-mailem přes EmailJS
async function sendNotesByEmail() {
    const notesList = document.getElementById("notesList");
    const notes = Array.from(notesList.children).map(note => note.textContent).join("\n");
    const fullText = `Soubor: ${fileName}\n\nPoznámky:\n${notes}`;

    try {
        await fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                service_id: "service_1zb4g73",
                template_id: "template_9ktlbtl",
                user_id: "PSTcucLXaEZGT6jCs",
                template_params: {
                    recipient: "martin.juza@krutart.cz",
                    message: fullText,
                },
            }),
        });
        alert("Poznámky odeslány e-mailem!");
    } catch (error) {
        alert("Chyba při odesílání e-mailu.");
        console.error("Email error:", error);
    }
}

// ✅ Oprava tlačítek na iPhonech
document.querySelectorAll("button").forEach(button => {
    button.addEventListener("touchstart", event => {
        event.preventDefault();
        button.click();
    }, { passive: false });
});
