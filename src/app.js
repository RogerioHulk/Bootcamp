const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];     //====-- Memoria apenas  --====

//====-----------------------------------------------------------====
//====--  Middleware para testar validade do id do repository  --====
//====-----------------------------------------------------------====
function validateRepositoryId(request, response, next) {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repository ID.'})
  }
  return next();
}
app.use('/repositories/:id', validateRepositoryId);
//====--  Aplica-se apenas as rotas com formato específico  --====

//====--  Consulta  --====
app.get("/repositories", (request, response) => {
  return response.json( repositories );
});

//====--  Criação  --====
app.post("/repositories", (request, response) => {
  const body = request.body;
  const repository = {
    id: uuid(),
    title: body.title,
    url: body.url,
    techs: [ body.techs ],
    likes: 0
  }

  repositories.push(repository);
  return response.json( repository );
});

//====--  Alteração  --====
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const index = repositories.findIndex(item => item.id === id);
  if (index < 0) {
    return response.status(400).json({
      error: "Repository not found"
    })
  }
  var repository = repositories[index];
  const { likes } = repository;
  repository = { id, title, url, techs, likes }
  repositories[index] = repository;
  return response.json( repository )
});

//====--  Exclusão  --====
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(item => item.id === id);
  if (index < 0) {
    return response.status(400).json({
      error: "Repository not found"
    })
  }
  repositories.splice(index, 1);
  return response.status(204).send();
});

//====--  Incrementa os likes  --====
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(item => item.id === id);
  if (index < 0) {
    return response.status(400).json({
      error: "Repository not found"
    })
  }
  const repository = repositories[index]
  var { likes } = repository;
  likes++;
  repository.likes = likes;  
  repositories[index] = repository;
  return response.json( repository )
});

module.exports = app;
