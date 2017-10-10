const express = require('express');
const router = express.Router();
const fetch = require('isomorphic-fetch');
const format = require('date-fns/format');

router.get('/', function(req, res, next) {
	res.render('index');
});

router.get('/results', function(req, res) {
	const username = req.query.search;
	const url1 = `https://en.wikipedia.org/w/api.php?action=query&list=users&usprop=editcount|groups|registration&ususers=${username}&format=json`;
	const url2 = `https://en.wikipedia.org/w/api.php?action=query&list=usercontribs&uclimit=3&ucprop=ids|title|timestamp|size&ucuser=${username}&format=json`;

	Promise.all(
		[url1, url2].map(function(url) {
			return fetch(url);
		})
	)
	.then(function(results) {
		return Promise.all(results.map(res => res.json()));
	})
	.then(function(results) {
		const user = results[0].query.users[0];
		const contributions = results[1].query.usercontribs;

		if (user && user.missing === '') {
			return res.render('error', {
				message: 'User not found',
				error: {},
			});
		}

		user.registrationFormatted = '';
		if (user.registration) {
			user.registrationFormatted = format(user.registration, 'DD/MM/YY HH:mm');
		}

		res.render('results', {user, contributions});
	})
	.catch(function(err) {
		res.render('error', { message: err.message, error: {} });
	});
});

module.exports = router;
