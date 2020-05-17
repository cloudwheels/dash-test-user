//LIBRARY IMPORTS & THEIR INSTANCES
const DashPlatformProtocol = require('@dashevo/dpp')
const DAPIClient = require('@dashevo/dapi-client');
const dpp = new DashPlatformProtocol();
const client = new DAPIClient({
  seeds: [{
    service: 'evonet.thephez.com:3000',
    port: 3000
  }],
});






const verifyDocument = async (document, stSig) => {
  const { PublicKey } = require('@dashevo/dashcore-lib');
  
  //this entropy
  const entropy = document.entropy;
  console.log('entropy: ', entropy);
  
  
  //get the identity
  const signerId = document.userId;
  //console.log('signer's identity Id:\n', signerId);
  
  const identityBuffer = await client.getIdentity(signerId);
  //console.log('identityBuffer:\n', identityBuffer);
  
  const identity = await dpp.identity.createFromSerialized(identityBuffer);
  //console.log('identity:\n', identity);
    
  identityPublicKey = await identity.getPublicKeyById(1);
  //console.log("identityPublicKey: ", identityPublicKey);
  
  
  doc = await dpp.document.create(
          document.contractId,
          signerId,
          document.type,
          document.data,
      );
  
  const newentropy = doc.entropy;
  console.log('new doc entropy: ', newentropy);
  
  
  //create an ST with this doc
  var docs = [];
  docs.push(doc);
  st = await dpp.document.createStateTransition(docs);
  console.log("state transition:\n", st);
  
  const stData = await  st.serialize({ skipSignature: true });
  console.log("state transition data:\n", st);
  
  const publicKeyBuffer = Buffer.from(identityPublicKey.getData(), 'base64');
  
  const publicKeyModel = PublicKey.fromBuffer(publicKeyBuffer);
  
  
  let isSignatureVerified;
    try {
      isSignatureVerified = verifySignature(data, signatureBuffer, publicKeyModel);
    } catch (e) {
      isSignatureVerified = false;
    }

    return isSignatureVerified;
    

}