const dataUriToBuffer = require('data-uri-to-buffer');
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require('path');
const home = path.dirname(require.main.filename);
console.log(home);

const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({limit: "50mb", extended: true}));

const PORT = 3000;

class Upload
{
	constructor(file)
	{
		this.uuid = uuidv1();
		this.name = file.name
		this.path = `views/files/${this.uuid}/`;
		// this.name = file.name;
		this.data = dataUriToBuffer(file.data);
		// data: dataUriToBuffer(this.data).toString()
	}
	save()
	{
		fs.mkdirSync(this.path);
		fs.writeFileSync(this.path + this.name, this.data);
	}
}

app.get("/files/*", (req, res) =>
{
	let path = home + "\/views" + req.originalUrl;
	console.log(path);
	// res.send("files\12869a40-8153-11e8-b748-87827fa354e1");
	fs.readdirSync(path).forEach(file =>
	{
		res.sendFile(path + "\/" + file);
	});
	// res.sendFile();
});
app.get("/", (req, res) =>
{
	res.render("index");
});
app.get("/list", (req, res) =>
{
	res.render("list");
});
app.post("/get", (req, res) =>
{
	let path = home + "\/views\/files";
	let end = [];
	console.log("hey");

	fs.readdirSync(path).forEach(fold =>
	{
		fs.readdirSync(path + "\/" + fold).forEach(file =>
		{
			console.log(path + "\/" + fold + "\/" + file);
			// res.sendFile(path + "\/" + file);
			end.push(path + "\/" + fold + "\/" + file);
		});
	});
	console.log(end);
	res.send(end);
});
app.post("/send", (req, res) =>
{
	let file = new Upload(req.body.f);
	file.save();
	console.log(file);
});

app.listen(PORT, () =>
{
	console.log("hey");
});