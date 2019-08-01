const express = require('express');
const cors = require("cors");
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const schema = require('./schema/schema');


const app = express();

app.use(cors());

mongoose.connect(keys.mongoURI);
mongoose.connection.once('open', () => {
  console.log('connected to database');
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`LISTEN ON PORT ${PORT}`);
});
