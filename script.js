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

// ✅ Oprava: Enter přidává poznámku, Shift+Enter dělá nový řádek
noteInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        addNote();
    }
});

// ✅ Oprava kopírování poznámek na iPhonech
function copyNotes() {
    const notesList = document.getElementById("notesList");
    const notes = Array.from(notesList.children).map(note => note.textContent).join("\n");
    const fullText = `Soubor: ${fileName}\n\nPoznámky:\n${notes}`;
    
    // Moderní metoda
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(fullText).then(() => {
            alert("Poznámky zkopírovány do schránky!");
        }).catch(() => {
            fallbackCopyText(fullText);
        });
    } else {
        fallbackCopyText(fullText);
    }
}

// ✅ Fallback metoda pro iPhony a starší prohlížeče
function fallbackCopyText(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    textArea.setSelectionRange(0, 99999);
    document.execCommand("copy");
    document.body.removeChild(textArea);
    alert("Poznámky zkopírovány do schránky! (fallback)");
}

// ✅ Oprava tlačítek na iPhonech
document.querySelectorAll("button").forEach(button => {
    button.addEventListener("touchstart", event => {
        event.preventDefault();
        button.click();
    }, { passive: false });
});
