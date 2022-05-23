const PORT = process.env.PORT || 3001;
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get("/api/notes", (req, res) => {
	let data = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
	res.json(data);
});

app.get('/notes', function(req, res) {
	res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname, './public/index.html'));
});

app.post("/api/notes", (req, res) => {
	var Note_toadd = req.body;
	Note_toadd.id = uuidv4();

	let data = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));

	data.push(Note_toadd);
	
	fs.writeFileSync('./db/db.json', JSON.stringify(data), function (err){
        if (err) {throw err} else {console.log("New note added")}
    });
	
	res.json(data);
});

app.delete("/api/notes/:id", (req, res) => {

	let note_id = String(req.params.id);
	
	let data = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));

    for (let i = 0; i < data.length; i++){
        if ((String(data[i].id)) === note_id) {data.splice(i,1)}
    }

	fs.writeFileSync('./db/db.json', JSON.stringify(data), function (err) {
        if (err) {throw err} else {console.log("Note was deleted")}
    });

	res.json(true);
});

app.listen(PORT, () => {
    console.log("Server is listening on Port: " + PORT);
});