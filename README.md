# intermediate_nodejs_server
An intermediate nodejs server to make CORS requests.

This is a simple Express server project that gets requests (json files from other servers that need specific headers) from external clients and returns the result.

It is usually referred as intermediate server.

A use case scenario is that you have created an only client web app and you need to make requests to outside servers that need some headers. Because you have only a client side you can't do those requests by yourself. Thus, you need an intermediate server.

### Example
You need to get the basic details of a package that is published to npm. You can get this by the following link.

[http://registry.npmjs.org/localforage/latest](http://registry.npmjs.org/localforage/latest)

This request requires [CORS Preflight](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS), which can only be done by servers.

The solution to this problem is to use an intermediate server.

With the code on this repository you can create and deploy a node server to serve this purpose.

Thus, after the deployment your client can take the needed data with the following link:

"http://my_intermediate_server.com/http://registry.npmjs.org/localforage/latest"

### Get started

1) Clone project

```bash
$ git clone https://github.com/Temeteron/intermediate-nodejs-server.git
```

2) Customize server, start with:

```bash
$ npm run start
```

3) Deploy

You can deploy your server to GCP or any other site you prefer. You can also deploy your server to a Raspberry Pi, if you have one. This can be done easily if you use [Balena](https://balena.io).

You can find a full tutorial about balena [here](https://www.balena.io/docs/learn/getting-started/raspberrypi3/nodejs/).

