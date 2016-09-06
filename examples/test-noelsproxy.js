
var noelsproxy = require ('../lib/noelsproxy')

var p = new noelsproxy (1000, 4000)
p.on ('onConnect', function () {
})
p.on ('onResponse', function (res) {
})

p.on ('onRequest', function (req, res, cb) {

	console.log ("Got req to =" + req.headers.host)

	// test google safesearch enforcement
	if (req.headers.host.match('google.com')) {
		req.url += '&safe=active'
	}

	// test blocking of yahoo.com
	if (req.headers.host.match('yahoo.com')) {
		console.log ("setting state to block for yahoo.com")
		cb.block(this, req, res)
	} else {
		cb.continue(this, req, res)
	}
})

p.on ('error', function (err) {
	console.log ("Got a error", err)
})
