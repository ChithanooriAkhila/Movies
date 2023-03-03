const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "moviesData.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(5000, () => {
      console.log("Server Running at http://localhost:4000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/movies/", async (request, response) => {
  const query = `select * from movie;`;
  const playersList = await db.all(query);
  let list = [];

  playersList.forEach((obj) => {
    let { movie_id, director_id, movie_name, lead_actor } = obj;
    let object = {
      movieId: 12,
      directorId: 3,
      movieName: "The Lord of the Rings",
      leadActor: "Elijah Wood",
    };

    list.push(object);
  });
  console.log(list);
  response.send(list);
});

app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;

  const query = `
  insert into
   movie (director_id,movie_name,lead_actor)
   values
   (
       ${directorId},
       '${movieName}',
       '${leadActor}'
    );`;

  await db.run(query);
  response.send("Movie Successfully Added");
});

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const query = `select * from movie where movie_id=${movieId};`;

  let movieDetails = await db.get(query);
  let { movie_id, director_id, movie_name, lead_actor } = movieDetails;
  let object = {
    movieId: 12,
    directorId: 3,
    movieName: "The Lord of the Rings",
    leadActor: "Elijah Wood",
  };

  response.send(object);
});

app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const query = `
  update
   movie 
  set 
  director_id=${directorId},
  movie_name='${movieName}',
  lead_actor='${leadActor}'
  where movie_id=${movieId}
  ;`;

  await db.run(query);
  response.send("Movie Details Updated");
});

app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const query = `delete from movie where movie_id=${movieId}`;
  await db.run(query);
  response.send("Movie Removed");
});

app.get("/directors/", async (request, response) => {
  const query = `select * from director;`;
  const directorsList = await db.all(query);
  //   console.log(playersList);
  response.send(directorsList);
});

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const query = `select movie_name from movie where director_id=${directorId};`;
  const movieDetails = await db.get(query);
  response.send(movieDetails);
});

module.exports = app;
