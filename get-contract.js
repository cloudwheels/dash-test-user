const DAPIClient = require('@dashevo/dapi-client');
const DashPlatformProtocol = require('@dashevo/dpp')

const dpp = new DashPlatformProtocol();

var client = new DAPIClient({
  seeds: [{
    service: 'evonet.thephez.com:3000',
    port: 3000
  }],
});

const contractId = 'BQ8AWHpxu2HKMEX2guWsxZwLhj7iFth6MURNQUrSov7z'

const getContract = async (contractId) => {
  rawContract = await client.getDataContract(contractId);
  contract = await dpp.dataContract.createFromSerialized(rawContract);
  console.dir({contract}, {depth:5})
  return contract;
};
const test = getContract(contractId);