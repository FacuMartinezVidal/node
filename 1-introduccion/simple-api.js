const fs = require('fs');
const http = require('http');
const url = require('url');
const slugs = data_object.map((el) => slugify(el.productName, { lower: true }));
const slugify = require('slugify');

const replaceTemplate = require('./module/replaceTemplate.js');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/template/card.html`, 'utf-8');
const tempProduct = fs.readFileSync(
	`${__dirname}/template/product.html`,
	'utf-8'
);

const tempOverview = fs.readFileSync(
	`${__dirname}/template/overview.html`,
	'utf-8'
);

const data_object = JSON.parse(data);
console.log(slugify('Fresh Avocados', { lower: true }));
const server = http.createServer((req, res) => {
	const { query, pathname } = url.parse(req.url, true);
	//overivew page
	if (pathname === '/' || pathname === '/overview') {
		const cardsHtml = data_object
			.map((el) => replaceTemplate(tempCard, el))
			.join('');
		const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
		res.end(output);

		//product page
	} else if (pathname === '/product') {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		const product = data_object[query.id];
		const output = replaceTemplate(tempProduct, product);
		res.end(output);

		//api page
	} else if (pathname === '/api') {
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(data);

		//not found
	} else {
		res.writeHead(404, {
			'Content-type': 'text/html',
			'my-own-header': 'hello-world',
		});
		res.end('<h1>page not found</h1>');
	}
});

// Corrige la dirección IP a '127.0.0.1'
server.listen(8000, '127.0.0.1', () => {
	console.log('escuchando request en el puerto 8000');
});
