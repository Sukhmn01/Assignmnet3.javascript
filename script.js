/* 
Attributions:--------------
- TMDb Actor Image Feature:
  Implemented using concepts learned from:
  • The TMDb API Official doocumentation
  • various community tutorials demonstrating image paths 
    and actor profile fetching.

- OMDb Movie Fetching:
  based on examples from:
  • OMDb API Documentation

- DOM Manipulation & JavaScript Techniques:
  enhanced using guidance from:
  • MDN Web Docs 
  • W3Schools JavaScript Tutorials
--------------------------------------------------------------
*/

// API keys for OMDb and TMDb that used to fetch movie and actor data
const OMDB_KEY = "e0ee02bc"; 
const TMDB_KEY = "b89aa9a2a6e7a53d5dec953421b38d7a"; 

// getting HTML elements from the page
const movieSelect = document.querySelector("#movieSelect");
const getMovieBtn = document.querySelector("#getMovieBtn");
const movieContainer = document.querySelector("#movieContainer");
const actorContainer = document.querySelector("#actorContainer");

// when the button is clicked, check movie selection and fetch data
getMovieBtn.addEventListener("click", function() {
    const movie = movieSelect.value;
    // if user didn't select anything
    if (!movie) {
        alert("Select a movie first"); 
        return;
    }
    // call the function to load the selected movie
    fetchMovie(movie); 
});

// function that calls OMDb API to get movie details
function fetchMovie(title) {
    fetch("https://www.omdbapi.com/?t=" + encodeURIComponent(title) + "&apikey=" + OMDB_KEY)
    .then(function(res) { return res.json(); })
    .then(function(data) {
         // if OMDb cannot find the movie
        if (data.Response === "False") {
            movieContainer.innerHTML = "<p>Movie not found: " + data.Error + "</p>";
            actorContainer.innerHTML = ""; // clear old actor data
            return;
        }
        // show movie details on the page
        displayMovie(data); 
         // fetch actor images + info from TMDb
        fetchActors(data.Actors);
    })
    .catch(function(err) {
        // if something goes wrong with the request
        console.log("OMDB fetch error:", err);
        movieContainer.innerHTML = "<p>Error fetching movie info.</p>";
        actorContainer.innerHTML = "";
    });
}

// function that puts movie info onto the page
function displayMovie(data) {
    movieContainer.innerHTML = "<div>" +
        "<img src='" + data.Poster + "' alt='" + data.Title + "'>" +
        "<h2>" + data.Title + " (" + data.Year + ")</h2>" +
        "<p><strong>Rating:</strong> " + data.imdbRating + "</p>" +
        "<p><strong>Plot:</strong> " + data.Plot + "</p>" +
        "<p><strong>Actors:</strong> " + data.Actors + "</p>" +
    "</div>";
}

// function to fetch each actor's image and info from TMDb
function fetchActors(actorList) {

    // if movie doesn’t include actor names
    if (!actorList) {
        // start actor section with a title
        actorContainer.innerHTML = "<p>No actor info available.</p>";
        return;
    }

    actorContainer.innerHTML = "<h2>Actors Info</h2>";

    var actors = actorList.split(", ");

     // loop through each actor name
    actors.forEach(function(actor) {
        // TMDb search request for each actor
        fetch("https://api.themoviedb.org/3/search/person?api_key=" + TMDB_KEY + "&query=" + encodeURIComponent(actor))
        .then(function(res) { return res.json(); })
        .then(function(data) {
            // if TMDb returns actor results
            if (data.results && data.results[0]) {
                var actorData = data.results[0];
                 // if actor has a profile picture, build the full image link
                var profile = actorData.profile_path 
                    ? "https://image.tmdb.org/t/p/w200" + actorData.profile_path
                    : "";
  
                    // sdd actor card
                actorContainer.innerHTML += "<div>" +
                    (profile ? "<img src='" + profile + "' alt='" + actorData.name + "'>" : "") +
                    "<h3>" + actorData.name + "</h3>" +
                "</div>";
            }
        })
        // if TMDb fails to load actor data
        .catch(function(err) { console.log("Actor API error:", err); });
    });
}
