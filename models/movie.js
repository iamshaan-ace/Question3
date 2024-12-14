const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    Movie_ID: { type: Number, required: true },
    Title: { type: String, required: true },
    Year: { type: Number, default: null },
    Rated: { type: String, default: '' },
    Released: { type: String, default: '' },
    Runtime: { type: String, default: '' },
    Genre: { type: String, default: '' },
    Director: { type: String, default: '' },
    Writer: { type: String, default: '' },
    Actors: { type: String, default: '' },
    Plot: { type: String, default: '' },
    Language: { type: String, default: '' },
    Country: { type: String, default: '' },
    Awards: { type: String, default: '' },
    Poster: { type: String, default: '' },
    Ratings: {
        Source: { type: String, default: '' },
        Value: { type: String, default: '' }
    },
    Metascore: { type: String, default: '' },
    imdbRating: { type: Number, default: null },
    imdbVotes: { type: String, default: '' },
    imdbID: { type: String, default: '' },
    Type: { type: String, default: '' },
    tomatoMeter: { type: String, default: '' },
    tomatoImage: { type: String, default: '' },
    tomatoRating: { type: String, default: '' },
    tomatoReviews: { type: String, default: '' },
    tomatoFresh: { type: String, default: '' },
    tomatoRotten: { type: String, default: '' },
    tomatoConsensus: { type: String, default: '' },
    tomatoUserMeter: { type: String, default: '' },
    tomatoUserRating: { type: String, default: '' },
    tomatoUserReviews: { type: String, default: '' },
    tomatoURL: { type: String, default: '' },
    DVD: { type: String, default: '' },
    BoxOffice: { type: String, default: '' },
    Production: { type: String, default: '' },
    Website: { type: String, default: '' },
    Response: { type: Boolean, default: true }
});


module.exports = mongoose.model('Movie', MovieSchema, 'movie'); // Explicitly set collection name