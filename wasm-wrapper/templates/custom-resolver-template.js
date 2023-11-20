function resolve(file, origin) {
  // Your way to resolve local include path
}

export function pathResolve(options) {
  return {
      resolveId: function(file, origin) {
          // Your local include path must either starts with `./` or `../`
          if (file.startsWith('./mal') || file.startsWith('../')) {
              // Return an absolute include path
              console.log("pathResolve", file, origin);
              return resolve(file, origin);
          }
          return null; // Continue to the next plugins!
      }
  };
}

const BLOCKLIST = [
     
    {{#ALLOW_FS}}
    ['fs', `${__dirname}/../javy_js/fs.js`],
    {{/ALLOW_FS}}

    {{^ALLOW_FS}}
    ['fs', `${__dirname}/../javy_js/disallowed.js`],
    {{/ALLOW_FS}}

    {{#ALLOW_HTTP}}
    ['http', `${__dirname}/../javy_js/https.js`],
    ['https', `${__dirname}/../javy_js/https.js`],
    ['http2', `${__dirname}/../javy_js/https.js`],
    {{/ALLOW_HTTP}}

    {{^ALLOW_HTTP}}
    ['http', `${__dirname}/../javy_js/disallowed.js`],
    ['https', `${__dirname}/../javy_js/disallowed.js`],
    ['http2', `${__dirname}/../javy_js/disallowed.js`],
    {{/ALLOW_HTTP}}

    // ['stream', `${__dirname}/../javy_js/stream.js`],
    {{#ALLOW_OS}}
    ['os', `${__dirname}/../javy_js/os.js`],
    {{/ALLOW_OS}}
    {{^ALLOW_OS}}
    ['os', `${__dirname}/../javy_js/disallowed.js`],
    {{/ALLOW_OS}}


    {{#ALLOW_PROCESS}}
    ['process', `${__dirname}/../javy_js/process.js`],
    {{/ALLOW_PROCESS}}
    {{^ALLOW_PROCESS}}
    ['process', `${__dirname}/../javy_js/disallowed.js`],
    {{/ALLOW_PROCESS}}



    {{#ALLOW_WASI}}
    ['wasi', `${__dirname}/../javy_js/wasi.js`],
    {{/ALLOW_WASI}}

    {{^ALLOW_WASI}}
    ['wasi', `${__dirname}/../javy_js/disallowed.js`],
    {{/ALLOW_WASI}}

    {{#ALLOW_FS}}
    ['fs-extra', `${__dirname}/../javy_js/fs.js`],
    {{/ALLOW_FS}}
    {{^ALLOW_FS}}
    ['fs-extra', `${__dirname}/../javy_js/disallowed.js`],
    {{/ALLOW_FS}}

    {{#ALLOW_PATH}}
    ['path', `${__dirname}/../javy_js/path.js`],
    {{/ALLOW_PATH}}
    {{^ALLOW_PATH}}
    ['path', `${__dirname}/../javy_js/disallowed.js`],
    {{/ALLOW_PATH}}

    ['iconv-lite', `${__dirname}/../javy_js/iconv-lite.js`],
    // ['cacheable-lookup', `${__dirname}/../javy_js/cacheable-lookup.js`],

    // ['cacheable-request', `${__dirname}/../javy_js/cacheable-request.js`],
    // ['agent', `${__dirname}/../javy_js/agent.js`],

    // ['util', `${__dirname}/../javy_js/utils.js`],
    // ['events', `${__dirname}/../javy_js/net.js`],
    // ['dns', `${__dirname}/../javy_js/dns.js`],
    // ['net', `${__dirname}/../javy_js/net.js`],

    // ['events', `${__dirname}/../javy_js/events.js`],


    // Node-RED
    ['buffer', `${__dirname}/../javy_js/buffer.js`],
    //['red_util', `${__dirname}/../../util/lib/util.js`],
    //['red_log', `${__dirname}/../../util/lib/log.js`],
]

// rollup-plugin-my-example.js
export default function customResolver () {
    return {
      name: 'custom-resolver', // this name will show up in logs and errors
      resolveId ( source ) {
        // console.log("Resolving", source);
        // Check if the source is in the blocklist
        for (let i = 0; i < BLOCKLIST.length; i++) {
            if (BLOCKLIST[i][0] === source) {
                console.log("Blocking ", source);
                return BLOCKLIST[i][1];
            }
        }
        // return null; // other ids should be handled as usually
      }
    };
  }
  