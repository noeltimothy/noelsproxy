var crypto = require('crypto')
var forge = require('node-forge')
var pki = forge.pki
var md = forge.md
var Promise = require('bluebird')
var moment = require('moment')

const async = Promise.coroutine;

var ca = '-----BEGIN CERTIFICATE-----\n'+
'MIIEQDCCAyigAwIBAgIQA+jpXV5NF6eUKScj+Y/KszANBgkqhkiG9w0BAQsFADB9\n'+
'MRgwFgYDVQQDEw9Ob2RlTUlUTVByb3h5Q0ExETAPBgNVBAYTCEludGVybmV0MREw\n'+
'DwYDVQQIEwhJbnRlcm5ldDERMA8GA1UEBxMISW50ZXJuZXQxGzAZBgNVBAoTEk5v\n'+
'ZGUgTUlUTSBQcm94eSBDQTELMAkGA1UECxMCQ0EwHhcNMTYwMjE3MDYyNTAwWhcN\n'+
'MjYwMjE3MDYyNTAwWjB9MRgwFgYDVQQDEw9Ob2RlTUlUTVByb3h5Q0ExETAPBgNV\n'+
'BAYTCEludGVybmV0MREwDwYDVQQIEwhJbnRlcm5ldDERMA8GA1UEBxMISW50ZXJu\n'+
'ZXQxGzAZBgNVBAoTEk5vZGUgTUlUTSBQcm94eSBDQTELMAkGA1UECxMCQ0EwggEi\n'+
'MA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC6tnRjQd8QtbEIuZR75XWJbkNm\n'+
'mz/wBnFtjMuWZkcOvER5mUIVLlekXDu+9tNLrk0cJznXO9rNnjEhVB2YcarGZTom\n'+
'crdaSBmKtEqv+tJL2D3ItfZ5Egs2AjqROKP9S7Fs+7VBsa7UKivPlb8Zbn4WdwHl\n'+
'bI+uPAoKzDlXbHAHIKQss7rqBSQERIKHoCNN0ZU+YOqdoBVbU4wAcooiTgMx7xVq\n'+
'6n6Z7issO5fTxCo01Nb5meHjIkzsURWujuSuhmpDGXcJ4cMNTiAiouSmVmOKvJ4h\n'+
'Ln9Y+kyHf2cbDfwfSn8HSal878q/lRA454o7VvSWEaGoMyxSpEwBqlF8CBuXAgMB\n'+
'AAGjgbswgbgwDAYDVR0TBAUwAwEB/zALBgNVHQ8EBAMCAvQwOwYDVR0lBDQwMgYI\n'+
'KwYBBQUHAwEGCCsGAQUFBwMCBggrBgEFBQcDAwYIKwYBBQUHAwQGCCsGAQUFBwMI\n'+
'MBEGCWCGSAGG+EIBAQQEAwIA9zAsBgNVHREEJTAjhhtodHRwOi8vZXhhbXBsZS5v\n'+
'cmcvd2ViaWQjbWWHBH8AAAEwHQYDVR0OBBYEFPpbNzpuh4Nzjz0eKn2X7kgOQe6M\n'+
'MA0GCSqGSIb3DQEBCwUAA4IBAQBUZjyect7QrjPnaGFLJnJ5yDhQsK2su8X2mYx4\n'+
'FHY266asDFcQ3G6hb1M7wukrpLsbQoVRpzm1n5omHRSv9w9ksQqZeS1OwZphmFTC\n'+
'36MQP2eJeDuX+6SFqFbxx1OeyWJiQpRa6uXsFRoEF+x92JA/UCzGiaNGtlaeaS6h\n'+
'NyCYkDOTc9NbV3gbbBgrL3tfeO+1/CwoU180/Dt3B7RhgVDMSIKNTEMLNDu4EEMh\n'+
'68NU5g5DSy7WxTcKaUb2AW40pqoWB3U7+/vG4XUYNYusNQFApDU1rQe55GgkiLF5\n'+
'6VBZKLjkkMdULbjFiuLpOH6vpjjk9A5vvic5T12o3KfNe6gs\n'+
'-----END CERTIFICATE-----'

var privateKey = '-----BEGIN RSA PRIVATE KEY-----\n'+
'MIIEpAIBAAKCAQEAurZ0Y0HfELWxCLmUe+V1iW5DZps/8AZxbYzLlmZHDrxEeZlC\n'+
'FS5XpFw7vvbTS65NHCc51zvazZ4xIVQdmHGqxmU6JnK3WkgZirRKr/rSS9g9yLX2\n'+
'eRILNgI6kTij/UuxbPu1QbGu1Corz5W/GW5+FncB5WyPrjwKCsw5V2xwByCkLLO6\n'+
'6gUkBESCh6AjTdGVPmDqnaAVW1OMAHKKIk4DMe8Vaup+me4rLDuX08QqNNTW+Znh\n'+
'4yJM7FEVro7kroZqQxl3CeHDDU4gIqLkplZjiryeIS5/WPpMh39nGw38H0p/B0mp\n'+
'fO/Kv5UQOOeKO1b0lhGhqDMsUqRMAapRfAgblwIDAQABAoIBAEKjJ7rdIZ23Gu4A\n'+
'PexSIrbf8ZJHSnSB+C2fGHIfIrExpEa52gnxNjpk6LXpJdRW6xJnNY+Jvzevg91f\n'+
'RgjIWKjiK/TY8HN6VBNa8WUJYdDL5pEh0Eu5kuK9vOVjj7OxNiutUi2WGs2CF4zI\n'+
'5yFOfBXMd5LIQidvKi5cYQLAouMHuTjfwHbtENl3DjFcM9VeGGFPV3msNig4BDpv\n'+
'kNBXowLexpSp3hDn087Tr/DiHUGYeHt2TDFfqB08iGWma658IG6m5rssB/+w7Rke\n'+
'B0J+0FA2/E7uraARGVaQCJuEzagX8qonhkD4Vygm5iIOOBg+U6y8iZ7Sbw+mu75v\n'+
'inlVRHECgYEA3zenSADG5R+tQC96lXWmi5xO+ahtHWZch/q89x31sQmCnGUlbePi\n'+
'euNiwG7jGY63HhB93r3ApOv1EAsSxdslisJggwGdXLIAaPd87LLXarXhaSrpHsCu\n'+
'Y77iufF/XYtldRELziZNy3CySjgfsQd5yeyUx6J858QIuOx2ii1kcRsCgYEA1iJT\n'+
'53HGOhfhJAAq7QaIAYS9reBt4Ch4LpIn4/dQ0eD0yTBRhgJxHh6xaN3ighs6naid\n'+
'JLTevVWGcsG6OpJpcZuncsA94sJDOMFMnyOQoM0/D9wfuI+6zxxY09MOM51mLgj0\n'+
'izHfnYsakTHU5J+7U3mGad3UD5reQdZdYYKyIzUCgYEACtdaIY4gGtq6AGcN7hpj\n'+
't14lG80JV6c0EUqlSN9Eoo+Sr2PeOIMb6doHXs9D6mbbD/O/GUVgCOKI6XmQNNna\n'+
'7e1Y4KQAb5MZn/99KsXY3o7s3r29yseS8LdBrcRD6lgt2ky0pROJLbtQfXhSWbfC\n'+
'O4NpCnUi2eLUhZ6+dyGTQkcCgYB5vhKN53WX2bO60A2XrLrughWFIa/WXavWbmoX\n'+
'haiBarBBIiN3WTQOt8yNnnkFF43/zLlrARoR8un5nILQgiVI3gIZj4qfvWqSffOe\n'+
'Fo5HnelYjwHJ4I2I6sjlxXyxg69wRM8jxDsqSsfT/MzZHqdWEiWFUwUZyibKr6Fv\n'+
'quq0cQKBgQCOPSxESsrcBpMOYB8BycoKEgmI6ODwbaq4NJFygxikmcf+Bsiq0wD+\n'+
'EKQaOKFSReahvBlSheXTYvHNYrtWTBCSwJy8t9fC4OO8exO909Ij7TnUl9DHev8j\n'+
'uIxl8ShQRP6kn/+opI6M+I3MH2r3bBtesldOgYghhxaTmpOohLbNWQ==\n'+
'-----END RSA PRIVATE KEY-----'

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
