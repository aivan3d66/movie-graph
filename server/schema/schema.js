const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
} = require('graphql')

const Movies = require('../models/movies')
const Directors = require('../models/directors')

// const directorsJson = [
//     { 'name': 'Quentin Tarantino', 'age': 55 }, // 626adf0b1f5297deb9c22c80
//     { 'name': 'Michael Radford', 'age': 72 }, // 626ae0511f5297deb9c22c83
//     { 'name': 'James McTeigue', 'age': 51 }, // 626ae06e1f5297deb9c22c84
//     { 'name': 'Guy Ritchie', 'age': 50 }, // 626ae0841f5297deb9c22c85
// ]
//
// const moviesJson = [
//     { 'name': 'Pulp Fiction', 'genre': 'Crime', 'directorId': '626adf0b1f5297deb9c22c80' },
//     { 'name': '1984', 'genre': 'Sci-Fi', 'directorId': '626ae0511f5297deb9c22c83' },
//     { 'name': 'V for vendetta', 'genre': 'Sci-Fi-Triller', 'directorId': '626ae06e1f5297deb9c22c84' },
//     { 'name': 'Snatch', 'genre': 'Crime-Comedy', 'directorId': '626ae0841f5297deb9c22c85' },
//     { 'name': 'Reservoir Dogs', 'genre': 'Crime', 'directorId': '626adf0b1f5297deb9c22c80' },
//     { 'name': 'The Hateful Eight', 'genre': 'Crime', 'directorId': '626adf0b1f5297deb9c22c80' },
//     { 'name': 'Inglourious Basterds', 'genre': 'Crime', 'directorId': '626adf0b1f5297deb9c22c80' },
//     {
//         'name': 'Lock, Stock and Two Smoking Barrels',
//         'genre': 'Crime-Comedy',
//         'directorId': '626ae0841f5297deb9c22c85',
//     },
// ]

// const movies = [
//     { id: '1', name: 'Pulp Fiction', genre: 'Crime', directorId: '1' },
//     { id: '2', name: '1984', genre: 'Sci-Fi', directorId: '2' },
//     { id: '3', name: 'V for vendetta', genre: 'Sci-Fi-Triller', directorId: '3' },
//     { id: '4', name: 'Snatch', genre: 'Crime-Comedy', directorId: '4' },
//     { id: '5', name: 'Reservoir Dogs', genre: 'Crime', directorId: '1' },
//     { id: '6', name: 'The Hateful Eight', genre: 'Crime', directorId: '1' },
//     { id: '7', name: 'Inglourious Basterds', genre: 'Crime', directorId: '1' },
//     { id: '7', name: 'Lock, Stock and Two Smoking Barrels', genre: 'Crime-Comedy', directorId: '4' },
// ]
//
// const directors = [
//     { id: '1', name: 'Quentin Tarantino', age: 55 },
//     { id: '2', name: 'Michael Radford', age: 72 },
//     { id: '3', name: 'James McTeigue', age: 51 },
//     { id: '4', name: 'Guy Ritchie', age: 50 },
// ]

const MovieType = new GraphQLObjectType({
    name: 'Movie',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        director: {
            type: DirectorType,
            resolve(parent, args) {
                // return directors.find(director => director.id === parent.id);
                return Directors.findById(parent.directorId)
            },
        },
    }),
})

const DirectorType = new GraphQLObjectType({
    name: 'Director',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        movies: {
            type: new GraphQLList(MovieType),
            resolve(parent, args) {
                // return movies.filter(movie => movie.directorId === parent.id);
                return Movies.find({ directorId: parent.id })
            },
        },
    }),
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addDirector: {
            type: DirectorType,
            args: {
                name: { type: GraphQLString },
                age: { type: GraphQLInt },
            },
            resolve(parent, args) {
                const director = new Directors({
                    name: args.name,
                    age: args.age,
                })
                return director.save()
            },
        },
        addMovie: {
            type: MovieType,
            args: {
                name: { type: GraphQLString },
                genre: { type: GraphQLString },
                directorId: { type: GraphQLID },
            },
            resolve(parent, args) {
                const movie = new Movies({
                    name: args.name,
                    genre: args.genre,
                    directorId: args.directorId,
                })
                return movie.save()
            },
        },
        deleteDirector: {
            type: DirectorType,
            args: {
                id: { type: GraphQLID },
            },
            resolve(parent, args) {
                return Directors.findByIdAndRemove(args.id)
            },
        },
        deleteMovie: {
            type: MovieType,
            args: {
                id: { type: GraphQLID },
            },
            resolve(parent, args) {
                return Movies.findByIdAndRemove(args.id)
            },
        },
        updateDirector: {
            type: DirectorType,
            args: {
                id: { type: GraphQLID },
                name: { type: GraphQLString },
                age: { type: GraphQLInt },
            },
            resolve(parent, args) {
                return Directors.findByIdAndUpdate(
                    args.id,
                    { $set: { name: args.name, age: args.age } },
                    { new: true },
                )
            },
        },
        updateMovie: {
            type: MovieType,
            args: {
                id: { type: GraphQLID },
                name: { type: GraphQLString },
                genre: { type: GraphQLString },
                directorId: { type: GraphQLID },
            },
            resolve(parent, args) {
                return Movies.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            name: args.name,
                            genre: args.genre,
                            directorId: args.directorId,
                        },
                    },
                    { new: true },
                )
            },
        },
    },
})

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        movie: {
            type: MovieType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // return movies.find(movie => movie.id === args.id);
                return Movies.findById(args.id)
            },
        },
        director: {
            type: DirectorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // return directors.find(director => director.id === args.id);
                return Directors.findById(args.id)
            },
        },
        movies: {
            type: new GraphQLList(MovieType),
            resolve(parent, args) {
                // return movies;
                return Movies.find({})
            },
        },
        directors: {
            type: new GraphQLList(DirectorType),
            resolve(parent, args) {
                // return directors;
                return Directors.find({})
            },
        },
    },
})

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation,
})