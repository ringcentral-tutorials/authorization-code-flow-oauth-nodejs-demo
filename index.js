var path = require('path')
var app = require('express')();

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
var session = require('express-session');
app.use(session({ secret: 'this-is-a-secret-token', tokens: ''}));
const port = 5000
app.listen(port, () => console.log('Listening on port ' + port));

var ringcentral = require('ringcentral');
var rcsdk = null

app.get('/', function (req, res) {
    res.render('index')
})
app.get('/index', function (req, res) {
    res.redirect('/')
});

app.get('/login', function (req, res) {
    if (req.query.env == "sandbox") {
        require('dotenv').config({path: "./environment/.env-sandbox"})
    } else {
        require('dotenv').config({path: "./environment/.env-production"})
    }
    rcsdk = new ringcentral({
      server: process.env.RC_SERVER_URL,
      appKey: process.env.RC_CLIENT_ID,
      appSecret: process.env.RC_CLIENT_SECRET
    });
    var platform = rcsdk.platform()
    var authorize_uri = platform.authUrl({
        brandId: '',
        redirectUri: process.env.RC_REDIRECT_URL
        });
    res.render('login', {
        authorize_uri: authorize_uri,
        redirect_uri: process.env.RC_REDIRECT_URL
        });
})

app.get('/oauth2callback', function(req, res) {
  if (req.query.code) {
      var platform = rcsdk.platform()
      platform.login({
          code: req.query.code,
          redirectUri: process.env.RC_REDIRECT_URL
      })
      .then(function (token) {
          req.session.tokens = token.json()
          res.send('login success');
      })
      .catch(function (e) {
          res.send('Login error ' + e);
      });
  }else {
      res.send('No Auth code');
  }
});

app.get('/logout', function(req, res) {
  if (req.session.tokens != undefined){
      var tokensObj = req.session.tokens
      var platform = rcsdk.platform()
      platform.auth().setData(tokensObj)
      if (platform.loggedIn()){
          platform.logout()
          .then(function(resp){
              console.log("logged out")
          })
          .catch(function(e){
              console.log(e)
          });
      }
      req.session.tokens = null
  }
  res.redirect("/")
});

app.get('/test', function(req, res) {
  if (req.session.tokens != undefined){
      var tokensObj = req.session.tokens
      var platform = rcsdk.platform()
      platform.auth().setData(tokensObj)
      if (platform.loggedIn()){
          if (req.query.api == "extension"){
            var endpoint = "/restapi/v1.0/account/~/extension";
            return callGetMethod(platform, endpoint, res)
          }else if (req.query.api == "extension-call-log"){
            var endpoint = "/restapi/v1.0/account/~/extension/~/call-log";
            return callGetMethod(platform, endpoint, res)
          }if (req.query.api == "account-call-log"){
            var endpoint = "/restapi/v1.0/account/~/call-log";
            return callGetMethod(platform, endpoint, res)
          }else {
            return res.render('test')
          }
      }
  }
  res.redirect("/")
});

function callGetMethod(platform, endpoint, res){
    platform.get(endpoint)
    .then(function(resp){
        res.send(JSON.stringify(resp.json()))
    })
    .catch(function(e){
        res.send("Error")
    })
}
