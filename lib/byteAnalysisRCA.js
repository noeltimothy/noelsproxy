
const crypto = require("crypto"),
    forge = require("node-forge");
    md = forge.md;
    pki = forge.pki;
    fs = require('fs');

const rootCA = () => {

  try {
     return { 
	    privateKey: fs.readFileSync('./byteanalysis_private_key.pem', 'utf-8'), 
	    ca: fs.readFileSync('./byteanalysis.pem', 'utf-8')
    }
  } catch (e) {
	  console.log ("generating new root CA....");

    const keys = pki.rsa.generateKeyPair(2048);
    const attrs = [
        {
          name: "commonName",
          value: "byteanalysis",
        },
        {
          name: "organizationName",
          value: "byteanalysis",
        }
    ]

    // create a new certificate
    const cert = pki.createCertificate();

    // fill the required fields
    cert.publicKey = keys.publicKey;
    cert.serialNumber = "01";
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(
      cert.validity.notBefore.getFullYear() + 1
    );

    // here we set subject and issuer as the same one
    cert.setSubject(attrs);
    cert.setIssuer(attrs);
    cert.setExtensions([
        {
            name: "basicConstraints",
            cA: true,
            critical: true,
        },
        {
          name: "keyUsage",
          keyCertSign: true,
          digitalSignature: true,
          nonRepudiation: true,
          keyEncipherment: true,
          dataEncipherment: true,
        }
    ]);

    cert.sign(keys.privateKey, md.sha256.create());
    const privateKey = pki.privateKeyToPem(keys.privateKey);
    const ca = pki.certificateToPem(cert);

    fs.writeFileSync('./byteanalysis.pem', ca, 'utf-8');
    fs.writeFileSync('./byteanalysis_private_key.pem', privateKey, 'utf-8');
	
    return { privateKey: privateKey, ca: ca };
  }
}

module.exports = {
    rootCA
};
