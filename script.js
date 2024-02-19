// Create a new Audio object to play songs
let currentSong = new Audio();
let currentName;
let currentTime;
let currentDuration;


// Function to fetch songs from the server
async function getSongs() {
    let a = await fetch('http://127.0.0.1:3000/songs/');
    let response = await a.text();

    // Create a temporary div element to parse the response
    let div = document.createElement("div");
    div.innerHTML = response;

    // Get all the anchor elements within the div
    let as = div.getElementsByTagName("a");
    let songs = {};

    // Iterate through the anchor elements and filter out the ones ending with .mp3
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith('.mp3')) {
            songs[element.innerHTML] = element.href;
        }
    }
    return songs;
}

// Function to play music
const playMusic = (url, name) => {
    currentSong.src = url;
    currentName = name;
    currentSong.play();
    play.src = "assets/svg/pause.svg";
    document.querySelector(".songinfo").innerHTML = name;
}

// Function to convert seconds to minutes format
function SecondstoMinutes(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

// Main function
async function main() {
    // Fetch songs from the server
    let songs = await getSongs();
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];

    // Iterate through the songs and add them to the song list
    for (const key in songs) {
        let value = songs[key]

        songUL.innerHTML = songUL.innerHTML + `
        <li>
            <img src="assets/svg/music.svg" alt="">
                <div id="222">
                    <div id = "name">${key}</div>
                    <div>Atul Verma</div>
                </div>
            <img id= "ox" src="assets/svg/play.svg" alt="">
            <a href = "${value}"></a>
        </li>`;
    }

    // Add click event listeners to each song in the song list
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            let a = e.getElementsByTagName("a")[0];
            let url = a.href;
            let name = e.querySelector("#name").innerHTML;
            playMusic(url, name);
        })
    });

    // Music Play Pause Control
    var keys = Object.keys(songs);
    var key = keys[0];
    let value = songs[key];

    // Add click event listener to the play button
    play.addEventListener("click", () => {
        if (currentSong.src.length < 1) {
            playMusic(value, key);
        } else {
            if (currentSong.paused) {
                currentSong.play();
                play.src = "assets/svg/pause.svg";
            } else {
                currentSong.pause();
                play.src = "assets/svg/play.svg";
            }
        }
    })

    // Add click event listener to the previous button
    previous.addEventListener("click", () => {
        let index = keys.indexOf(currentName)
        let preName = keys[index - 1]
        let preSong = songs[preName]
        if (index == 0 || index == -1) {
            playMusic(value, key);
        } else {
            playMusic(preSong, preName)
        }
    })

    // Add click event listener to the next button
    next.addEventListener("click", () => {
        let index = keys.indexOf(currentName)
        let preName = keys[index + 1]
        let preSong = songs[preName]
        if (index == -1) {
            playMusic(value, key);
        } else {
            playMusic(preSong, preName)
        }
    })

    // Update the current time and duration of the song
    currentSong.addEventListener("timeupdate", () => {
        currentDuration = currentSong.duration;
        currentTime = currentSong.currentTime
        document.querySelector(".songtime").innerHTML = `${SecondstoMinutes(currentTime)}/${SecondstoMinutes(currentDuration)}`;

        let circlePosition = (currentTime / currentDuration) * 100

        let bar = document.querySelector(".circle");
        bar.style.left = `${circlePosition}%`;
    })

    // Add controls to seekbar to skip the song
    document.querySelector('.seekbar').addEventListener("change", e => {
        if (isNaN(currentSong.duration)) {
            playMusic(value, key);

            


        }else{

            
            let width = e.target.getBoundingClientRect().width;
            let click = e.offsetX;
            let Time = ((click / width) * currentSong.duration);
            currentSong.currentTime = Time;
        }
            
    })

}

// Call the main function
main();