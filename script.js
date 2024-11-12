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
let pokemonLimit = 30;

async function loadPokemon() {
  const pokemonGrid = document.getElementById("pokemonGrid");
  for (let i = currentPokemonIndex + 1; i <= pokemonLimit; i++) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
    const data = await response.json();

    allPokemonData.push(data);
    pokemonGrid.appendChild(createPokemonCard(data));
  }
  currentPokemonIndex = pokemonLimit;
  pokemonLimit += 30;
  if (pokemonLimit > 150) {
    document.getElementById("loadMoreBtn").style.display = "none";
  }
}

function loadMorePokemon() {
  loadPokemon();
}

function createPokemonCard(data) {
  const pokemonCard = document.createElement("div");
  pokemonCard.classList.add("pokemon-card");
  pokemonCard.dataset.name = data.name.toLowerCase();

  const mainType = data.types[0].type.name;
  if (mainType === "normal") {
    pokemonCard.classList.add("normal");
  }
  pokemonCard.style.border = `2px solid ${typeColors[mainType]}`;
  pokemonCard.innerHTML = getPokemonCardHTML(data);
  pokemonCard.onclick = () => showPopup(data);

  return pokemonCard;
}

function showPopup(data) {
  const popup = document.getElementById("popup");
  currentPokemonIndex = allPokemonData.findIndex(
    (pokemon) => pokemon.id === data.id
  );
  updatePopupContent(data);
  popup.style.display = "flex";
}

function updatePopupContent(data) {
  document.getElementById("popupInfo").innerHTML = getPopupHTML(data);
}

function navigatePokemon(direction) {
  currentPokemonIndex =
    (currentPokemonIndex + direction + allPokemonData.length) %
    allPokemonData.length;
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
