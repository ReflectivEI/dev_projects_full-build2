const https = require('https');
const fs = require('fs');

const url = 'https://img1.wsimg.com/blobby/go/fc94bea5-9850-444c-ab45-be6f21435264/Signal_20Intelligence_20Definitions_20and_20Me.pdf';
const file = fs.createWriteStream('Signal_Intelligence_Definitions.pdf');

https.get(url, (response) => {
  response.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('PDF downloaded successfully');
  });
}).on('error', (err) => {
  fs.unlink('Signal_Intelligence_Definitions.pdf', () => {});
  console.error('Error downloading PDF:', err.message);
});
