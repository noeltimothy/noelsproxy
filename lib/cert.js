var fsAsync = require('fs');
var crypto = require('crypto')
var forge = require('node-forge')
var pki = forge.pki
var md = forge.md
var Promise = require('bluebird')
var moment = require('moment')

const async = Promise.coroutine;
const fs = Promise.promisifyAll(fsAsync);

const directory = './magical/';
const certFile = directory + 'ca.pem';
const pkFile = directory + 'ca.private.key';

var ca 
var privateKey 

const getCA = () => ca;
const getRandom = () => crypto.randomBytes(Math.ceil(16 / 2)).toString('hex').slice(0, 16).toUpperCase();
const keys = pki.rsa.generateKeyPair(2048);

var createDomainCert = async(function* (domain) {

	const csr = pki.createCertificationRequest();
	csr.publicKey = keys.publicKey;
	const attrs = [{
		name: 'commonName',
		value: domain
	}, {
		name: 'organizationName',
		value: 'Timsproxy CA'
	}, {
		name: 'countryName',
		value: 'US'
	}];
	csr.setSubject(attrs);
	csr.sign(keys.privateKey, md.sha256.create());

	if (ca == undefined) {
		ca = yield fs.readFileAsync(certFile);
	}

	if (privateKey == undefined) {
		privateKey = yield fs.readFileAsync(pkFile);
	}

	const caKey = pki.privateKeyFromPem(privateKey);
	const caCert = pki.certificateFromPem(ca);

	var newCert = pki.createCertificate();
	newCert.serialNumber = getRandom();
	newCert.validity.notBefore = new Date();

	const expiration = moment(newCert.validity.notBefore);
	expiration.add(360, 'days');
	newCert.validity.notAfter = expiration.toDate();
	newCert.setSubject(csr.subject.attributes);
	newCert.setIssuer(caCert.subject.attributes);
	newCert.publicKey = csr.publicKey;
	newCert.sign(caKey, md.sha256.create());

	const domainCert = pki.certificateToPem(newCert);
	const domainKey = pki.privateKeyToPem(keys.privateKey);

	result = yield Promise.resolve({key: domainKey, certificate: domainCert});
	return yield Promise.resolve(result);
});

module.exports  = {
	createDomainCert,
	getCA
}
