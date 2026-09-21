const http = require('http');
const pageHead = '<!DOCTYPE html>\n<html lang="et">\n<head>\n\t<meta charset="utf-8">\n\t<title>Karl Jakob Proso, veevbiprogrammeerimine</title>\n</head>\n<body>\n';
const pageBody = '\t<h1>Karl Jakob Proso, veebiprogrammeerimine</h1>\n\t <p>See leht on loodud veebiprogrammeerimise kursusel <a href="https://www.tlu.ee">Tallinna Ülikoolis</a> ning ei sislda tõsiseltvõetavat sisu!</p>\n\t<p>Esialgu tutvusime lihtsalt HTML keelega, peatselt programmeerime.</p>\n\t<hr>';
const pageFoot = '\n</body>\n</html>';
const dateET = require('./src/dateFindET');

http.createServer(function(req, res) {
	res.writeHead(200, {"Content-type": "text/html"});
	res.write(pageHead);
	res.write(pageBody);
	res.write('<p>' + 'Täna on ' + dateET.currentDay() + ', ' + dateET.fullDate() + '</p>');
	res.write('<p>' + 'Veebileht avati kell: ' + dateET.fullTime() + '</p>');
	res.write(pageFoot);
	//res.write('Veeb läkski käima!');
	return res.end();
}).listen(5117);
