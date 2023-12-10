const pokedex = document.getElementById("pokedex");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const searchTypeInput = document.getElementById("searchType-input");
const searchTypeButton = document.getElementById("searchType-button");
const sortAlpha = document.querySelector(".sort-alpha");
const sortZeta = document.querySelector(".sort-zeta");

let pokemonData = [];

const fetchPokemon = () => {
  const promises = [];
  for (let i = 1; i <= 30; i++) {
    const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    promises.push(fetch(url).then((res) => res.json()));
  }
  Promise.all(promises).then((results) => {
    pokemonData = results.map((result) => ({
      name: result.name,
      image: result.sprites["front_default"],
      type: result.types.map((type) => type.type.name).join(" · "),
      id: result.id,
    }));
    displayPokemon(pokemonData);
    console.log(pokemonData);

  });
};

function createListElement(pokemon) {
  return pokemon
    .map((pokemon) => {
      const pokemonList = `
        <li class="card">
            <div class="star-toggle star ">☆</div>
            <img class="card-image " src="${pokemon.image}"/>
            <p class="card-id ">#${pokemon.id}</p>
            <h2 class="card-title ">${pokemon.name}</h2>
            <p class="card-subtitle ">${pokemon.type}</p>
        </li>
    `;
      return pokemonList;
    })
    .join("");
}

const displayPokemon = (pokemon) => {
  pokedex.innerHTML = createListElement(pokemon); // After creating all the li elements of the pokemon, fill them inside the ul 'pokedex'
  const pokemonCards = document.querySelectorAll(".card"); // Get all the pokemon cards

  pokemonCards.forEach((pokemon, index) => {
    const title = pokemon.querySelector(".card-title");
    const image = pokemon.querySelector(".card-image");
    const sub = pokemon.querySelector(".card-subtitle");
    const star = pokemon.querySelector(".star");

    const temp = pokemon;
    pokemon.addEventListener("click", () => {
      if (!pokemon.classList.contains("active")) {
        image.classList.toggle("card-imageRevealed");
        title.classList.toggle("card-titleRevealed");
        sub.classList.toggle("card-subRevealed");
        star.classList.toggle("star-toggle");
        pokemon.classList.add("active");
      }
    });

    star.addEventListener("click", () => {
      if (star.innerHTML === "☆") {
        star.innerHTML = "⭐";
      } else {
        star.innerHTML = "☆";
      }
    });
  });
};



const searchPokemon = (event) => {
  event.preventDefault();
  const searchTerm = searchInput.value.toLowerCase();

  if (searchTerm === "") {
    pokemonData.sort(sortNumerical);
  } else {
    const filteredPokemon = pokemonData.filter((pokemon) =>
      pokemon.name.includes(searchTerm)
    );
    displayPokemon(filteredPokemon);
  }
};

const searchPokemonType = (event) => {
  event.preventDefault();
  const searchType = searchTypeInput.value.toLowerCase();

  if (searchType === "") {
    pokemonData.sort(sortNumerical);

  } else {
    const filterType = pokemonData.filter((pokemon) =>
      pokemon.type.includes(searchType)
    );
    displayPokemon(filterType);
  }
};

function comparePokemon(a, b) {
  if (a.name < b.name) {
    return -1;
  } else if (a.name > b.name) {
    return 1;
  }
  return 0;
}
function comparePokemonButTheOtherWay(a, b) {
  if (a.name > b.name) {
    return -1;
  } else if (a.name < b.name) {
    return 1;
  }
  return 0;
}

function comparePokemonId(a, b) {
  if (a.id < b.id) {
    return -1;
  } else if (a.id > b.id) {
    return 1;
  }
  return 0;
}

const sortAlphabetical = (event) => {
  event.preventDefault();
  const filterSortAlpha = pokemonData.sort(comparePokemon);
  displayPokemon(filterSortAlpha);
};

const sortZetanumeril = (event) => {
  event.preventDefault();
  const filterSortAlpha = pokemonData.sort(comparePokemonButTheOtherWay);

  displayPokemon(filterSortAlpha);
};

const sortNumerical = (event) => {
  const filterNumerical = pokemonData.sort(comparePokemonId);
  displayPokemon(filterNumerical);
};

searchButton.addEventListener("click", searchPokemon);

searchTypeButton.addEventListener("click", searchPokemonType);

sortAlpha.addEventListener("click", sortAlphabetical);

sortZeta.addEventListener("click", sortZetanumeril);

fetchPokemon();


