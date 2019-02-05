require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var axios = require("axios");
var Spotify = require("node-spotify-api");
var moment = require("moment");
var spotify = new Spotify(keys.spotify);
var readArr = [];

function concertThis(){
    var posArt = process.argv.slice(3).join(" ");
    var artist = "";

    if (process.argv[3] != undefined){
        artist = posArt;
        run();
    }else if (readArr[0] === "concert-this"){
        artist = readArr[1];
        run();
    }else{
        console.log("Please let me know who you would like to see.");
    };

    function run() {
        axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp").then(function(res){
            var response = res.data;
            for (i = 0; i < response.length; i++ ){

                var date = moment(response[i].datetime, moment.HTML5_FMT.DATETIME_LOCAL).format("MM/DD/YYYY");
                console.log("--------------------------------------------------------------");
                console.log("Venue: " + response[i].venue.name);
                console.log("City: " + response[i].venue.city);
                console.log("Country: " + response[i].venue.country);
                console.log("When: " + date);
                
                if (i == (response.length -1)) {
                    console.log("--------------------------------------------------------------");
                    console.log("The End!");

                };
            };
        }).catch(function(err){
            console.log(err);
        });
    };
};

function spotifyThisSong(){
    var possible = process.argv.slice(3).join(" ");
    var song = "The Sign";

    if (process.argv[3] != undefined){
        song = possible;
    }else if (readArr != []){
        song = readArr[0];
    };
        
    spotify.search({
        type: "track",
        query: song,
    }, function(err,data){

        if (err){
            console.log("Error occurred: " + err);
        };

        if (song != "The Sign"){
            for (j = 0; j < data.tracks.items.length; j++){
                console.log("-------------------------------------------------");
                console.log("Artist: " + data.tracks.items[j].artists[0].name);
                console.log("Song: " + data.tracks.items[j].name);
                console.log("Preview Song Link: " + data.tracks.items[j].preview_url);
                console.log("Album: " + data.tracks.items[j].album.name);
            };
            if (j = (data.tracks.items.length -1)){
                console.log("-------------------------------------------------");
                console.log("Thats all I've got!");
            };
        }else{ 
                console.log("-------------------------------------------------");
                console.log("Artist: " + data.tracks.items[9].artists[0].name);
                console.log("Song: " + data.tracks.items[9].name);
                console.log("Preview Song Link: " + data.tracks.items[9].preview_url);
                console.log("Album: " + data.tracks.items[9].album.name);
                console.log("-------------------------------------------------");
        };
    });
};

function movieThis(){
    var posMovie = process.argv.slice(3).join("+");
    var movie = "mr nobody";
    if (process.argv[3] != undefined){
        movie = posMovie;
    }else if (readArr != []){
        movie = readArr[0];
    };

    axios.get("http://www.omdbapi.com/?t=" + movie + "&plot=short&apikey=trilogy").then(function(res){
        var response = res.data;
            
        console.log("--------------------------------------------------------------");
        console.log("Title: " + response.Title);
        console.log("Year: " + response.Year);
        console.log("IMDB Rating: " + response.Ratings[0].value);
        console.log("Rotten Tomatoes Rating: " + response.Ratings[1].value);
        console.log("Country Produced in: " + response.Country);
        console.log("Language: " + response.Language);
        console.log("Plot: " + response.Plot);
        console.log("Cast: " + response.Actors);
        console.log("--------------------------------------------------------------");
        console.log("The End!");
            
    }).catch(function(err){
        console.log(err);   
    });
}

function readThis(){
    fs.readFile("random.txt", "utf8", function(error, data) {

        if (error) {
          return console.log(error);
        };

        var dataArr = data.split(",");
        
        if(dataArr[0] === "spotify-this-song"){
            readArr.push(dataArr[1]);
            spotifyThisSong();
        };
        if(dataArr[0] === "movie-this"){
            readArr.push(dataArr[1]);
            movieThis();
        };
        if(dataArr[0] === "concert-this"){
            readArr.push(dataArr[0]);
            readArr.push(dataArr[1]);
            concertThis();
        };
      
      });
};
 

switch (process.argv[2]){
    case "concert-this":
        concertThis();
        break;

    case "spotify-this-song":
        spotifyThisSong();
        break;

    case "movie-this":
        movieThis();
        break; 
        
    case "do-what-it-says":
        readThis();
        break;

    default:
        console.log("What can I help you with today?");
        break;

};