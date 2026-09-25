const http = require('http');
// moodul päringu parsimiseks
const url = require('url');
// moodul failitee haldamiseks
const path = require('path');
// moodul failide haldamiseks, ASYNC puhul on vaja seda toetavat erilisemat moodulit
// const fs = require('fs');
const fs = require('fs').promises;
const pageHead = '<!DOCTYPE html>\n<html lang="et">\n<head>\n\t<meta charset="utf-8">\n\t<title>Karl Jakob Proso, veebiprogrammeerimine</title>\n</head>\n<body>\n';
const pageBody = '\t<h1>Karl Jakob Proso, veebiprogrammeerimine</h1>\n\t <p>See leht on loodud veebiprogrammeerimise kursusel <a href="https://www.tlu.ee">Tallinna Ülikoolis</a> ning ei sislda tõsiseltvõetavat sisu!</p>\n\t<p>Esialgu tutvusime lihtsalt HTML keelega, peatselt programmeerime.</p>\n\t<hr>';
const pageBanner = '<img src="veebiprogrammeerimine_2026_TA.png" alt ="banner">';
const pageFoot = '\n</body>\n</html>';
const dateET = require('./src/dateFindET');

http.createServer(async function(req, res) {
	// parsin url'i
	console.log('Päring: ' + req.url);
	let currentURL = url.parse(req.url, true);
	console.log('Parsituna: ' + currentURL.pathname)

	// hakkame erinevaid lehti jaotama -> routes (marsruudid)
	if(currentURL.pathname === '/') {
		res.writeHead(200, {"Content-type": "text/html"});
		res.write(pageHead);
		res.write(pageBanner);
		res.write(pageBody);
		res.write('<p>' + 'Täna on ' + dateET.currentDay() + ', ' + dateET.fullDate() + '</p>');
		res.write('<p>' + 'Veebileht avati kell: ' + dateET.fullTime() + '</p>');
		res.write('\n\t<ul>')
		res.write('\n\t\t<li><a href="/vanasona">Tänane vanasõna</a></li>');
		res.write('\n\t\t<li><a href="/kass">Kassi skript</a></li>');
		res.write('\n\t</ul>')
		res.write(pageFoot);
		//res.write('Veeb läkski käima!');
		return res.end();
	}

	else if (currentURL.pathname === '/vanasona') {
		res.writeHead(200, {"Content-type": "text/html"});
		res.write(pageHead);
		res.write(pageBanner);
		res.write('\t<h1>eesti vanasõnad</h1>\n\t<p>Siin näed tänase päeva vanasõna.</p>\n\t<hr>');

		// asünkroonne programmeerimine tekstifaili lugemisega
		try {
			const rawText = await fs.readFile('./txt/vanasonad.txt', 'utf8');
			let folkWisdom = rawText.split(';');
			let randomWisdom = folkWisdom[Math.floor(Math.random() * folkWisdom.length)];
			res.write('\t<p>' + randomWisdom + '</p>\n');
		} catch(err) {
			res.write('\t<p>Teksti ei leitud!</p>\n');
		}

		res.write('\n\t<p><a href="/">Avaleht</a></p>')
		res.write(pageFoot);
		//res.write('Veeb läkski käima!');
		return res.end();
	}

	else if (currentURL.pathname === '/kass') {
		res.writeHead(200, {"Content-type": "text/html"});
		res.write(pageHead);
		res.write(pageBanner);
		res.write('\n\t<script src="/oneko.js" data-cat="/oneko.gif"></script>');
		res.write('\n\t<p><a href="/">Avaleht</a></p>')
		res.write(pageFoot);
		return res.end();
	}

	else if (currentURL.pathname === '/oneko.js') {
		// teeme oneko.js faili brauserile kättesaadavaks (samas kaustas, mis www_3.js)
		let onekoScriptPath = path.join(__dirname, 'oneko.js');
		try {
			const data = await fs.readFile(onekoScriptPath);
				res.writeHead(200, {"Content-type": "application/javascript"})
				res.end(data);
		} catch(err) {
			res.writeHead(404, {"Content-type": "text/plain; charset=utf8"});
			return res.end('Skripti ei leitud!');
		}
	}

	else if (currentURL.pathname === '/oneko.gif') {
		// teeme oneko.gif pildi brauserile kättesaadavaks (kaustast gif/)
		let onekoGifPath = path.join(__dirname, 'gif', 'oneko.gif');
		try {
			const data = await fs.readFile(onekoGifPath);
				res.writeHead(200, {"Content-type": "image/gif"})
				res.end(data);
		} catch(err) {
			res.writeHead(404, {"Content-type": "text/plain; charset=utf8"});
			return res.end('Pilti ei leitud!');
		}
	}

	else if (currentURL.pathname === '/veebiprogrammeerimine_2026_TA.png') {
		// teeme pildi tegeliku asukoha programmile kättesaadavaks
		let picPath = path.join(__dirname, 'pic', currentURL.pathname);
		try {
			const data = await fs.readFile(picPath);
				res.writeHead(200, {"Content-type": "image/png"})
				res.end(data);
		} catch(err) {
			res.writeHead(404, {"Content-type": "text/plain; charset=utf8"});
			return res.end('Pilti ei leitud!');
		}
	}

	else {
		res.end('Viga 404, ei leia sellist lehte!');
	}

}).listen(5117);
