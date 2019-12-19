let express = require('express')
let app = express()
let layouts = require('express-ejs-layouts')


app.use(layouts);
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static("static"));
app.use(express.static('assets'))

app.get('/search', ((req, res) =>{
	res.render('cities/search')
}))

app.get('/', ((req, res) =>{
	res.render('home')
}))

app.use('/', require('./routes/cities'))


app.listen(process.env.PORT || 8000, console.log('🎧 Port 8000 🎧'))