const fs = require('fs');
const path = require('path');

const sourceFileName = process.argv[2]; // 'zenchain_testnet.json'
if (!sourceFileName || !sourceFileName.endsWith('.json')) {
  console.error('Please provide a chain spec file name (with .json extension) to download from the zenchain-node repo at https://raw.githubusercontent.com/zenchain-protocol/zenchain-node/main/chain-specs/FILENAME');
  process.exit(1);
}
const url = `https://raw.githubusercontent.com/zenchain-protocol/zenchain-node/main/chain-specs/${sourceFileName}`;
const destinationDir = 'chain-specs';
const destinationFilepath = path.join(__dirname, "..", destinationDir, sourceFileName);

// Create the folder if it doesn't exist
if (!fs.existsSync(destinationDir)) {
  fs.mkdirSync(destinationDir);
}


fetch(url)
  .then(response => {
    if (response.ok) {
      const data = response.json();
      fs.writeFileSync(destinationFilepath, JSON.stringify(data, null, 2), 'utf-8');
    } else {
      console.error(`Failed to download the file. Status code: ${response.status}`);
    }
  })
  .catch(error => {
    console.error('Error downloading the file:', error);
  });