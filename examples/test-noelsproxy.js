
var noelsproxy = require ('../lib/noelsproxy')

var p = new noelsproxy (8080, 4000)
p.on ('onConnect', function () {
})
p.on ('onResponse', function (req, res, agent) {
	console.log ("<<<<<<<<<<<<<<<<<");
	res.on('data', function (d) {
		console.log (d);
	});

	req.pipe(agent);
})

p.on ('onRequest', function (req, res, cb) {

	//console.log ("Got req to =" + req.headers.host)

	// block googlevideo.com 
	//
	//
	
	//if ('x-youtube-ad-signals' in req.headers) {
	//	delete(req.headers['x-youtube-ad-signals'])
	//}

	if (req.url.match('state=playing')) {
		console.log (req.url)
		req.url += '&final=1'
		req.url = req.url.replace('state=playing', 'state=paused')
	}

	/*if (req.headers.host.match('googlevideo.com') || req.headers.host.match('youtube.com')) {
	        if (req.url.match('pagead') || 
			req.url.match('adunit') || 
			req.url.match('adhost') || 
			req.url.match('ads') || 
			req.url.match('---') ||
			req.url.match('ad_playback')) {
			//console.log ('->>>>>>>>>>>>>>>>>>>>>> blocking ' + req.url)
			cb.block(this, req, res)
		} else {
			//console.log ('->>>>>>>>>>>>>>>>>>>>>> allowing ' + req.url)
			//console.log (req.url);

			//console.log (req.headers)

			cb.continue(this, req, res)
		}
	} else {
		cb.continue(this, req, res)
	}*/
	cb.continue(this, req, res)
})

p.on ('error', function (err) {
	console.log ("Got a error", err)
})
