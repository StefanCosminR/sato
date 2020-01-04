const http = require('http');
const url = require('url');
const querystring = require('querystring');
const urlMetadata = require('url-metadata');

function extractMetadataEndSend(url, res) {
    console.log('extracting metadata for', url);
    urlMetadata(url)
        .then(
            (metadata) => {
                try {
                    if (metadata.image === '') {
                        metadata.image = 'https://cdn2.iconfinder.com/data/icons/filled-icons/493/Search-512.png';
                        metadata['og:image'] = 'https://cdn2.iconfinder.com/data/icons/filled-icons/493/Search-512.png';
                        // metadata['og:image:secure_url'] = 'http://endlessicons.com/wp-content/uploads/2015/08/search-icon-2-614x460.png';
                        // metadata['og:width'] = 460;
                        // metadata['og:height'] = 460;
                    }
                    console.log('hai boss....', metadata);
                    const stringifiedBody = JSON.stringify(metadata);
                    res.setHeader('Content-Type', 'application/json');
                    res.write(stringifiedBody);
                } catch (e) {
                    res.statusCode = 500;
                    res.write("Could not stringify result from url-metadata " + e.description);
                }

                res.end();

            },
            (error) => {
                console.log('err', error);
                res.statusCode = 500;
                try {
                    res.write(JSON.stringify(error));
                } catch (e) {
                    res.write('Could not stringify error');
                }

                res.end();
            });
}

function base64ToString(data) {
    const buffer = Buffer.from(data, 'base64');
    return buffer.toString('utf8');
}

http
    .createServer((req, res) => {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin || req.headers.host);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', `Content-Type, Access-Control-Allow-Origin, User-Agent`);
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        if (req.method !== 'GET') {
            req.resume();
            res.statusCode = 405;
            res.end();
            return;
        }

        const {query} = url.parse(req.url);
        const parsedQuery = querystring.parse(query);

        if (!parsedQuery.url) {
            res.statusCode = 400;
            res.write('Missing "url" query parameter');
            res.end();
            return;
        }

        let urlToExtractMetadataFrom = null;
        try {
            urlToExtractMetadataFrom = base64ToString(parsedQuery.url);
        } catch (e) {
            res.statusCode = 400;
            res.write('Could not parse the submitted url');
            res.end();
            return;
        }

        extractMetadataEndSend(urlToExtractMetadataFrom, res);

    })
    .listen(3050);


