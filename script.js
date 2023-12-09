const pokedex = document.getElementById("pokedex");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const searchTypeInput = document.getElementById("searchType-input");
const searchTypeButton = document.getElementById("searchType-button");
const scroller = document.querySelector(".scroller");
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
  });
};

const displayPokemon = (pokemon) => {
  const pokemonHTMLString = pokemon
    .map(
      (pokemon) => `
        <li class="card">
            <div class="star-toggle star">☆</div>
            <img class="card-image" src="${pokemon.image}"/>
            <p class="card-id">#${pokemon.id}</p>
            <h2 class="card-title">${pokemon.name}</h2>
            <p class="card-subtitle">${pokemon.type}</p>
        </li>
    `
    )
    .join("");

  pokedex.innerHTML = pokemonHTMLString;

  const pokemonCards = document.querySelectorAll(".card");
  const star = document.querySelectorAll(".star");

  pokemonCards.forEach((pokemon, index) => {
    const title = pokemon.querySelector(".card-title");
    const image = pokemon.querySelector(".card-image");
    const sub = pokemon.querySelector(".card-subtitle");
    const star = pokemon.querySelector(".star");

    pokemon.addEventListener("click", () => {
      if(!pokemon.classList.contains("active")){
        image.classList.toggle("card-imageRevealed");
      title.classList.toggle("card-titleRevealed");
      sub.classList.toggle("card-subRevealed");
      star.classList.toggle("star-toggle");
      star.classList.add(`pokeball${index+1}`)
      pokemon.classList.add("active");
      }

    });
    star.addEventListener("click", () => {
      if(star.innerHTML === "☆"){
        star.innerHTML = "⭐"
      }
      else {
        star.innerHTML = "☆"
      }
    })
  });

  pokemonData.forEach((pokemon) => {
    const pokedexContainer = document.createElement("div");
    const newPoke = document.createElement("div");
    const pokeBall = document.createElement("div");

    pokeBall.className = `pokeball pokeball${pokemon.id}`;
    newPoke.className = "pokemonName";
    pokedexContainer.className = "pokedexContainer";
    newPoke.innerHTML = `${pokemon.id} ${pokemon.name}`;
    scroller.appendChild(pokedexContainer);

    pokedexContainer.appendChild(pokeBall);
    pokedexContainer.appendChild(newPoke);


  });

  
  star.forEach((s) => {
    s.addEventListener("click", () =>  {
      const test = "."+s.classList[1];
     const test2 = document.querySelectorAll(test);
      if(s.innerHTML === '⭐') {
       test2[1].classList.toggle("pokeemall");
      }
      else {
        test2[1].classList.toggle("pokeemall");
      }
    })
  })


};



const searchPokemon = (event) => {
  event.preventDefault();
  const searchTerm = searchInput.value.toLowerCase();
  const filteredPokemon = pokemonData.filter((pokemon) =>
    pokemon.name.includes(searchTerm)
  );

  const pokemonCards = document.querySelectorAll(".card");
  pokemonCards.forEach((pokemon) => {});
  displayPokemon(filteredPokemon);
};

const searchPokemonType = (event) => {
  event.preventDefault();
  const searchType = searchTypeInput.value.toLowerCase();
  const filterType = pokemonData.filter((pokemon) =>
    pokemon.type.includes(searchType)
  );
  const pokemonCards = document.querySelectorAll(".card");
  pokemonCards.forEach((pokemon) => {});
  displayPokemon(filterType);
};

searchButton.addEventListener("click", searchPokemon);

searchTypeButton.addEventListener("click", searchPokemonType);


fetchPokemon();


