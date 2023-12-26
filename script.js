const pokedex = document.getElementById("pokedex");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const searchTypeInput = document.getElementById("searchType-input");
const searchTypeButton = document.getElementById("searchType-button");
const sortAlpha = document.querySelector(".sort-alpha");
const sortZeta = document.querySelector(".sort-zeta");
let scroller = document.querySelector(".scroll-container");
const scroll = document.querySelector(".scroller");

let pokemonData = [];

const mapEmAll = new Map();
let pokemonDataFav = [];

const getPokeArr = (num) => {
  const promises = [];
  for (let i = 1; i <= num; i++) {
    const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    promises.push(fetch(url).then((res) => res.json()));
  }
  return promises;
};

function containerSwap(name) {
  pokemonData = pokemonData.filter((pokemon) =>  {
    if(pokemon.name !== name){
      return pokemon.name !== name;
    }
    else {
      pokemonDataFav.push(pokemon);
    }
  })
  displayPokemon(pokemonData)
}

function containerFavSwap(name) {
  pokemonDataFav = pokemonDataFav.filter((pokemon) =>  {
    if(pokemon.name !== name){
      return pokemon.name !== name;
    }
    else {
      pokemonData.push(pokemon);
    }
  })
  displayPokemon(doSorting(pokemonData, "id", 'asc'));
}

const pokeArray = getPokeArr(30);

const fetchPokemon = (pokeArray) => {
  Promise.all(pokeArray).then((results) => {
    buildUI(results);
  });
};

const buildUI = (data) => {
  pokemonData = data.map((result) => ({
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
  }));
  createPokemonDataMap(pokemonData);
  displayPokemon(pokemonData);
};

function createPokemonDataMap(input) {
  input.forEach((pokemon) => mapEmAll.set(pokemon.name, pokemon));
}

function createListElement(pokemon) {
  return pokemon
    .map((pokemon) => {
      const pokemonList = `<li class="${pokemon.name} card ${pokemon.active}">
            <div class="star ${pokemon.fav}">${
        pokemon.star === "hollow" ? "☆" : "⭐"
      }</div>
            <img class="card-image ${pokemon.img}" src="${pokemon.image}"/>
            <p class="card-id">#${pokemon.id}</p>
            <h2 class="card-title ${pokemon.title}">${pokemon.name}</h2>
            <p class="card-subtitle ${pokemon.sub}">${pokemon.type}</p>
        </li> `;
      return pokemonList;
    })
    .join("");
}

const addStarListeners = (pMap, data) => {
  data.addEventListener("click", () => {
    if (data.innerHTML === "☆") {
      data.innerHTML = "⭐";
      pMap.star =  "fill";
      containerSwap(pMap.name);

    } else {
      data.innerHTML = "☆";
      pMap.star = "hollow";
    }
  });
}

const addPokemonCardListeners = () => {
  const pokemonCards = document.querySelectorAll(".card");

  pokemonCards.forEach((pokemon) => {
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
        star.classList.add("star-toggle");
        pokemon.classList.add("active");

        pMap.img = "card-imageRevealed";
        pMap.title = "card-titleRevealed";
        pMap.sub = "card-subRevealed";
        pMap.active = "active";
        pMap.star = "hollow";
        pMap.fav = "star-toggle";
      }
      displayScroller(mapEmAll);
    });

    addStarListeners(pMap, star);

  });
};

function displayScroller(input) {
  scroll.removeChild(scroller);
  scroller = document.createElement("div");
  scroller.classList.add("scroller-container");

  for (let i of input) {
    const pokemonC = document.createElement("div");
    pokemonC.classList.add("pokedexContainer");

    const pokeBall = document.createElement("div");
    if (i[1].star === "hollow") {
      pokeBall.classList.add("pokeball");
    } else if (i[1].star === "fill") {
      pokeBall.classList.add("pokeball");
      pokeBall.classList.add("pokeemall");
    }

    pokeBall.addEventListener("click", () => {
      if(pokeBall.classList.contains("pokeemall")){
        pokeBall.classList.remove("pokeemall");
        i[1].star = "hollow"
        containerFavSwap(i[1].name);

        //TODO: need to add the pokemon matched with the ball back to the list, which I can grab from i[0]
      }
    })

    const pokemon = document.createElement("div");
    pokemon.classList.add("pokemonName");
    if (i[1].active === "") {
      pokemon.innerHTML = "- - - - - - - -";
    } else {
      pokemon.innerHTML = i[0];
    }

    pokemonC.appendChild(pokeBall);
    pokemonC.appendChild(pokemon);
    scroller.appendChild(pokemonC);
    scroll.appendChild(scroller);
  }
}

const displayPokemon = (pokemon) => {
  pokedex.innerHTML = createListElement(pokemon);
  addPokemonCardListeners();
  displayScroller(mapEmAll);
};

const searchPokemon = (event) => {
  const searchTerm = searchInput.value.toLowerCase();

  if (searchTerm === "") {
    displayPokemon(doSorting(pokemonData, "id", 'asc'));
  } else {
    doSorting(pokemonData, "id", 'asc');
    const filteredPokemon = pokemonData.filter((pokemon) =>
      pokemon.name.includes(searchTerm)
    );
    displayPokemon(filteredPokemon);
  }
};

const searchPokemonType = (event) => {
  const searchType = searchTypeInput.value.toLowerCase();

  if (searchType === "") {
    displayPokemon(doSorting(pokemonData, "id", 'asc'));
  } else {
    doSorting(pokemonData, "id", 'asc');

    const filterType = pokemonData.filter((pokemon) =>
      pokemon.type.includes(searchType)
    );
    displayPokemon(filterType);
  }
};


const doSorting = (data, prop, dir) => {
  return data.sort((a,b) => {
    const aVal = a[prop]
    const bVal = b[prop]
    if(aVal < bVal) {
      return dir === 'asc' ? -1 : 1;
    }
    else if(aVal > bVal) {
      return dir === 'asc' ? 1 : -1;
    }
    return 0;
  })
}

// function comparePokemon(a, b) {
//   if (a.name < b.name) {
//     return -1;
//   } else if (a.name > b.name) {
//     return 1;
//   }
//   return 0;
// }
// function comparePokemonButTheOtherWay(a, b) {
//   if (a.name > b.name) {
//     return -1;
//   } else if (a.name < b.name) {
//     return 1;
//   }
//   return 0;
// }

// function comparePokemonId(a, b) {
//   if (a.id < b.id) {
//     return -1;
//   } else if (a.id > b.id) {
//     return 1;
//   }
//   return 0;
// }

const sortAlphabetical = (event) => {
  event.preventDefault();
  displayPokemon(doSorting(pokemonData, "name", "asc"));

};

const sortZetanumeril = (event) => {
  event.preventDefault();
  displayPokemon(doSorting(pokemonData, "name", "dec"));

};

const sortNumerical = (event) => {
  event.preventDefault();
  displayPokemon(doSorting(pokemonData, "id", "asc"));

};

searchButton.addEventListener("click", searchPokemon);

searchTypeButton.addEventListener("click", searchPokemonType);

sortAlpha.addEventListener("click", sortAlphabetical);

sortZeta.addEventListener("click", sortZetanumeril);

fetchPokemon(pokeArray);
