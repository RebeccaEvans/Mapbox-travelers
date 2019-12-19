require('dotenv').config()
const express = require('express')
const db = require('../models')
const router = express.Router()
const mbxClient = require('@mapbox/mapbox-sdk')
const mbxGeocode = require('@mapbox/mapbox-sdk/services/geocoding')
const mb = mbxClient({ accessToken: process.env.API_KEY})
const geocode = mbxGeocode(mb)


router.get('/search', (req, res) => {
	res.render('/results')
})

router.get('/results', ((req, res) => {
	geocode.forwardGeocode({
		query: `${req.query.city}, ${req.query.state}`,
		type:  ['place'],
		countries: ['us']
	})
	.send()
	.then((result) => {
		let results = result.body.features.map( (result) => {
			return {
				name: result.place_name,
				lat: result.center[1],
				long: result.center[0]
			}
		})
		console.log(results)
		res.render('cities/results', {query: req.query, results})
	})
	.catch((err) => {
		console.log(err)
	})
}))

router.post('/add'), (req, res) => {
	db.geofun.findOrCreat({
		where: {
			name: req.body.name
		},
		defaults: {
			lat: req.body.lat,
			long: req.body.long
		}
	})
	.then(({city, created}) => {
		console.log(`${city.name} was ${created ? 'created' : 'found'}`)
		res.rendirect('/favorites')
	})
}

router.get('favorites', (req, res) => {
    db.place.findAll()
    .then ( (cities) => {
        res.render('cities/favorites', { cities: cities })
    })
})

module.exports = router