const graphql = require('graphql');
const lodash = require('lodash');
const Game = require('../models/game');
const Creator = require('../models/creator');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

const GameType = new GraphQLObjectType({
  name: 'Game',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    creator: {
      type: CreatorType,
      resolve(parent, args) {
        return Creator.findById(parent.creatorid);
      },
    },
  }),
});

const CreatorType = new GraphQLObjectType({
  name: 'Creator',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    ranking: { type: GraphQLInt },
    games: {
      type: new GraphQLList(GameType),
      resolve(parent, args) {
        return Game.find({ creatorid: parent.id });
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    game: {
      type: GameType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Game.findById(args.id);
      },
    },
    creator: {
      type: CreatorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Creator.findById(args.id);
      },
    },
    genres: {
      type: new GraphQLList(GameType),
      args: { genre: { type: GraphQLString } },
      resolve(parent, args) {
        return Game.find({ genre: args.genre });
      },
    },
    games: {
      type: new GraphQLList(GameType),
      resolve(parent, args) {
        return Game.find({});
      },
    },
    creators: {
      type: new GraphQLList(CreatorType),
      resolve(parent, args) {
        return Creator.find({});
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addCreator: {
      type: CreatorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        ranking: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        const creator = new Creator({
          name: args.name,
          ranking: args.ranking,
        });
        return creator.save();
      },
    },
    addGame: {
      type: GameType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        creatorid: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        const game = new Game({
          name: args.name,
          genre: args.genre,
          creatorid: args.creatorid,
        });
        return game.save();
      },
    },
  }),
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
