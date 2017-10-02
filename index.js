var express = require ("express");
var mysql = require("mysql");

var bodyParser = require("body-parser");
var program = require("commander");
var compression = require("compression");
var mode = "prod";
var env = "cloud";
/**
 * node.js fs module for accessing system file storage
 * @type {module}
 */
var fs = require("fs");

/**
 * node.js mysql module for connecting to mysql databases
 * @type {module}
 */
var mysql = require("mysql");

/**
 * node.js request module for making HTTP requests
 * @type {module}
 */
var request = require("request");

program
	.version(require('./package.json')['version'])
	.option('-d, --debug', 'run in debug mode')
	.option('-l, --local', 'run in local environment')
	.option('-p, --port [value]', 'specify the port number')
	.option('-c, --config [src]', 'specify config options')
	.parse(process.argv);

if((!program.port) || program.port==""){
	console.log("Please provide the port number")
	console.log("Syntax: node --port <port number>")
	return
}
if(program.debug)
	mode = "debug";
if(program.local)
	env = "local";

var port = program.port;
var config = require(program.config);

var app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, appID, empID, version, token");
  next();
});
app.use(bodyParser.urlencoded({ "limit":"50mb",extended: true }))
app.use(compression()); //compressing payload on every request

/**
 * configuration options for mysql pooling
 * @type {Object}
 */
var poolConfig = {
	connectionLimit: 20,
	user: config["db"]["write"]["user"],
	password: config["db"]["write"]["password"],
	database: config["db"]["write"]["name"],
	debug: false,
	connectTimeout: 120000 ,
	timeout: 120000
};
	poolConfig["host"] =  config["db"]["write"]["host"];

var connectionPool = mysql.createPool(poolConfig);

var settings = {
	config: config,
	app: app,
	mode: mode,
	user:poolConfig.user,
	env: env,
	connectionPool: connectionPool,
	request: request
}

require(__dirname+"/routes/imageData.js")(settings);

app.listen(port);
