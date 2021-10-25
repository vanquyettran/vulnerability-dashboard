'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const Joi = require('joi');
const uuid = require('uuid');

const { PORT } = require('./config');
const reposFixture = require('./repos');

const app = express();

app.use(cors());
app.use(bodyParser.json());

function makeRepo(name, lists = []) {
  return {
    name,
    id: uuid.v4(),
    lists
  };
}

function makeList(title, cards = []) {
  return {
    title,
    cards,
    id: uuid.v4()
  };
}

function makeCard(text) {
  return {
    text,
    id: uuid.v4()
  };
}


let REPOS = reposFixture;

app.get('/api/repo', (req, res) => res.json({ repos: REPOS }));

app.get('/api/repo/:id', (req, res, next) => {
  const repo = REPOS.find(item => item.id === req.params.id);
  if (!repo) {
    const err = new Error('Not Found');
    err.status = 404;
    return next(err);
  }
  return res.json(repo);
});

app.post('/api/repo', (req, res, next) => {
  const repoSchema = Joi.object().keys({
    name: Joi.string()
      .min(1)
      .required()
  });
  const { error: validationError } = Joi.validate(req.body, repoSchema);
  if (validationError) {
    const err = new Error('Bad request');
    err.status = 400;
    return next(err);
  }
  const repo = makeRepo(req.body.name);
  REPOS.push(repo);
  return res.status(201).json(repo);
});

app.delete('/api/repo/:id', (req, res) => {
  REPOS = REPOS.filter(repo => repo.id !== req.params.id);
  return res.status(204).send();
});

app.put('/api/repo/:id', (req, res, next) => {
  const repoSchema = Joi.object().keys({
    name: Joi.string().required(),
    id: Joi.string().required()
  });
  const { error: validationError } = Joi.validate(req.body, repoSchema);
  if (validationError) {
    const err = new Error('Bad request');
    err.status = 400;
    return next(err);
  }
  if (req.params.id !== req.body.id) {
    const err = new Error(`Request path id (${req.params.id}) and request body id (${
      req.body.id}) must match`);
    err.status = 400;
    return next(err);
  }
  const repo = REPOS.find(item => item.id === req.params.id);
  if (!repo) {
    const err = new Error('Repo not found');
    err.status = 404;
    return next(err);  
  }
  repo.name = req.body.name;
  return res.status(204).send();
});

app.get('/api/repo/:id/list', (req, res, next) => {
  const repo = REPOS.find(item => item.id === req.params.id);
  if (!repo) {
    const err = new Error('Not found');
    err.status = 404;
    return next(err);  
  }
  return res.json({ lists: repo.lists });
});

function findList(listId, repos = REPOS) {
  let list = null;
  for (let repo of repos) {
    list = repo.lists.find(list => list.id === listId);
    if (list) {
      break;
    }
  }
  return list;
}

app.get('/api/list/:id', (req, res, next) => {
  const list = findList(req.params.id);
  if (!list) {
    const err = new Error('List not found');
    err.status = 404;
    return next(err);  
  }
  return res.json(list);
});

app.post('/api/repo/:repoId/list', (req, res, next) => {
  const repo = REPOS.find(item => item.id === req.params.repoId);
  if (!repo) {
    const err = new Error('Repo not found');
    err.status = 404;
    return next(err);  
  }
  const listSchema = Joi.object().keys({
    title: Joi.string().required()
  });
  const { error: validationError } = Joi.validate(req.body, listSchema);
  if (validationError) {
    const err = new Error('Bad request');
    err.status = 400;
    return next(err);
  }
  const list = makeList(req.body.title);
  repo.lists.push(list);
  return res.status(201).json(list);
});

app.delete('/api/list/:id', (req, res) => {
  for (let repo of REPOS) {
    const listIndex = repo.lists.findIndex(list => list.id === req.params.id);
    if (listIndex >= 0) {
      repo.lists.splice(listIndex, 1);
      break;
    }
  }
  return res.status(204).send();
});

app.put('/api/list/:id', (req, res, next) => {
  const list = findList(req.params.id);
  if (!list) {
    const err = new Error('List not found');
    err.status = 404;
    return next(err);
  }
  const listSchema = Joi.object().keys({
    title: Joi.string().required(),
    id: Joi.string().required()
  });
  const { error: validationError } = Joi.validate(req.body, listSchema);
  if (validationError) {
    const err = new Error('Bad request');
    err.status = 400;
    return next(err);
  }
  if (req.params.id !== req.body.id) {
    const message = `Request path id (${req.params.id}) and request body id (${
      req.body.id
    }) must match`;
    const err = new Error(message);
    err.status = 400;
    return next(err);
  }
  list.title = req.body.title;
  return res.status(204).send();
});

app.get('/api/list/:id/card', (req, res, next) => {
  const list = findList(req.params.id);
  if (!list) {
    const err = new Error('List not found');
    err.status = 404;
    next(err);
  }
  res.json({ cards: list.cards });
});

function getCard(cardId, repos = REPOS) {
  let card = null;
  for (let repo of repos) {
    for (let list of repo.lists) {
      card = list.cards.find(card => card.id === cardId);
      if (card) {
        break;
      }
    }
  }
  return card;
}

app.get('/api/card/:id', (req, res, next) => {
  const card = getCard(req.params.id);
  if (!card) {
    const err = new Error('Card not found');
    err.status = 404;
    next(err);
  }
  res.json(card);
});

app.post('/api/list/:id/card', (req, res, next) => {
  const list = findList(req.params.id);
  if (!list) {
    const err = new Error('List not found');
    err.status = 404;
    next(err);
  }
  const cardSchema = Joi.object().keys({
    text: Joi.string().required()
  });
  const { error: validationError } = Joi.validate(req.body, cardSchema);
  if (validationError) {
    const err = new Error('Bad request');
    err.status = 400;
    next(err);
  }
  const card = makeCard(req.body.text);
  list.cards.push(card);
  res.status(201).json(card);
});

app.delete('/api/card/:id', (req, res) => {
  for (let repo of REPOS) {
    for (let list of repo.lists) {
      const cardIndex = list.cards.findIndex(card => card.id === req.params.id);
      if (cardIndex) {
        list.cards.splice(cardIndex, 1);
        break;
      }
    }
  }
  res.status(204).send();
});

app.put('/api/card/:id', (req, res, next) => {
  const cardSchema = Joi.object().keys({
    text: Joi.string().required(),
    id: Joi.string().required()
  });
  const { error: validationError } = Joi.validate(req.body, cardSchema);
  if (validationError) {
    const err = new Error('Bad request');
    err.status = 400;
    return next(err);
  }
  if (req.params.id !== req.body.id) {
    const message = `Request path id (${req.params.id}) and request body id (${
      req.body.id
    }) must match`;

    const err = new Error(message);
    err.status = 400;
    return next(err);
  }
  const card = getCard(req.params.id);
  if (!card) {
    const err = new Error('Card not found');
    err.status = 404;
    return next(err);
  }
  card.text = req.body.text;
  return res.status(204).send();
});

app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  return next(err);
});

// Catch-all Error handler
// Add NODE_ENV check to prevent stacktrace leak
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  return res.json({
    message: err.message,
    error: app.get('env') === 'development' ? err : {}
  });
});


app.listen(PORT, () =>
  console.log(`Your app is listening on port ${PORT}`)
);
