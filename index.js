const DAPIClient = require('@dashevo/dapi-client');
const {
  Transaction,
  PrivateKey,
  PublicKey,
} = require('@dashevo/dashcore-lib');

const DashPlatformProtocol = require('@dashevo/dpp');

const stateTransitionTypes = require('@dashevo/dpp/lib/stateTransition/stateTransitionTypes');
const IdentityCreateTransition = require('@dashevo/dpp/lib/identity/stateTransitions/identityCreateTransition/IdentityCreateTransition');
const IdentityPublicKey = require('@dashevo/dpp/lib/identity/IdentityPublicKey');
const fs=require('fs');
const wait = require('./wait');

var client = new DAPIClient({
  seeds: [{
    service: 'evonet.thephez.com:20001',
    port: 3000
  }],
});

//random entropy for private keys
    var randomNumUserId = '90708725740cc7c5c013a4abc4f6156ea61a2adf178f147cf3d27c4185860c07';
    var randomNumUserLock = '8723001f8d8c628d0e98184bfc01e52f0697b6170c2e65e9af1615dd53b0f197';
    var randomNumUserFaucet = 'd2203cb920b0aa4300f009a2b328fe29cfcf2556fe16f116025bb449586c5614'
    
    //random seeds for App Id
    var randomNumAppId = 'a18862831dc2993aceb7188b728ae0b92378b2000d935c335005a5d4d76b479c'
    var randomNumAppLock = 'ddd642cf4939f1e9ac464ec66247023711d4caa774c5608ec3d9b1cd6abd8d3a';
    var randomNumAppFaucet = '44f8620872898a6b37ca0e95590a30d0ef0b021c8ca0449426ec16e907d56c0b';







//USERID : G2axGTrEmXdnCjTiqNE9yKWP1H4ZWD4RmPf8QebohR7q
// pk: 90708725740cc7c5c013a4abc4f6156ea61a2adf178f147cf3d27c4185860c07


//APPID: BQ8AWHpxu2HKMEX2guWsxZwLhj7iFth6MURNQUrSov7z
//private key: a18862831dc2993aceb7188b728ae0b92378b2000d935c335005a5d4d76b479c




const idType = 2
//burnTx - user : 'ab47022bd513401d0f96ba9e7de8f2c4b2623775389cbc616370337fd13485cb'
//burnTx - app : '63dde402237803c522ce65e8705f436d214033976155b17db70f9ce8f5d92aac'
const burnTx = '63dde402237803c522ce65e8705f436d214033976155b17db70f9ce8f5d92aac'

/********
 *  RUN THESE FUNCTIONS IN ORDER
 */


//getId();
//cont();
//cont2();
//cont3(burnTx);




async function getId(){

try{
    
    //create a user
    console.log('create keys & addresses...');
    
    //USER:
    //const K = await createKeysAndAddresses(idType,randomNumUserId,randomNumUserLock, randomNumUserFaucet);
    //APP:
    const K = await createKeysAndAddresses(idType,randomNumAppId,randomNumAppLock, randomNumAppFaucet);
    
    
    for (const property in K) {
      console.log(`${property}: ${K[property]}`);
    }
     console.log('go to faucet & fund address: ', K.faucetAddress, '\n Then run fund locktx' )
    
    
  
  }
  catch(e){
    console.log('getId error:',e);
  }
}

async function cont(){

try{
    
    //create a user
    console.log('create keys & addresses...');
    //USER:
    //const K = await createKeysAndAddresses(idType,randomNumUserId,randomNumUserLock, randomNumUserFaucet);
    //APP:
    const K = await createKeysAndAddresses(idType,randomNumAppId,randomNumAppLock, randomNumAppFaucet);
    for (const property in K) {
      console.log(`${property}: ${K[property]}`);
    }
    
    const fundLockTxId  = await fundAddress(client, K.faucetAddress, K.lockAddress, 20000, K.faucetPrivateKey);
    console.log('broadcast this tx + run cont2:', fundLockTxId);
  
  }
  catch(e){
    console.log('getId error:',e);
  }
}

async function cont2(){

try{
    
    //create a user
    console.log('create keys & addresses...');
    //USER:
    //const K = await createKeysAndAddresses(idType,randomNumUserId,randomNumUserLock, randomNumUserFaucet);
    //APP:
    const K = await createKeysAndAddresses(idType,randomNumAppId,randomNumAppLock, randomNumAppFaucet);
    
    const burnTxId = await fundLockTx(client, K.faucetAddress, K.lockAddress, K.lockPrivateKey, K.publicKeyHash);
    console.log('broadcast this tx, paste tx id as burnTx, run cont3:', burnTxId);
  
  }
  catch(e){
    console.log('getId error:',e);
  }
}



async function cont3(burnTxId){

try{
    
    //create a user
    console.log('create keys & addresses...');
    //USER:
    //const K = await createKeysAndAddresses(idType,randomNumUserId,randomNumUserLock, randomNumUserFaucet);
    //APP:
    const K = await createKeysAndAddresses(idType,randomNumAppId,randomNumAppLock, randomNumAppFaucet);
    
   
    const outPoint = await getOutpoint(burnTxId);
    console.log("outPoint:",outPoint);
    
    const identityCreateTransition = await applyIdentityCreateTransition(
      client,
      outPoint,
      idType,
      K.identityPrivateKey,
      K.identityPublicKey,
    );
  
    console.log("idcrtx:",identityCreateTransition );
  
  }
  catch(e){
    console.log('getId error:',e);
  }
}




async function createKeysAndAddresses(type, // user = 1 app =2
                              idenityKeyEntropy,
                              lockKeyEntropy,
                              faucetKeyEntropy
                              ) {
  
  try{
    const K = {};
    const network = 'testnet'; //process.env.NETWORK === 'devnet' ? 'testnet' : process.env.NETWORK;
    // Prepare keys for a new Identity
    K.identityPrivateKey = new PrivateKey(idenityKeyEntropy);
    K.publicKey = new PublicKey({
      ...K.identityPrivateKey.toPublicKey().toObject(),
      compressed: true,
    });
    K.publicKeyBase = K.publicKey.toBuffer().toString('base64');
    // eslint-disable-next-line no-underscore-dangle
    K.publicKeyHash = PublicKey.fromBuffer(Buffer.from(K.publicKeyBase, 'base64'))._getID();
    K.identityPublicKey = new IdentityPublicKey()
      .setId(1)
      .setType(IdentityPublicKey.TYPES.ECDSA_SECP256K1)
      .setData(K.publicKeyBase);
    K.lockPrivateKey = new PrivateKey(lockKeyEntropy);
    K.lockAddress = K.lockPrivateKey.toAddress(network);
    K.faucetPrivateKey = new PrivateKey(faucetKeyEntropy); //PrivateKey(process.env.FAUCET_PRIVATE_KEY);
    K.faucetAddress = K.faucetPrivateKey.toAddress(network);
    return K;
  }
  catch(e){
    console.log('createKeysAndAddresses error', e);
  }
}








async function fundLockTx(dapiClient,faucetAddress, lockAddress, lockPrivateKey, publicKeyHash) {
  
  try{
  
  const lockTransaction = new Transaction();
  
  const { items: [input] } = await dapiClient.getUTXO(lockAddress.toString());
  
    lockTransaction.from(input)
      .addBurnOutput(10000, publicKeyHash)
      .change(faucetAddress)
      .fee(668)
      .sign(lockPrivateKey);
      
    
    serializedTx = lockTransaction.serialize()
    console.log('serialised lock tx:', serializedTx);
  return serializedTx;
  
/*
    const transactionId = await dapiClient.sendTransaction(transaction.serialize());
    console.log('txid: ', transactionId);
  
    await dapiClient.generateToAddress(1, faucetAddress.toString());
    await wait(5000);
    return transactionId;
*/
    
  }
  catch(e){
    console.log('fundLockTx error', e);
  }
}


async function getOutpoint(txId){
  try{
    const outPointHex = txId + '00000000';
    const outpointBuffer = Buffer.from(outPointHex, 'hex');
    const outPoint = outpointBuffer.toString('base64');
    return outPoint;
  }
  catch(e){
    console.log('getOutpoint error', e);
  }
  
}


  
async function fundAddress(dapiClient, fromAddress, toAddress, amount, signingKey) {

  try{
    //const { items: inputs } = await dapiClient.getUTXO(faucetAddress.toString());
  
    //console.log('inputs:',inputs );
    
    
    const transaction = new Transaction();
    
    const { items: [input] } = await dapiClient.getUTXO(fromAddress.toString());
  
    transaction.from(input)
      .to(toAddress, amount)
      .change(fromAddress)
      .fee(668)
      .sign(signingKey);
    /*
    transaction.from(fromAddress)
      .to(toAddress, amount)
      .change(fromAddress)
      .fee(668)
      .sign(signingKey);
    */
    serializedTx = transaction.serialize()
    console.log('serialised tx:', transaction.serialize());
    return serializedTx;


/*
const transactionId = await dapiClient.sendTransaction(transaction.serialize());
    //const transactionId = await dapiClient.sendTransaction(transaction.toBuffer());
    console.log('txid: ', transactionId);
    
    await dapiClient.generateToAddress(1, faucetAddress.toString());
    await wait(5000);
    return transactionId;
 */
  
  }
  catch(e){
    console.log('fund address error',e);
  }

}



async function applyIdentityCreateTransition(
  dapiClient,
  outPoint,
  type,
  privateKey,
  identityPublicKey,
) {
  const identityCreateTransition = new IdentityCreateTransition({
    protocolVersion: 0,
    type: stateTransitionTypes.IDENTITY_CREATE,
    lockedOutPoint: outPoint,
    identityType: type,
    publicKeys: [
      identityPublicKey.toJSON(),
    ],
  });

  identityCreateTransition.sign(identityPublicKey, privateKey);

  await dapiClient.applyStateTransition(identityCreateTransition);

  return identityCreateTransition;
}
