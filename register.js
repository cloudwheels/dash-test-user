const Dash = require('dash');
let memoContract = require('./contract-export');



const clientOpts = {
  network: 'testnet',
  mnemonic: 'onion price educate farm area price enact faint fancy edge strike tiger',
};
const client = new Dash.Client(clientOpts);

const registerContract = async function () {
  try {
    await client.isReady();
    const platform = client.platform;
    const identity = await platform.identities.get('8y4BgoMmx484VMpfLMYj1rkRF7M7Dx8rhrN2GTJjWzZd');
    

    const contract = await platform.contracts.create(memoContract.memoContract, identity);
    console.dir({contract});
    
    // Sign and submit the data contract
    //await platform.contracts.broadcast(contract, identity);
  } catch (e) {
    console.error('Something went wrong:', e);
  } finally {
    client.disconnect();
  }
}
//console.dir(memoContract.memoContract);
registerContract();
