const DAPIClient = require('@dashevo/dapi-client');
const DashPlatformProtocol = require('@dashevo/dpp')

const dpp = new DashPlatformProtocol();

var client = new DAPIClient({
  seeds: [{
    service: 'evo.cloudwheels.net:20001',
    port: 3000
  }],
});

// NW user document
//contractId = 'BQ8AWHpxu2HKMEX2guWsxZwLhj7iFth6MURNQUrSov7z'
//console
contractId = 'FJWB6p2X3mhQ1qsv6BpnbfiFVqsyJzP5kYACPhbfuFCb'



const getDocuments = async () => {
  const docType = 'person'; //'user';
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
      console.log('Hello', doc.data.name, '!');
    } catch(e) {
      console.error('Error deserializing', e);
    }
  }
}

getDocuments();