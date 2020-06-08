// Import express
var express = require('express')
//Import Body Parser
var bodyParser = require('body-parser');

var cors = require('cors');
// Initialize the server express
var app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(bodyParser.urlencoded({extended: false}));

require('dotenv').config()

//Conexión con MongoDB Atlas 
var urlBD = "mongodb+srv://"+process.env.MONGODB_USERNAME+":"+process.env.MONGODB_PASSWORD+"@"+process.env.MONGODB_DATABASE+"?retryWrites=true&w=majority";

//opciones conexion
var opts = {useNewUrlParser : true, connectTimeoutMS:20000};
//importo driver
var mongoose = require('mongoose');
//Pruebo conexion
mongoose.connect(urlBD,opts).then
(
    () => {
            console.log("Conectado!");
          }, //se conecto
    err => { 
            console.log("ERROR: " + err); 
           } //manejo error
);

// Import router
var apiRoutes = require("./api-routes")


// Todo lo que recibe la app se tratara como json
app.use(bodyParser.urlencoded(
{
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());

// Setup server port
var port = process.env.PORT || 8080;

// Send message for default URL
app.get('/', (req, res) => res.send('Hello World with Express - Aplicaciones Distribuídas'));

// Use Api routes in the App
app.use('/mri-api', apiRoutes);

// Launch app to listen to specified port
app.listen(port, function () {
     console.log("Running Reactflix backend on port " + port);
});

