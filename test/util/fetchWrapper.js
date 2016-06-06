require('../../lib/util/tests');
const http = require('http');
const url = require('url');
const fetchWrapper = require('../../lib/util/fetchWrapper');

describe('fetchWrapper', () => {
  let server;
  const PORT = process.env.PORT || 8181;
  before(done => {
    server = http.createServer((request, response) => {
      const { headers } = request;
      const { pathname, query } = url.parse(request.url, true);

      const responseContentType = /json/.test(headers['content-type'])
        ? 'application/vnd.api+json'
        : 'text/plain';
      const responseHeaders = { 'Content-Type': responseContentType };

      switch (pathname) {
        case '/api/400':
          response.writeHead(400, responseHeaders);
          response.end(JSON.stringify({
            errors: [
              {
                status: 400,
                source: { pointer: '/query/page/number' },
                title: 'Invalid value',
              },
            ],
          }));
          break;
        case '/api/404':
          response.writeHead(404, responseHeaders);
          response.end(JSON.stringify({
            errors: [
              {
                status: 404,
                title: 'Not Found',
              },
            ],
          }));
          break;
        case '/api/500':
          response.writeHead(500, responseHeaders);
          response.end(JSON.stringify({
            errors: [
              {
                status: 500,
                title: 'Unexpected',
              },
            ],
          }));
          break;
        case '/api/html':
          response.writeHead(500, responseHeaders);
          response.end('<!doctype html><html><body>500 - Unexpected</body></html>');
          break;
        case '/api/200':
          response.writeHead(200, responseHeaders);
          response.end(JSON.stringify({
            meta: {
              total: 2,
            },
            data: [
              { foo: 'bar' },
              { foo: 'foobar' },
            ],
          }));
          break;
        case '/api/200/empty':
          response.writeHead(200, responseHeaders);
          response.end(JSON.stringify({
            meta: {
              total: 0,
            },
            data: [],
          }));
          break;
        case '/api/200/params': {
          const code = (query['page[number]'] !== '1'
          || query['page[size]'] !== '10'
          || query['filter[category]'] !== 'movie')
            ? 418
            : 200;
          response.writeHead(code, responseHeaders);
          response.end(JSON.stringify({
            meta: {
              total: 0,
            },
          }));
          break;
        }
        default:
          // something goes wrong, we need to return an impossible HTTP code
          response.writeHead(418, responseHeaders);
          response.end(JSON.stringify({}));
          break;
      }
    });
    server.listen(PORT, done);
  });
  after(done => {
    server.close(done);
  });

  it('200', (done) => {
    fetchWrapper(`http://localhost:${PORT}/api/200`)
      .then(response => {
        response.should.be.an('object');
        response.status.should.equal(200);
        response.should.have.property('meta').that.have.property('total', 2);
        response.should.have.property('data').that.be.an('array').that.have.a.lengthOf(2);
        response.should.not.have.property('error');
      })
      .then(done)
      .catch(done);
  });
  it('200 (empty)', (done) => {
    fetchWrapper(`http://localhost:${PORT}/api/200/empty`)
      .then(response => {
        response.should.be.an('object');
        response.status.should.equal(200);
        response.should.have.property('meta').that.have.property('total', 0);
        response.should.have.property('data').that.be.an('array').that.have.a.lengthOf(0);
        response.should.not.have.property('error');
      })
      .then(done)
      .catch(done);
  });
  it('200 (params)', (done) => {
    fetchWrapper(`http://localhost:${PORT}/api/200/params`, {
      page: {
        number: 1,
        size: 10,
      },
      filter: {
        category: 'movie',
      },
    })
      .then(response => {
        response.should.be.an('object');
        response.status.should.equal(200);
        response.should.have.property('meta').that.have.property('total', 0);
        response.should.not.have.property('error');
      })
      .then(done)
      .catch(done);
  });
  it('404', (done) => {
    fetchWrapper(`http://localhost:${PORT}/api/404`)
      .then(response => {
        response.should.be.an('object');
        response.status.should.equal(404);
        response.should.not.have.property('data');
        response.should.not.have.property('meta');
        response.should.have.property('error').that.has.properties({
          status: 404,
          title: 'Not Found',
        });
      })
      .then(done)
      .catch(done);
  });
  it('400', (done) => {
    fetchWrapper(`http://localhost:${PORT}/api/400`)
      .then(response => {
        response.should.be.an('object');
        response.status.should.equal(400);
        response.should.not.have.property('data');
        response.should.not.have.property('meta');
        response.should.have.property('error').that.has.properties({
          status: 400,
          title: 'Invalid value',
          source: {
            pointer: '/query/page/number',
          },
        });
      })
      .then(done)
      .catch(done);
  });
  it('500', (done) => {
    fetchWrapper(`http://localhost:${PORT}/api/500`)
      .then(response => {
        response.should.be.an('object');
        response.status.should.equal(500);
        response.should.not.have.property('data');
        response.should.not.have.property('meta');
        response.should.have.property('error').that.has.properties({
          status: 500,
          title: 'Unexpected',
        });
      })
      .then(done)
      .catch(done);
  });
  it('HTML response', (done) => {
    fetchWrapper(`http://localhost:${PORT}/api/html`)
      .then(() => done(new Error('Then should not be called in this particular case')))
      .catch(() => done());
  });
});
