var express = require('express');
var app = express();
var environment = (process.env.NODE_ENV === undefined) ? 'development' : process.env.NODE_ENV;
var port = (process.env.NODE_PORT === undefined) ? 3001 : process.env.NODE_PORT;
var prerender_service_url = (process.env.PRERENDER_SERVICE_URL === undefined) ? 'prerender.io' : process.env.PRERENDER_SERVICE_URL;
var static_path = __dirname + '/dist/' + environment
var index_path = __dirname + '/dist/' + environment + '/index.html'

console.log('server starting with:');
console.log('NODE_ENV: ' + environment);
console.log('NODE_PORT: ' + port);
console.log('PRERENDER_SERVICE_URL: ' + prerender_service_url);
console.log('static_path: ' + static_path);
console.log('index_path: ' + index_path);

// Here we require the prerender middleware that will handle requests from Search Engine crawlers
// We set the token only if we're using the Prerender.io service
app.use(require('prerender-node').set('prerenderServiceUrl', prerender_service_url));
app.use(express.static(static_path));

// This will ensure that all routing is handed over to AngularJS
app.get('*', function(req, res){
  res.sendFile(index_path);
});

app.listen(port);
console.log("server has started on port " + port);
