const http = require('http');
const rp = require('request-promise');
const url = require('url'); // built-in utility
const querystring = require('querystring');
const port = 3001;

const requestHandler = (request, response) => {
  const parsedUrl = url.parse(request.url)
  const pathname = parsedUrl.pathname;
  const queryParams = querystring.parse(parsedUrl.query);
  
  if(pathname === '/fetch_records') {
    const requestOptions = {
      method: 'GET',
      uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
      qs: {
        'start': '1',
        'convert': 'USD',
        ...queryParams,
      },
      headers: {
        'X-CMC_PRO_API_KEY': process.argv[2]
      },
      json: true,
      rejectUnauthorized: false,
    };

    response.setHeader('Content-Type', 'application/json');
    response.setHeader("Access-Control-Allow-Origin", "*");
    
    rp(requestOptions).then(res => {
      console.log('API call response:', res);
      response.end(JSON.stringify(res));
    }).catch((err) => {
      console.log('API call error:', err.message);
      response.end(JSON.stringify(error));
    });
  } else {
    response.end('Url not supported');
  }
}

if (process.argv.length <=2) {
  throw new Error('Require API Key');
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on ${port}`)
});
