var expect = require('chai').expect,
  ApiClient = require('../client/api_client.js'),
  nock = require('nock'),
  createGovukNotifyToken = require('../client/authentication.js');


describe('api client', function () {

  it('should make a get request with correct jwt token', function (done) {

    var urlBase = 'https://api.notifications.service.gov.uk',
      path = '/email',
      body = {
        'body': 'body text'
      },
      serviceId = 'c745a8d8-b48a-4b0d-96e5-dbea0165ebd1',
      apiKeyId = '8b3aa916-ec82-434e-b0c5-d5d9b371d6a3';

    [
      new ApiClient(serviceId, apiKeyId),
      new ApiClient(urlBase, serviceId, apiKeyId),
      new ApiClient(urlBase, 'key_name' + '-' + serviceId + '-' + apiKeyId),
      new ApiClient('key_name' + ':' + serviceId + ':' + apiKeyId),
    ].forEach(function(client, index, clients) {

      nock(urlBase, {
        reqheaders: {
          'Authorization': 'Bearer ' + createGovukNotifyToken('GET', path, apiKeyId, serviceId)
        }
      })
        .get(path)
        .reply(200, body);

      client.get(path)
        .then(function (response) {
          expect(response.body).to.deep.equal(body);
          if (index == clients.length - 1) done();
      });

    });

  });

  it('should make a post request with correct jwt token', function (done) {

    var urlBase = 'http://base',
      path = '/email',
      data = {
        'data': 'qwjjs'
      },
      serviceId = 123,
      apiKeyId = 'SECRET',
      apiClient = new ApiClient(urlBase, serviceId, apiKeyId);


    nock(urlBase, {
      reqheaders: {
        'Authorization': 'Bearer ' + createGovukNotifyToken('POST', path, apiKeyId, serviceId)
      }
    })
      .post(path, data)
      .reply(200, {"hooray": "bkbbk"});

    apiClient = new ApiClient(urlBase, serviceId, apiKeyId);
    apiClient.post(path, data)
      .then(function (response) {
        expect(response.statusCode).to.equal(200);
        done();
    });
  });

});
