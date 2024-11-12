function getPokemonCardHTML(data) {
  const mainType = data.types[0].type.name;
  return `
    <img src="${data.sprites.front_default}" alt="${data.name}">
    <h2>${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</h2>
    <p>#${data.id.toString().padStart(3, "0")}</p>
    <div class="type-color" style="background-color: ${typeColors[mainType]}">
      ${mainType}
    </div>
  `;
}

function getPopupHTML(data) {
  const mainType = data.types[0].type.name;
  return `
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
    <ul>${data.moves
      .slice(0, 4)
      .map((move) => `<li>${move.move.name}</li>`)
      .join("")}</ul>
  `;
}
