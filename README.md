# intermediate_nodejs_server

An intermediate Node.js server to make CORS requests with Tailscale networking.

This repository contains two main components:

1. **Intermediate Server**: A simple Express server project that gets requests (json files from other servers that need specific headers) from external clients and returns the result.
2. **Tailscale Service**: A Tailscale client that creates a secure network connection when deployed to Balena, allowing remote access to your server.

The Express server is usually referred to as an intermediate server.

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

1. Clone project

```bash
$ git clone https://github.com/Temeteron/intermediate-nodejs-server.git
```

2. Customize server, start with:

```bash
$ nvm use 12
$ npm run start
```

3. Deploy

Create an `.env` file in the root directory of the project with the following content:

```env
# your balena project name
PROJECT_NAME=${profile_name/project_name}
```

You can deploy your server to GCP or any other site you prefer. You can also deploy your server to a Raspberry Pi, if you have one. This can be done easily if you use [Balena](https://balena.io).
You can find a full tutorial about balena [here](https://www.balena.io/docs/learn/getting-started/raspberrypi3/nodejs/).

### Balena Deployment with Tailscale

When deploying to Balena, this project includes a Tailscale service that allows secure remote access to your intermediate server. The deployment includes:

- **Node.js Express Server**: The main intermediate server for handling CORS requests
- **Tailscale Client**: Provides secure networking and remote access capabilities

#### Required Environment Variables for Balena

Set these variables in your Balena dashboard:

```env
# Tailscale authentication key (get from https://login.tailscale.com/admin/settings/keys)
TS_AUTHKEY=tskey-auth-xxxxxxxxxxxxxxxx

# Optional: Custom hostname for your device
TS_HOSTNAME=my-intermediate-server

# Scan for subnet routes (192.168.1.0/24)
TS_ROUTES=192.168.1.0/24

# To accept routes from other devices (usually not needed)
TS_ACCEPT_ROUTES=true
```

After deployment, your intermediate server will be accessible via:

- Local network (if connected to same WiFi)
- Tailscale network (from any device connected to your Tailscale account)

```shell
$ npm run deploy
```

### Test tailscale speed

#### Server upload speed

Command

```bash
# Upload 5Mb from server to client
-c ${server-ip-address} -i 5 -n 5000.00k -4 -R
```

Result (`3.58 Mbps, depends on server's upload speed`)

```bash
[ ID] Interval           Transfer     Bitrate         Retr  Cwnd
[  5]   0.00-1.00   sec  5.00 MBytes  41.9 Mbits/sec    0   1.12 MBytes
[  5]   1.00-2.00   sec  0.00 Bytes  0.00 bits/sec    0   1.12 MBytes
[  5]   2.00-3.00   sec  0.00 Bytes  0.00 bits/sec    0   1.12 MBytes
[  5]   3.00-4.00   sec  0.00 Bytes  0.00 bits/sec    0   1.12 MBytes
[  5]   4.00-5.00   sec  0.00 Bytes  0.00 bits/sec    0   1.12 MBytes
[  5]   5.00-6.00   sec  0.00 Bytes  0.00 bits/sec    0   1.12 MBytes
[  5]   6.00-7.00   sec  0.00 Bytes  0.00 bits/sec    0   1.12 MBytes
[  5]   7.00-8.00   sec  0.00 Bytes  0.00 bits/sec    0   1.12 MBytes
[  5]   8.00-9.00   sec  0.00 Bytes  0.00 bits/sec    0   1.12 MBytes
[  5]   9.00-10.00  sec  0.00 Bytes  0.00 bits/sec    0   1.12 MBytes
[  5]  10.00-11.00  sec  0.00 Bytes  0.00 bits/sec    0   1.12 MBytes
[  5]  11.00-11.73  sec  0.00 Bytes  0.00 bits/sec    0   1.12 MBytes
- - - - - - - - - - - - - - - - - - - - - - - - -
[ ID] Interval           Transfer     Bitrate         Retr
[  5]   0.00-11.73  sec  5.00 MBytes  3.58 Mbits/sec    0             sender
```

#### Client upload speed (server download speed)

```bash
# Upload 5Mb from client to server (server downloads the file)
-c ${server-ip-address} -i 5 -n 5000.00k -4
```

Result (`14.7 Mbps, depends on client's upload speed`)

```bash
[ ID] Interval           Transfer     Bitrate
[  5]   0.00-1.00   sec  1.21 MBytes  10.1 Mbits/sec
[  5]   1.00-2.00   sec  2.29 MBytes  19.2 Mbits/sec
[  5]   2.00-2.04   sec  77.9 KBytes  17.4 Mbits/sec
- - - - - - - - - - - - - - - - - - - - - - - - -
[ ID] Interval           Transfer     Bitrate
[  5]   0.00-2.04   sec  3.57 MBytes  14.7 Mbits/sec                  receiver
```
