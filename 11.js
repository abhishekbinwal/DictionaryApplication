const btn = document.getElementById("button");
const input = document.getElementById("input");
const result = document.getElementById("result-box");
const audio = document.getElementById("audio");

btn.addEventListener("click", fetchMeaning);

// Trigger on Enter key press
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    fetchMeaning();
  }
});

async function fetchMeaning() {
  const word = input.value.trim();
  if (!word) {
    result.innerHTML = "<p>Please enter a word.</p>";
    audio.style.display = "none";
    return;
  }

  result.innerHTML = "<p>Searching...</p>";
  audio.style.display = "none";

  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    const data = await res.json();

    if (data.title === "No Definitions Found") {
      result.innerHTML = `<p>No definition found for <strong>${word}</strong>.</p>`;
    } else {
      const meaning = data[0].meanings[0];
      const definition = meaning.definitions[0].definition;
      const partOfSpeech = meaning.partOfSpeech;

      result.innerHTML = `
        <h2>${word}</h2>
        <p><em>${partOfSpeech}</em></p>
        <p>${definition}</p>
      `;
    }

    const phonetics = data[0].phonetics;
    const audioObj = phonetics.find((p) => p.audio); // find first with audio
    if (audioObj && audioObj.audio) {
      audio.src = audioObj.audio;
      audio.style.display = "block";
      audio.controls = true;
      audio.load();
    } else {
      audio.style.display = "none";
    }
  } catch (error) {
    result.innerHTML = "<p>Error fetching definition. Try again later.</p>";
    console.error(error);
  }
}
