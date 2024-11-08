// Mapping von Pokémon-Typen zu Farben
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

let allPokemonData = []; // Speichert alle geladenen Pokémon-Daten
let currentPokemonIndex = 0; // Index des aktuell angezeigten Pokémon

// Funktion zum Laden der Pokémon-Karten
async function loadPokemon() {
  const pokemonGrid = document.getElementById("pokemonGrid");

  for (let i = 1; i <= 150; i++) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
    const data = await response.json();

    // Pokémon-Daten zur Liste hinzufügen
    allPokemonData.push(data);

    // Erstelle eine Pokémon-Karte für jedes Pokémon
    const pokemonCard = document.createElement("div");
    pokemonCard.classList.add("pokemon-card");
    pokemonCard.dataset.name = data.name.toLowerCase();

    // Bestimme den Haupttyp
    const mainType = data.types[0].type.name;

    // Wenn der Typ "normal" ist, füge die 'normal' Klasse hinzu
    if (mainType === "normal") {
      pokemonCard.classList.add("normal");
    }

    // Setze die Typ-Farbe für die Karte
    pokemonCard.style.border = `2px solid ${typeColors[mainType]}`;

    pokemonCard.innerHTML = `
      <img src="${data.sprites.front_default}" alt="${data.name}">
      <h2>${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</h2>
      <p>#${data.id.toString().padStart(3, "0")}</p>
      <div class="type-color" style="background-color: ${
        typeColors[mainType]
      }">${mainType}</div>
    `;

    // Beim Klick öffnet sich das Pop-up mit weiteren Details
    pokemonCard.onclick = () => showPopup(data);

    pokemonGrid.appendChild(pokemonCard);
  }
}

// Funktion zum Anzeigen des Pop-ups mit Pokémon-Daten
async function showPopup(data) {
  const popup = document.getElementById("popup");
  currentPokemonIndex = allPokemonData.findIndex(
    (pokemon) => pokemon.id === data.id
  );

  // Hole zusätzliche Daten zur Evolutionskette und aktualisiere den Pop-up-Inhalt
  const speciesResponse = await fetch(data.species.url);
  const speciesData = await speciesResponse.json();

  if (speciesData.evolution_chain) {
    const evolutionChainResponse = await fetch(speciesData.evolution_chain.url);
    const evolutionChainData = await evolutionChainResponse.json();
    const evolutionChain = getEvolutionChain(evolutionChainData.chain);
    data.evolutionChain = evolutionChain;
  }

  updatePopupContent(data);
  popup.style.display = "flex";
}

// Extrahiert die Evolutionskette als Array von Pokémon-Namen
function getEvolutionChain(chain) {
  const evolutionChain = [];
  let currentStage = chain;

  while (currentStage) {
    evolutionChain.push(currentStage.species.name);
    currentStage = currentStage.evolves_to[0];
  }

  return evolutionChain;
}

// Aktualisiere den Inhalt des Pop-ups basierend auf den Pokémon-Daten
function updatePopupContent(data) {
  const popupInfo = document.getElementById("popupInfo");

  const mainType = data.types[0].type.name;
  popupInfo.innerHTML = `
    <img src="${data.sprites.front_default}" alt="${data.name}">
    <h2>${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</h2>
    <p><span class="type-color" style="background-color: ${
      typeColors[mainType]
    }">${mainType}</span></p>
    <p><strong>Typ:</strong> ${data.types
      .map((type) => type.type.name)
      .join(", ")}</p>
    <p><strong>Höhe:</strong> ${data.height / 10} m</p>
    <p><strong>Gewicht:</strong> ${data.weight / 10} kg</p>
    <p><strong>Attacken:</strong></p>
    <ul>
      ${data.moves
        .slice(0, 5)
        .map((move) => `<li>${move.move.name}</li>`)
        .join("")}
    </ul>
    ${
      data.evolutionChain
        ? `<p><strong>Evolution:</strong></p>
    <ul>
      ${data.evolutionChain
        .map(
          (evolution) =>
            `<li>${evolution.charAt(0).toUpperCase() + evolution.slice(1)}</li>`
        )
        .join("")}
    </ul>`
        : ""
    }
  `;
}

// Navigation zu vorherigem oder nächstem Pokémon
function navigatePokemon(direction) {
  currentPokemonIndex += direction;
  if (currentPokemonIndex < 0) {
    currentPokemonIndex = allPokemonData.length - 1;
  } else if (currentPokemonIndex >= allPokemonData.length) {
    currentPokemonIndex = 0;
  }
  showPopup(allPokemonData[currentPokemonIndex]);
}

// Pop-up schließen
function closePopup(event) {
  if (
    event.target.id === "popup" ||
    event.target.classList.contains("close-btn")
  ) {
    document.getElementById("popup").style.display = "none";
  }
}

// Suchfunktion
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

// Lade die Pokémon-Karten, wenn die Seite geladen ist
window.onload = loadPokemon;
