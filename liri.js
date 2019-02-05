require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var axios = require("axios");
var Spotify = require("node-spotify-api");
var moment = require("moment")
var spotify = new Spotify(keys.spotify);
 
switch (process.argv[2]){
    case "concert-this":
        var artist = process.argv.slice(3).join(" ");

        axios
            .get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
            .then(function(res){

                var response = res.data;

                for (i = 0; i < response.length; i++ ){

                    var date = moment(response[i].datetime, moment.HTML5_FMT.DATETIME_LOCAL).format("MM/DD/YYYY")
                    console.log("--------------------------------------------------------------");
                    console.log("Venue: " + response[i].venue.name);
                    console.log("City: " + response[i].venue.city);
                    console.log("Country: " + response[i].venue.country);
                    console.log("When: " + date);
                    
                    if (i == (response.length -1)) {
                        console.log("--------------------------------------------------------------");
                        console.log("The End!")

                    }

                };

            }).catch(function(err){

                console.log(err)

            });

        break;

    case "spotify-this-song":
        var possible = process.argv.slice(3).join(" ")
        var song = "The Sign";
        if (process.argv[3] != undefined){
            song = possible;
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
            }

            for (i = 0; i < data.tracks.items.length; i++){

                if (data.tracks.items[i].artist[0].name == "Ace of Base"){  
                        var num = i
                        console.log("-------------------------------------------------");
                        console.log("Artist: " + data.tracks.items[num].artists[0].name);
                        console.log("Song: " + data.tracks.items[num].name);
                        console.log("Preview Song Link: " + data.tracks.items[num].preview_url);
                        console.log("Album: " + data.tracks.items[num].album.name);
                };

                if (i = (data.tracks.items.length -1)){
                    console.log("-------------------------------------------------");
                    console.log("Thats all I've got!");
                };
            };

        });

        console.log();
        break;

    case "movie-this":
        
    
        console.log();
        break; 
        
    case "do-what-it-says":
        
    
        console.log();
        break;

    default:
        console.log();
        break;

}