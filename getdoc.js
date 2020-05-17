const DAPIClient = require('@dashevo/dapi-client');
const DashPlatformProtocol = require('@dashevo/dpp')

const dpp = new DashPlatformProtocol();

var client = new DAPIClient({
  seeds: [{
    service: 'evonet.thephez.com:3000',
    port: 3000
  }],
});

contractId = '9bymNchVkzLDyQR3BXckv6q3ZdKVBT38oa6Bs8R3tWcA'


const getContract = async (contractId) => {
  rawContract = await client.getDataContract(contractId);
  contract = await dpp.dataContract.createFromSerialized(rawContract);
  //console.dir({contract}, {depth:5})
  return contract;
};


const getDocuments = async () => {
  const docType = 'user';
  const docOpts = { };

  let rawDataList = [];
  try {
    rawDataList = await client.getDocuments(contractId, docType, docOpts);
    //console.dir(rawDataList);
  } catch(e) {
    console.error('Error getting document', e);
  }

  for (const rawData of rawDataList) {
    try {
      const doc = await dpp.document.createFromSerialized(rawData, {skipValidation: true});
      //console.dir({doc});
      console.log('User name is:', doc.data.name);
      console.log('VERIFIED?:',await verifyDocument(doc, 'HzfOJb/5dF5LsIYxU6jR1rHxhsA2ykUCS0G8/ubzQRwMU0L1/vhbPwybYhHf6Tbi+ABm3piqQssrLPe+wLPDl/8=') )
      //should work for entropy: 'yhfRhnmerpQ1qVwcimY8zB4Vcidj6FgTpq'
      
    } catch(e) {
      console.error('Error deserializing', e);
    }
  }
}


const verifyDocument = async (document, stSig) => {
  const { PublicKey, vs } = require('@dashevo/dashcore-lib');
  
  //this entropy
  const entropy = document.entropy;
  console.log('entropy: ', entropy);
  
  const type = document.type;
  console.log('type: ', type);
  
  const contractId = document.contractId;
  console.log('contractId: ', contractId);
  
  const contract = await getContract(contractId);
  
  const data = document.data;
  console.log('data: ', data);
  
  
  //get the identity
  const signerId = document.userId;
  //console.log('signer's identity Id:\n', signerId);
  
  const identityBuffer = await client.getIdentity(signerId);
  //console.log('identityBuffer:\n', identityBuffer);
  
  const identity = await dpp.identity.createFromSerialized(identityBuffer);
  //console.log('identity:\n', identity);
    
  const identityPublicKey = await identity.getPublicKeyById(1);
  console.log("identityPublicKey: ", identityPublicKey);
  
  
  const doc = await dpp.document.create(
          contract,
          signerId,
          type,
          data,
      );
  
  const newentropy = doc.entropy;
  console.log('new doc entropy: ', newentropy);
  
  
  //create an ST with this doc
  var docs = [];
  docs.push(doc);
  st = await dpp.document.createStateTransition(docs);
  console.log("state transition:\n", st);
  
  st.documents[0].entropy = entropy;
  console.log("***NEW state transition**:\n", st);
  
  
  const stData = await  st.serialize({ skipSignature: true });
  console.log("state transition data:\n", st);
  
  const publicKeyBuffer = Buffer.from(identityPublicKey.getData(), 'base64');
  
  const publicKeyModel = PublicKey.fromBuffer(publicKeyBuffer);
  
  
  let isSignatureVerified;
    try {
      isSignatureVerified = vs(data, signatureBuffer, publicKeyModel);
    } catch (e) { 
      isSignatureVerified = false;
    }

  return isSignatureVerified;
    

}


getDocuments();