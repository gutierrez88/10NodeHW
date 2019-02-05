require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var axios = require("axios");
var Spotify = require("node-spotify-api");
var moment = require("moment");
var spotify = new Spotify(keys.spotify);
var readArr = [];
var saveArr = [];

function saveIt(){
    
    fs.appendFile("sample.txt", saveArr, function(err) {
        if (err) {
        console.log(err);
        };
    });
};

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
    
    saveArr = ["### -concert-this: " + artist];

    function run() {
        axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp").then(function(res){
            var response = res.data;
            for (i = 0; i < response.length; i++ ){
                
                var date = moment(response[i].datetime, moment.HTML5_FMT.DATETIME_LOCAL).format("MM/DD/YYYY");
                var venue = response[i].venue.name;
                var city = response[i].venue.city;
                var country = response[i].venue.country;
                
                

                saveArr.push((i+1) + " -Venue: " + venue + " -City: " + city + " -Country: " + country + " -When: " + date + "|||");

                console.log("------------------------");
                console.log("Venue: " + venue);
                console.log("City: " + city);
                console.log("Country: " + country);
                console.log("When: " + date);
                
                if (i == (response.length -1)) {
                    console.log("------------------------");
                    console.log("The End!");
                };
            };

            saveIt();
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
    }else if (readArr[0] === "spotify-this-song"){
        song = readArr[1];
    };

    saveArr = ["### -spotifyThisSong: " + song];   
    
    spotify.search({
        type: "track",
        query: song,
    }, function(err,data){

        if (err){
            console.log("Error occurred: " + err);
        };

        var info = data.tracks.items;

        if (song != "The Sign"){
            for (j = 0; j < info.length; j++){

                var artist = info[j].artists[0].name;
                var track = info[j].name;
                var url = info[j].preview_url;
                var album = info[j].album.name;
                
                saveArr.push(" -Artist: " + artist + " -Song: " + track + " -Preview Song URL: " + url + " -Album: " + album + "|||");
                
                console.log("-------------------------------------------------");
                console.log("Artist: " + artist);
                console.log("Song: " + track);
                console.log("Preview Song Link: " + url);
                console.log("Album: " + album);
            };
            if (j = (info.length -1)){
                console.log("-------------------------------------------------");
                console.log("Thats all I've got!");
            };
        }else{ 

            var artist = info[9].artists[0].name;
            var track = info[9].name;
            var url = info[9].preview_url;
            var album = info[9].album.name;
                
            saveArr.push(" -Artist: " + artist + " -Song: " + track + " -Preview Song URL: " + url + " -Album: " + album + "|||");

            console.log("-------------------------------------------------");
            console.log("Artist: " + info[9].artists[0].name);
            console.log("Song: " + info[9].name);
            console.log("Preview Song Link: " + info[9].preview_url);
            console.log("Album: " + info[9].album.name);
            console.log("-------------------------------------------------");
        };

        saveIt();
    });
};

function movieThis(){
    var posMovie = process.argv.slice(3).join("+");
    var movie = "mr nobody";

    if (process.argv[3] != undefined){
        movie = posMovie;
    }else if (readArr[0] === "movie-this"){
        movie = readArr[1];
        run();
    };

    saveArr = ["### -movie-this: " + movie];

    axios.get("http://www.omdbapi.com/?t=" + movie + "&plot=short&apikey=trilogy").then(function(res){
        var response = res.data;

        var title = response.Title;
        var year =response.Year;
        var imdbRating = response.Ratings[0].Value;
        var rtr = response.Ratings[1].Value;
        var country = response.Country;
        var language = response.Language;
        var plot = response.Plot;
        var cast = response.Actors;

        saveArr.push(" -Title: " + title + " -Year: " + year + " -IMDB Rating: " + imdbRating + " -Rotten Tomatoes Rating: " + rtr + " -Country Produce in: " + country + " -Language: " + language + " -Plot: " + plot + " -Cast: " + cast + "|||");

        console.log("--------------------------------------------------------------");
        console.log("Title: " + response.Title);
        console.log("Year: " + response.Year);
        console.log("IMDB Rating: " + response.Ratings[0].Value);
        console.log("Rotten Tomatoes Rating: " + response.Ratings[1].Value);
        console.log("Country Produced in: " + response.Country);
        console.log("Language: " + response.Language);
        console.log("Plot: " + response.Plot);
        console.log("Cast: " + response.Actors);
        console.log("--------------------------------------------------------------");
        console.log("The End!");

        saveIt();
    }).catch(function(err){
        console.log(err);   
    });
};

function readThis(){
    fs.readFile("random.txt", "utf8", function(error, data) {

        if (error) {
          return console.log(error);
        };

        var dataArr = data.split(",");
        
        if(dataArr[0] === "spotify-this-song"){
            readArr.push(dataArr[0]);
            readArr.push(dataArr[1]);
            spotifyThisSong();
        };
        if(dataArr[0] === "movie-this"){
            readArr.push(dataArr[0]);
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