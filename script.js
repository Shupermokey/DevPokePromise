const pokedex = document.getElementById("pokedex");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const searchTypeInput = document.getElementById("searchType-input");
const searchTypeButton = document.getElementById("searchType-button");
const sortAlpha = document.querySelector(".sort-alpha");
const sortZeta = document.querySelector(".sort-zeta");

let pokemonData = [];

const mapEmAll = new Map();

const fetchPokemon = () => {
  const promises = [];
  for (let i = 1; i <= 30; i++) {
    const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    promises.push(fetch(url).then((res) => res.json()));
  }
  Promise.all(promises).then((results) => {
    pokemonData = results.map((result) => (
      {
      name: result.name,
      image: result.sprites["front_default"],
      type: result.types.map((type) => type.type.name).join(" · "),
      id: result.id,
      fav: "",
      star: "hollow",
      img: "",
      title: "",
      sub: "",
      active: "",
    }
    ));
    createPokemonDataMap(pokemonData);
    console.log(mapEmAll);
    displayPokemon(pokemonData);

  });
};


function createPokemonDataMap(input) {
  
  input.forEach((pokemon) => mapEmAll.set(pokemon.name, pokemon));

}



function createListElement(pokemon) {
  return pokemon
    .map((pokemon) => {
      const pokemonList = `<li class="${pokemon.name} card ${pokemon.active}">
            <div class="star ${pokemon.fav} ">${pokemon.star === "hollow" ? "☆" : "⭐" }</div>
            <img class="card-image ${pokemon.img}" src="${pokemon.image}"/>
            <p class="card-id">#${pokemon.id}</p>
            <h2 class="card-title ${pokemon.title}">${pokemon.name}</h2>
            <p class="card-subtitle ${pokemon.sub}">${pokemon.type}</p>
        </li> `;
      return pokemonList;
    })
    .join("");
}


const addPokemonCardListeners = () => {
  const pokemonCards = document.querySelectorAll(".card"); 

  pokemonCards.forEach((pokemon, index) => {
    const title = pokemon.querySelector(".card-title");
    const image = pokemon.querySelector(".card-image");
    const sub = pokemon.querySelector(".card-subtitle");
    const star = pokemon.querySelector(".star");

    let arr = Array.from(pokemon.classList);
    let pMap = mapEmAll.get(arr[0]);

    pokemon.addEventListener("click", () => {
      if (!pokemon.classList.contains("active")) {
        image.classList.toggle("card-imageRevealed");
        title.classList.toggle("card-titleRevealed");
        sub.classList.toggle("card-subRevealed");
        star.classList.toggle("star-toggle");
        pokemon.classList.add("active");

        pMap.img = "card-imageRevealed"
        pMap.title = "card-titleRevealed"
        pMap.sub = "card-subRevealed"
        pMap.fav = "star-toggle"
        pMap.star = "fill"
        pMap.active = "active"
       
      }
    });

    

    star.addEventListener("click", () => {
      if (star.innerHTML === "☆") {
        star.innerHTML = "⭐";
        pMap.star = "fill"
      } else {
        star.innerHTML = "☆";
        pMap.star = "hollow"

      }
    });
  });

  };



const displayPokemon = (pokemon) => {
    pokedex.innerHTML = createListElement(pokemon);
    addPokemonCardListeners();
  
}



const searchPokemon = (event) => {
  event.preventDefault();
  const searchTerm = searchInput.value.toLowerCase();

  if (searchTerm === "") {
    pokemonData.sort(sortNumerical);
  } else {
    pokemonData.sort(comparePokemonId)
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
    pokemonData.sort(comparePokemonId)
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
  displayPokemon(pokemonData.sort(comparePokemon));
};

const sortZetanumeril = (event) => {
  event.preventDefault();
  displayPokemon(pokemonData.sort(comparePokemonButTheOtherWay));
};

const sortNumerical = (event) => {
  displayPokemon(pokemonData.sort(comparePokemonId));
};

searchButton.addEventListener("click", searchPokemon);

searchTypeButton.addEventListener("click", searchPokemonType);

sortAlpha.addEventListener("click", sortAlphabetical);

sortZeta.addEventListener("click", sortZetanumeril);

fetchPokemon();


