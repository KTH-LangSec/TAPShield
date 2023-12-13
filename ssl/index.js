
import { access, constants } from 'node:fs';
const https = require('https');
 const fs = require('fs')

const file = 'server.key';

access(file, constants.R_OK, (err) => {
  console.log(`${file} ${err ? 'is not readable' : 'is readable'}`);
});


const options = {
     key: fs.readFileSync("server.key"),
   cert: fs.readFileSync("server.cert")
 }
 
https.createServer(options, (req, res) => {
     res.writeHead(200);
     res.end("hello world");
   })
   .listen(443);
