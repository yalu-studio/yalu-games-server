/**
    This file will generate a public and private key pair and save them to current directory.
*/
const crypto = require("crypto");
const fs = require("fs");

function generateKeyPair() {
  const keyPair = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
  });

  fs.writeFileSync(__dirname + "/id_rsa_pub.pem", keyPair.publicKey);
  fs.writeFileSync(__dirname + "/id_rsa_priv.pem", keyPair.privateKey);
}

generateKeyPair();
