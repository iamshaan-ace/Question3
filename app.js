require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const database = require('./config/database');
const Movie = require('./models/movie');
const { engine } = require('express-handlebars');
const Handlebars = require('handlebars');

// Allow prototype properties in Handlebars
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

const app = express();
const port = 8000;

// Debug Logs
console.log('DB_CONNECTION_STRING:', process.env.DB_CONNECTION_STRING);
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('MongoDB URI Used:', database.url);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set up Handlebars view engine
app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        handlebars: allowInsecurePrototypeAccess(Handlebars),
    })
);
app.set('view engine', 'hbs');
app.set('views', './views');

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Database Connection Error:', err)); 

// Root route
app.get('/', (req, res) => {
    res.redirect('/movies'); // Redirect to the movies page
});

// Search for a movie by _id or Movie_ID
app.get('/movies/search', async (req, res) => {
    try {
        const query = mongoose.isValidObjectId(req.query.id)
            ? { _id: req.query.id }
            : { Movie_ID: req.query.id };

        const movie = await Movie.findOne(query);

        if (!movie) {
            return res.render('movies', { movies: [], error: 'No movie found for the given ID.' });
        }

        res.render('movies', { movies: [movie] });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Display all movies
app.get('/movies', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.render('movies', { movies });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Add movie form
app.get('/add-movie', (req, res) => {
    res.render('add-movie');
});

// Handle movie creation
app.post('/add-movie', async (req, res) => {
    try {
        const {
            Movie_ID,
            Title,
            Year,
            Rated,
            Released,
            Runtime,
            Genre,
            Director,
            Writer,
            Actors,
            Plot,
            Language,
            Country,
            Awards,
            Poster
        } = req.body;

        // Validation: Check if required fields are present
        if (!Movie_ID || !Title) {
            return res.status(400).send('Movie ID and Title are required.');
        }

        // Optional fields can remain empty or null
        const newMovie = {
            Movie_ID,
            Title,
            Year: Year || null,
            Rated: Rated || '',
            Released: Released || '',
            Runtime: Runtime || '',
            Genre: Genre || '',
            Director: Director || '',
            Writer: Writer || '',
            Actors: Actors || '',
            Plot: Plot || '',
            Language: Language || '',
            Country: Country || '',
            Awards: Awards || '',
            Poster: Poster || ''
        };

        await Movie.create(newMovie);
        res.redirect('/movies');
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Show movie details
app.get('/movies/:id', async (req, res) => {
    try {
        const query = mongoose.isValidObjectId(req.params.id)
            ? { _id: req.params.id }
            : { Movie_ID: req.params.id };

        const movie = await Movie.findOne(query);

        if (!movie) {
            return res.status(404).render('error', { message: 'Movie not found' });
        }

        res.render('movie-details', { movie });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// API: Get all movies
app.get('/api/movies', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// API: Get a movie by ID
app.get('/api/movies/:id', async (req, res) => {
    try {
        const query = mongoose.isValidObjectId(req.params.id)
            ? { _id: req.params.id }
            : { Movie_ID: req.params.id };

        const movie = await Movie.findOne(query);

        if (!movie) {
            return res.status(404).send({ error: 'Movie not found' });
        }

        res.json(movie);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// API: Create a new movie
app.post('/api/movies', async (req, res) => {
    try {
        const { Movie_ID, Title } = req.body;

        // Validation
        if (!Movie_ID || !Title) {
            return res.status(400).send('Movie ID and Title are required.');
        }

        const movie = await Movie.create(req.body);
        res.json(movie);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// API: Update a movie
app.put('/api/movies/:id', async (req, res) => {
    try {
        const query = mongoose.isValidObjectId(req.params.id)
            ? { _id: req.params.id }
            : { Movie_ID: req.params.id };

        const updatedMovie = await Movie.findOneAndUpdate(query, req.body, { new: true });
        if (!updatedMovie) {
            return res.status(404).send('Movie not found');
        }

        res.send('Movie updated successfully');
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// API: Delete a movie
app.delete('/api/movies/:id', async (req, res) => {
    try {
        const query = mongoose.isValidObjectId(req.params.id)
            ? { _id: req.params.id }
            : { Movie_ID: req.params.id };

        const deletedMovie = await Movie.deleteOne(query);
        if (!deletedMovie) {
            return res.status(404).send('Movie not found');
        }

        res.send('Movie deleted successfully');
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
