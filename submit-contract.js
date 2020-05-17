const DAPIClient = require('@dashevo/dapi-client');
const DashPlatformProtocol = require('@dashevo/dpp')

const dpp = new DashPlatformProtocol();

var client = new DAPIClient({
  seeds: [{
    service: 'evonet.thephez.com:3000',
    port: 3000
  }],
});

const appIdentity = 'BQ8AWHpxu2HKMEX2guWsxZwLhj7iFth6MURNQUrSov7z';
const appIdPrivKey = 'a18862831dc2993aceb7188b728ae0b92378b2000d935c335005a5d4d76b479c'


const getContract = async (contractId) => {
  rawContract = await client.getDataContract(contractId);
  contract = dpp.dataContract.createFromSerialized(rawContract);
  console.dir({contract}, {depth:5})
  return contract;
};

const validateContract = async (contract) => {
  contractValidationResult = await dpp.dataContract.validate(contract)

  if (contractValidationResult.errors.length == 0) {
    console.info('\n--- Contract validation successful! ---\n');
    return true;
  } else {
    console.error('\nContract validation failed for:');
    console.dir(contract, {depth:5})
    console.error('\nContract Validation errors:\n--------------------------')
    console.dir(contractValidationResult.errors)
    return false;
  }
};

const registerContract = async () => {

try{
  const identityBuffer = await client.getIdentity(appIdentity);
  
  console.log('identityBuffer:\n', identityBuffer);
  
  const identity = dpp.identity.createFromSerialized(identityBuffer);

  console.log('identity:\n', identity);


  const contractDocuments = {
  'user': {
    'properties': {
      'name': {
        'type': 'string'
      }
    },
    'additionalProperties': false
  }
  };

  contract = dpp.dataContract.create(identity.id, contractDocuments)
  validateContract(contract)

  const stateTransition = dpp.dataContract.createStateTransition(contract);

  const identityPrivateKey=appIdPrivKey;
  const idPubKey = identity.getPublicKeyById(1);
  console.log('idPubKey:\n', idPubKey);
  stateTransition.sign(idPubKey, identityPrivateKey);

  console.log('state signed Transition:\n', stateTransition);

  await client.applyStateTransition(stateTransition);
  contract = getContract(appIdentity)
}
catch(e){
  console.log('register error:\n', e.metadata);
}


};

registerContract();