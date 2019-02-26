//************************* declara variables**********************************
//ubication obtain the location of the page and depending on it executes the functions
let ubication = location.href;
const pokemons = document.getElementById('pokemons');
const searchCoincidence = document.getElementById('search-coincidences');
// Array buttons
const buttonsCollection = document.getElementsByClassName("typesPokemon");
const buttonsArray = Array.from(buttonsCollection)
//obtain the radios and convert to array
const orderRadio = document.getElementsByName("order");
const arrayRadio = Array.from(orderRadio);
//obtain table's elements
const maxCandy = document.getElementById('max-candy');
const minCandy = document.getElementById('min-candy');
const avgCandy = document.getElementById('avg-candy');
const maxSpawn = document.getElementById('max-spawn');
const minSpawn = document.getElementById('min-spawn');
const avgSpawn = document.getElementById('avg-spawn');
const maxAvg = document.getElementById('max-avg');
const minAvg = document.getElementById('min-avg');
const avgAvg= document.getElementById('avg-avg');
//obtain menu
let menu = document.querySelector('#menu');
let drawer = document.querySelector('nav');
let outMenu = document.querySelector('nav');

//*****************************Define funciones****************************
const obtainDataJson = () => {
  fetch('./data/pokemon/pokemon.json')
  .then(response => response.json())
  .then(dataPokemons => {
    localStorage.dataPokemons = JSON.stringify(dataPokemons.pokemon);
  });
};

//Print the data
const printPokemon = (pokemon) => {
  let namePokemon = `<div class="divPokemon">
    <div class="flip-card-inner">
      <div class="flip-card-front"><h5># ${pokemon.id}</h5><img id="${pokemon.id}" src="${pokemon.img}"><p>${pokemon.name}</p>
        <span class="color-type">${pokemon.type}</span>
      </div>
      <div class="flip-card-back">
      <h4>${pokemon.name}</h4>
      <table id="details">
        <tr>
          <th>Height</th><td>${pokemon.height}</td>
        </tr>
        <tr>
          <th>Weight</th><td>${pokemon.weight}</td>
        </tr>
        <tr>
          <th>Candy</th><td>${pokemon.candy}</td>
        </tr>
        <tr>
          <th>Egg</th><td>${pokemon.egg}</td>
        </tr>
      </table>
      </div>
    </div>
  </div>`;
  pokemons.insertAdjacentHTML("beforeend", namePokemon);
};

//Show List Data
const showList = (pokemonList) => {
  pokemons.innerHTML = "";
  pokemonList.forEach(element => {
    printPokemon(element);
  });
};

//Pokémon type function according to clicking on the button that the user selects
const getTypePokemon = (arrayButtons) => {
  arrayButtons.map(boton => {
    boton.addEventListener("click", (event) => {
      //console.log(event.target.name);
      //console.log(window.filterByType(event.target.name));
      //Invoke a function that paints Pokemon
      showList(window.data.filterByType(JSON.parse(localStorage.dataPokemons), event.target.name));
    });
  });
}

//Filter coincidence gets the matches letter by letter
const filterCoincidence = () => {
  searchCoincidence.addEventListener('keyup', () => {
    let searchValue = document.getElementById('search-coincidences').value;
    showList(window.data.filterByLetter(JSON.parse(localStorage.dataPokemons), searchValue));
  });
}

//Order pokemons
const getOrderPokemon = (optionsRadio) => {
  optionsRadio.map(radio => {
    radio.addEventListener("click", () => {
      if (radio.checked === true) {
        let idRadio = radio.id.split('-');
        //console.log(window.data.sortData(dataPokemon,idRadio[1],idRadio[0]));
        showList(window.data.sortData(JSON.parse(localStorage.dataPokemons), idRadio[1], idRadio[0]));
      }
    });
  });
}

const printStatsTable = () => {
  const resultCandy = window.data.computeStats(JSON.parse(localStorage.dataPokemons), 'candy_count');
  maxCandy.innerHTML = resultCandy.maximum;
  minCandy.innerHTML = resultCandy.minimum;
  avgCandy.innerHTML = resultCandy.average;

  const resultSpawn = window.data.computeStats(JSON.parse(localStorage.dataPokemons), 'spawn_chance');
  maxSpawn.innerHTML = resultSpawn.maximum;
  minSpawn.innerHTML = resultSpawn.minimum;
  avgSpawn.innerHTML = resultSpawn.average;

  const resultAvg = window.data.computeStats(JSON.parse(localStorage.dataPokemons), 'avg_spawns');
  maxAvg.innerHTML = resultAvg.maximum;
  minAvg.innerHTML = resultAvg.minimum;
  avgAvg.innerHTML = resultAvg.average;
}

const principal = (ubicationPage) => {
  if (ubicationPage.includes('typePokemon.html')) {
    filterCoincidence();
  } else if (ubicationPage.includes('orderPokemon.html')) {
    getOrderPokemon(arrayRadio);
    showList(window.data.showAllData(JSON.parse(localStorage.dataPokemons)));
  } else if (ubicationPage.includes('statsPokemon.html')) {
    printStatsTable();
    //Graficos
    let google = window.google;
    google.charts.load('current', {
      'packages': ['bar']
    });

    const drawChartCandy = () => {
      const resultCandy = window.data.computeStats(JSON.parse(localStorage.dataPokemons), 'candy_count');
      let data = google.visualization.arrayToDataTable([
        ['feature', 'maximum', 'average', 'minimum'],
        ['Candy count', resultCandy.maximum, resultCandy.average, resultCandy.minimum]
      ]);

      let options = {
        chart: {
          title: 'Candy Count',
          subtitle: '151 pokemons',
        }
      };

      let chart = new google.charts.Bar(document.getElementById('chart-candy'));
      chart.draw(data, google.charts.Bar.convertOptions(options));
    };

    const drawChartSpawn = () => {
      const resultSpawn = window.data.computeStats(JSON.parse(localStorage.dataPokemons), 'spawn_chance');
      let data = google.visualization.arrayToDataTable([
        ['feature', 'maximum', 'average', 'minimum'],
        ['Spawn Chance', resultSpawn.maximum, resultSpawn.average, resultSpawn.minimum]
      ]);

      let options = {
        chart: {
          title: 'Spawn Chance',
          subtitle: '151 pokemons',
        }
      };

      let chart = new google.charts.Bar(document.getElementById('chart-spawn'));
      chart.draw(data, google.charts.Bar.convertOptions(options));
    };

    const drawChartAvg = () => {
      const resultAvg = window.data.computeStats(JSON.parse(localStorage.dataPokemons), 'avg_spawns');
      let data = google.visualization.arrayToDataTable([
        ['feature', 'maximum', 'average', 'minimum'],
        ['Avg Spawns', resultAvg.maximum, resultAvg.average, resultAvg.minimum]
      ]);

      let options = {
        chart: {
          title: 'Avg Spawns',
          subtitle: '151 pokemons',
        }
      };

      let chart = new google.charts.Bar(document.getElementById('chart-avg'));
      chart.draw(data, google.charts.Bar.convertOptions(options));
    };

    google.charts.setOnLoadCallback(drawChartCandy);
    google.charts.setOnLoadCallback(drawChartSpawn);
    google.charts.setOnLoadCallback(drawChartAvg);
  }
};

//*******************invoca funciones********************************
obtainDataJson();

getTypePokemon(buttonsArray);

principal(ubication);

//Events
menu.addEventListener('click', () => {
  //Despliega menú
  drawer.classList.toggle('open');
  //Permite scroll
  document.getElementsByTagName("html")[0].style.overflow = "auto";
  /*noscroll
  document.getElementsByTagName("html")[0].style.overflow = "hidden";
  e.stopPropagation();*/
});

outMenu.addEventListener('click', () => {
  //Cierra menú al seleccionar una opción
  drawer.classList.remove('open');
});
