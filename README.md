# noelsproxy
A lightning fast and feather-lite HTTP/S proxy 

-------------

noelsproxy is a completely free and open-source HTTP/S proxy built in Node.js with the intention
to be the world's fastest and light-weight proxy possible.

# Key Features
<ul> 
<li> Supports HTTP and HTTPS</li>
<li> Uses minimum Network resources</li>
<li> Creates certificates on the fly and caches them</li>
<li> Built asynchronously for best performance</li>
<li> Provides Request/Response handlers</li>
</ul>

# Some great Use Cases
<ul> 
<li> Filter requests based on URLs </li>
<li> Filter responses based on response types </li>
<li> Record browsing history </li>
<li> Automatically add Safe Search options to interested sites </li>
<li> Filter ads from web pages </li>
<li> Filter sexually explicit content </li>
<li> Implement your own content scraping to check if web services are compromised </li>
<li> Endless list of possibilities </li>
</ul>

# Internals
noelsproxy works like most well known proxies such as Squid, Fiddler, Charles Proxy, etc.
You can setup timsproxy between a client and Server to intercept both requests and responses.
You can also intercept HTTP connects before a HTTPS connection starts.

# Install
```js
npm install noelsproxy
var noelsproxy = require('noelsproxy')
```
require just returns a namespace.

# Create an instance
noelsproxy runs two servers, one is a http server and another is a https server.
Users need to provide two separate ports on which these servers run. The first argument is
the port to be used for the HTTP server and the second argument is for the HTTPS server.
All clients only need to change their browser settings to pass traffic to the HTTP server.
```js
// HTTP listens on 1000 and HTTPS listens on 4000. Both listen on 127.0.0.1
// Client browsers pass all traffic to '127.0.0.1:1000'. The port number 4000 is used
// internally
var myProxy = new noelsproxy (1000, 4000) 
```

# Intercepting requests
A great use case here is to enforce safesearch on google. Hitting google images with a wrong search keyword can reveal adult and inappropriate content. This is bad for schools, educational institutions, NGO's and organizations that wish to follow ethical browsing standards.

An easy way to do this, is to use google's safeseach url parameter "&safe=active" and add this to every search request.
After request handling, the request can be continued or blocked using the third parameter cb.
Use cb.continue (this, req, res) to continue and cb.block(this, req, res) to send 'Blocked' to the browser.

```js
myProxy.on ('onRequest', function (req, res, cb) {
  var self = this;
  if (req.headers.host.match ('google.com') && (req.url != '/') ) {
    req.url += "&safe=active";
  }
  cb.continue(self, req, res)
}
```

More super examples to come


