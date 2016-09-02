# timsproxy
A lightning fast and feather-lite HTTP/S proxy 

-------------

timsproxy is a completely free and open-source HTTP/S proxy built in Node.js with the intention
to be the world's fastest and light-weight proxy possible.

# Key Features
Supports HTTP and HTTPS
Uses minimum Network resources
Creates certificates on the fly and caches them
Built asynchronously for best performance
Provides Request/Response handlers

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
timsproxy works like most well known proxies such as Squid, Fiddler, Charles Proxy, etc.
You can setup timsproxy between a client and Server to intercept both requests and responses.
You can also intercept HTTP connects before a HTTPS connection starts.

# Install
```js
npm install timsproxy
var timsproxy = require('timsproxy')
```
require just returns a namespace.

# Create an instance
timsproxy runs two servers, one is a http server and another is a https server.
Users need to provide two separate ports on which these servers run. The first argument is
the port to be used for the HTTP server and the second argument is for the HTTPS server.
All clients only need to change their browser settings to pass traffic to the HTTP server.
```js
// HTTP listens on 1000 and HTTPS listens on 4000. Both listen on 127.0.0.1
// Client browsers pass all traffic to '127.0.0.1:1000'. The port number 4000 is used
// internally
var myProxy = new timsproxy (1000, 4000) 
```

More super examples to come


