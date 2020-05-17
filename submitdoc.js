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

//ID of the data contract
const contractId = 'BQ8AWHpxu2HKMEX2guWsxZwLhj7iFth6MURNQUrSov7z';



// *
// 1. Change for you own identity & private key, or please borrow mine ;)
// *
//platform identity of submitting user
const submitterId = 'G2axGTrEmXdnCjTiqNE9yKWP1H4ZWD4RmPf8QebohR7q';
//private key of submitting user
const submitterPrivKey = '90708725740cc7c5c013a4abc4f6156ea61a2adf178f147cf3d27c4185860c07'

//**
// 2. Pick a username to add here - or just stick to 'Bob', unique names aren't enforced in the contract
//**
const userNameToAdd = 'World';
//So...
//The document data to be submitted
const docData={'name': userNameToAdd};

//***
// 3. RUN THE SCRIPT
//***



//SUPPORTING FUNCTIONS
//UNCOMMENNT CONSOLE STATEMENTS TO SEE THE OUTPUT AT EACH STAGE

const getContract = async (contractId) => {
  rawContract = await client.getDataContract(contractId);
  contract = await dpp.dataContract.createFromSerialized(rawContract);
  //console.dir({contract}, {depth:5})
  return contract;
};


const createDocument = async(dataContract, identity, fieldType, opts) => {
  try{
  document = await dpp.document.create(
          dataContract,
          identity,
          fieldType,
          opts,
      );
  //console.log("document:\n", document);
  return document;
  }
  catch(e){
    console.log('doc create error:', e);
  }

}

const getStateTransition = async(document) => {
  try{
  var docs = [];
  docs.push(document);
  st = await dpp.document.createStateTransition(docs);
  console.log("state transition:\n", st);
  return st;
  }
  catch(e){
    console.log('getStateTransition error:', e);
  }

}

const signStateTransition = async(st, identityPrivateKey) => {
  try{
  const identityBuffer = await client.getIdentity(submitterId);
  //console.log('identityBuffer:\n', identityBuffer);
  
  const identity = dpp.identity.createFromSerialized(identityBuffer);
  //console.log('identity:\n', identity);
    
  identityPublicKey = identity.getPublicKeyById(1);
  console.log("identityPublicKey: ", identityPublicKey);
  signedST = await st.sign(identityPublicKey, identityPrivateKey);
  console.log("signed state transitiion:\n", signedST);
  return signedST;
  }
  catch(e){
    console.log('signStateTransition error:', e);
  }

}

const broadcastStateTransition = async(signedST) => {
  try{
  broadcast = await client.applyStateTransition(signedST);
  console.log("broadcast:\n", broadcast);
  return broadcast;
  }
  catch(e){
    console.log('broadcastStateTransition error:', e.metadata);
  }

}


const getDocuments = async () => {
  const docType = 'user';
  const docOpts = { };

  let rawDataList = [];
  try {
    rawDataList = await client.getDocuments(contractId, docType, docOpts);
  } catch(e) {
    console.error('Error getting document', e);
  }

  for (const rawData of rawDataList) {
    try {
      const doc = await dpp.document.createFromSerialized(rawData, {skipValidation: true});
      console.dir({doc});
      console.log('User name is:', doc.data.name);
    } catch(e) {
      console.error('Error deserializing', e);
    }
  }
}




//MAIN FUNCTION
(async () => {

  try{
    //Submit a new document
    console.log('get contract...');
    contract = await getContract(contractId);
    var opts = {};
    opts.data = docData;
    console.log('create document...');
    doc = await createDocument(contract, submitterId, 'user', docData );
    console.log('create ST...');
    st = await getStateTransition(doc);
    console.log('sign ST...');
    signedST = await signStateTransition(st, submitterPrivKey);
    console.log('broadcast ST...');
    broadcast = await broadcastStateTransition(signedST);
    //Get the contract documents/names
    console.log('ALL DOCUMENT DATA:');
    getdocs = await getDocuments();
  }
  catch(e){
    console.log('error',e);
  }
})();





