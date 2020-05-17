const DashJS = require('dash');

//Mnemonic: skin push van ostrich embody long later denial afraid number fossil ribbon
//Unused address: yWAeu7xTofYJyppVxzwMgJhrpDhhDDCQrS

const sdkOpts = {
  network: 'testnet',
  mnemonic: 'skin push van ostrich embody long later denial afraid number fossil ribbon'
};
const sdk = new DashJS.SDK(sdkOpts);

async function createWallet() {
  try {
    await sdk.isReady();
    const mnemonic = sdk.wallet.exportWallet();
    const address = sdk.account.getUnusedAddress();
    console.log('Mnemonic:', mnemonic);
    console.log('Unused address:', address.address);
  } catch (e) {
    console.error('Something went wrong:', e);
  } finally {
    sdk.disconnect();
  }
}
createWallet();