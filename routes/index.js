const express = require('express');
const router = express.Router();

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
			let a = results[0].query.users[0];
			let b = results[1].query.usercontribs;
			console.log(JSON.stringify({ user: a, contributions: b }));
			res.render('results', { user: a, contributions: b });
		})
		.catch(function(err) {
			console.log(err);
		});
});

module.exports = router;
