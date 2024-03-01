const http = require("http");
const fs = require("fs");
const url = require("url");

const slugify = require("slugify");

const replaceTemplate = require("./modules/replaceTemplate");

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  // writehead will be displayed in network tab
  // write and end will be displayed in the webpage

  // overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT-CARDS%}", cardsHtml);

    res.end(output);
  }
  // product page
  else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj.find((data) => data.id === +query.id);
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }
  // API
  else if (pathname === "/api") {
    res.writeHead(201, {
      "Content-type": "application/json",
    });
    res.end(data);
  }
  // Not found
  else {
    res.writeHead(400, {
      "Content-type": "text/html",
      "my-own-header": "Hello World!",
    });

    res.end("<h1>Page not found bro</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("listening to request on port 8000");
});
