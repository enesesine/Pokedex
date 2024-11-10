const typeColors = {
  fire: "var(--fire)",
  water: "var(--water)",
  grass: "var(--grass)",
  electric: "var(--electric)",
  ice: "var(--ice)",
  fighting: "var(--fighting)",
  poison: "var(--poison)",
  ground: "var(--ground)",
  flying: "var(--flying)",
  psychic: "var(--psychic)",
  bug: "var(--bug)",
  rock: "var(--rock)",
  ghost: "var(--ghost)",
  dragon: "var(--dragon)",
  dark: "var(--dark)",
  steel: "var(--steel)",
  fairy: "var(--fairy)",
  normal: "var(--normal)",
};

let allPokemonData = [];
let currentPokemonIndex = 0;

async function loadPokemon() {
  const pokemonGrid = document.getElementById("pokemonGrid");

  for (let i = 1; i <= 150; i++) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
    const data = await response.json();

    allPokemonData.push(data);

    const pokemonCard = document.createElement("div");
    pokemonCard.classList.add("pokemon-card");
    pokemonCard.dataset.name = data.name.toLowerCase();

    const mainType = data.types[0].type.name;

    if (mainType === "normal") {
      pokemonCard.classList.add("normal");
    }

    pokemonCard.style.border = `2px solid ${typeColors[mainType]}`;

    pokemonCard.innerHTML = `
      <img src="${data.sprites.front_default}" alt="${data.name}">
      <h2>${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</h2>
      <p>#${data.id.toString().padStart(3, "0")}</p>
      <div class="type-color" style="background-color: ${
        typeColors[mainType]
      }">${mainType}</div>
    `;

    pokemonCard.onclick = () => showPopup(data);

    pokemonGrid.appendChild(pokemonCard);
  }
}

async function showPopup(data) {
  const popup = document.getElementById("popup");
  currentPokemonIndex = allPokemonData.findIndex(
    (pokemon) => pokemon.id === data.id
  );

  updatePopupContent(data);
  popup.style.display = "flex";
}

function updatePopupContent(data) {
  const popupInfo = document.getElementById("popupInfo");

  const mainType = data.types[0].type.name;
  popupInfo.innerHTML = `
    <img src="${data.sprites.front_default}" alt="${data.name}">
    <h2>${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</h2>
    <p><span class="type-color" style="background-color: ${
      typeColors[mainType]
    }">${mainType}</span></p>
    <p>🌈 <strong>Typ:</strong> ${data.types
      .map((type) => type.type.name)
      .join(", ")}</p>
    <p>📏 <strong>Höhe:</strong> ${data.height / 10} m</p>
    <p>⚖️ <strong>Gewicht:</strong> ${data.weight / 10} kg</p>
    <p>💥 <strong>Attacken:</strong></p>
    <ul>
      ${data.moves
        .slice(0, 4)
        .map((move) => `<li>${move.move.name}</li>`)
        .join("")}
    </ul>
  `;
}

function navigatePokemon(direction) {
  currentPokemonIndex += direction;
  if (currentPokemonIndex < 0) {
    currentPokemonIndex = allPokemonData.length - 1;
  } else if (currentPokemonIndex >= allPokemonData.length) {
    currentPokemonIndex = 0;
  }
  showPopup(allPokemonData[currentPokemonIndex]);
}

function closePopup(event) {
  if (
    event.target.id === "popup" ||
    event.target.classList.contains("close-btn")
  ) {
    document.getElementById("popup").style.display = "none";
  }
}

function searchPokemon() {
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const pokemonCards = document.querySelectorAll(".pokemon-card");

  pokemonCards.forEach((card) => {
    const name = card.dataset.name;
    card.style.display = name.includes(searchInput) ? "block" : "none";
  });
}

window.onload = loadPokemon;
