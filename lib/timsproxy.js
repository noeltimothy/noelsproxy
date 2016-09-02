/*
 * Copyright (c) 2016 by Timothy Noel <tnoelhere@gmail.com>
 * MIT License. See mit-license.txt for more info.
 */

var https = require('https')
var http = require('http')
var net = require('net')
var fs = require('fs')
var tls = require('tls')
var cert = require ('./cert.js')
var url = require('url')
var events = require ('events')


var reqHandlers = []
function blockReq (obj, req, res) {
	res.end('Blocked')
}

reqHandlers.push ( function (serverObj, req, res) {

	if ((req.headers == undefined) || (req.url == undefined))  {
		// We need to signal a break here. This means we dont raise any event
		console.log ("BAD Request !!")
		return;
	}

	req.on('error', function(err) {
		serverObj.emit('error', err)
	});

	req.protocol = req.isSSL ? 'https:' : 'http:'

	var cb = {};
	cb.block = blockReq
	cb.continue = reqHandlers[1]
	serverObj.emit('onRequest', req, res, cb)
})

reqHandlers.push ( function (serverObj, req, res) {

	var parts = req.headers.host.split(':', 2);
	var options = {
		host : req.headers ? parts[0] : '',
		port : req.isSSL ? 443 : 80,
		path : url.parse(req.url).path, 
		headers: req.headers,
		method : req.method
	}

 	var agentRequestor = req.isSSL? https.request(options) : http.request(options)
	agentRequestor.on ('response', function (remoteRes) {

   		if (!remoteRes.headers.connection) {
      			remoteRes.headers.connection = req.headers.connection || 'keep-alive';
    		}	

		res.writeHead(remoteRes.statusCode, remoteRes.headers)
		remoteRes.pipe(res, {end:true})
	})

	agentRequestor.on ('error', function (err) {
		serverObj.emit('error', err)
	});

	req.pipe(agentRequestor);
})

var certCache = {};
var getSecureContext = function(hostname, keys) {
	return tls.createSecureContext({
		key: keys.key,
		cert: keys.certificate,
		ca: cert.getCA()
	});
};
var sniCallback = (hostname, cb) =>  cb(null, getSecureContext(hostname,certCache[hostname]));


function timsproxy (httpPort, httpsPort) {
	var self = this;
	this.junkiePort = httpsPort

	this.proxyserver = http.createServer (function (req, res) {
       		reqHandlers[0](self, req, res)
	}).listen(httpPort);

	cert.createDomainCert('localhost').then(function(keys) {
		certCache['localhost'] = keys;
		this.TLSjunkie = https.createServer ( {key: keys.key,
			cert: keys.cert, ca: cert.getCA(), SNICallback: sniCallback },
			function (clientReq, junkieResponse) {

				junkieResponse.setTimeout(10000);
				clientReq.isSSL = true;
				clientReq.on('error', function(err) {
					self.emit('error', err);
				});

       				reqHandlers[0](self, clientReq, junkieResponse)
			}

		).listen(httpsPort);
	})


	this.proxyserver.on ('connect', function (req, clientSock, head) {
		handleHttpConnect (self, req, clientSock, head);	
	})

}

function handleHttpConnect (serverObj, req, clientSock, head) {

      	var parts = req.url.split(':', 2);
      	var targetHost = parts[0];

	var relay = function () {
        	var connObj = net.connect(serverObj.junkiePort, '127.0.0.1', function () {
          		clientSock.setNoDelay();
          		clientSock.write("HTTP/1.1 200 OK\r\n\r\n");
			connObj.write(head)
			clientSock.pipe(connObj).pipe(clientSock)
        	});

        	clientSock.on('error', function (err) {
          		connObj.end();
			serverObj.emit('error', err)
        	});

        	connObj.on('error', function (err) {
          		clientSock.end();
			serverObj.emit('error', err)
        	});
	}

      	if (!certCache[targetHost]) {
        	cert.createDomainCert(targetHost).then(function (keys) {
          		certCache[targetHost] = keys;
          		relay();
        	});
      	} else {
        	relay();
      	}
	serverObj.emit ('onConnect', req)
}


timsproxy.prototype.__proto__ = events.EventEmitter.prototype;
module.exports = timsproxy
