import * as path from "path";
import * as fs from "fs/promises";
import * as fse from "fs-extra"
import * as fssync from "fs";
// eslint-disable-next-line no-console
export const stdout = console.log.bind(console);
export const stderr = console.error.bind(console);
import wasmwrap_code from "node-red-wasm-wrapper";


export const getRequiredNodes = async (USERDIR, config, WASM_MANIFEST, cb={
  unwrappedNode: (node) => node,
}) => {
  const BUNDLE_ONLY_REQUIRED_NODES = config.bundleOnlyRequiredNodes;

  const flowData = JSON.parse(
    await fs.readFile(path.resolve(config.flowFilePath), { encoding: "utf8" })
  );
  const configNodesRaw = await fs.readFile(
    path.resolve(config.configNodesFilePath),
    {
      encoding: "utf8",
    }
  );
  const configNodes = JSON.parse(configNodesRaw);

  const requiredTypes = [
    ...new Set(
      flowData.map((node) => node.type).filter((node) => node !== "tab")
    ),
  ];

  let requiredNodes = {};
  let nodesFiles = [];
  let origNodeFiles = [];
  let requiredNodeFiles = [];
  let counters = {
    'WRAPPED': [],
    'UNWRAPPED': [],
  };

  Object.entries(configNodes).forEach(([prop, value]) => {
    const packageNodes = {};
    let needed = false;
    Object.entries(value.nodes).forEach(([prop, value]) => {
      origNodeFiles.push(value.file);

      if (requiredTypes.filter((x) => value.types.includes(x)).length > 0) {
        requiredNodeFiles.push(value.file);
        const filename = value.file.replace(/.*\/node_modules\/(.*)/, "$1");
        nodesFiles.push(filename);
        packageNodes[prop] = value;
        needed = true;
      }
    });
    if (needed) {
      requiredNodes[prop] = value;
      requiredNodes[prop].nodes = packageNodes;
    }
  });

  let origNodeLoader =
    "let r = {" +
    (BUNDLE_ONLY_REQUIRED_NODES ? requiredNodeFiles : origNodeFiles)
      .map(
        (file) => {
        
        let sanitized = `${file.replace(
          /.*\/node_modules\/(.*)/,
          "$1"
        )}`;
        sanitized = `node_modules/${sanitized}`;
        const basename = path.basename(sanitized);
        

        let keys = Object.keys(WASM_MANIFEST);
        let key;

        if(keys.includes(basename))
            key = path.basename(sanitized);
        else if (keys.includes(path.resolve(sanitized)))
            key = path.resolve(sanitized);


        if(WASM_MANIFEST[key]){
           console.log("WASM wrapping", sanitized);
           // Replace requireNodeFiles with the entry
           let content = fssync.readFileSync(sanitized, "utf8");
           // This returns the wrapped code, the wasm file, and the permission yml file
            var [_, r, w, y] = wasmwrap_code(content, {
                  cwd: path.dirname(sanitized),
                  full_node: true,
                  file: sanitized
              }, 
              WASM_MANIFEST[key].API,
              WASM_MANIFEST[key].PACKAGES,
              WASM_MANIFEST[key].FILE_PERMISSIONS,
            );

            // Copy the Wasm file to the userdir folder
            fs.copyFile(w, `${USERDIR}/${path.basename(w)}`);
            fs.copyFile(y, `${USERDIR}/${path.basename(y)}`);
            
            /*for(var start in requiredNodes){
              for(var type in requiredNodes[start].nodes){
                if(requiredNodes[start].nodes[type].file === file){
                  // Replace
                  requiredNodes[start].nodes[type].file = `/usr/local/lib/node_modules/node-red/${r}`
                }
              }
              break;
            }*/
            counters['WRAPPED'].push(key);
            return  `\n'${file}': ()=>require('${r.replace(
              /node_modules\/(.*)/,
              "$1"
            )}')`
        } else {
          // Report that the flow cannot be comple
          counters['UNWRAPPED'].push(file);
          cb.unwrappedNode(file);
          return  `\n'${file}': ()=>require('${file.replace(
              /.*\/node_modules\/(.*)/,
              "$1"
            )}')`
          }
        }
      )
      .join(",") +
    "}[node.file]()";

  await fs.writeFile(
    `${USERDIR}/.config.nodes.json`,
    JSON.stringify(requiredNodes)
  );
  await fs.writeFile(`${USERDIR}/flow.json`, JSON.stringify(flowData));

  console.log("WASM wrapping count", counters['WRAPPED'].length, counters['UNWRAPPED'].length);
  console.log("WASM wrapping report", counters);
  return { requiredNodes, configNodesRaw, origNodeLoader };
};

async function copyDir(src, dest) {
  let entries = await fs.readdir(src, { recursive: true, withFileTypes: true })

  for (let entry of entries) {
      let srcPath = path.join(entry.path, entry.name);
      let destPath = srcPath.replace(src, dest);
      let destDir = path.dirname(destPath);
      
      if (entry.isFile()) {
          await fs.mkdir(destDir, { recursive: true })
          await fs.copyFile(srcPath, destPath);
      }
  }
}

export const initializeUserDir = async (USERDIR) => {
  await fs.mkdir(path.join(USERDIR, "node_modules"), { recursive: true });
  await fs.mkdir(path.join(USERDIR, "lib", "flows"), { recursive: true });

  const packageData = JSON.stringify({
    name: "node-red-project",
    description: "A Node-RED Project",
    version: "0.0.1",
    private: true,
  });

  await fs.writeFile(path.join(USERDIR, "../", "package.json"), packageData);

  await fs.writeFile(
    `${USERDIR}/credential.json`,
    '{"$":"04c4fb321d628b993a794499ab059542t4w="}'
  );
  await fs.writeFile(
    `${USERDIR}/settings.js`,
    JSON.stringify({
      editorTheme: {
        projects: {
          enabled: false,
        },
      },
    })
  );

  // Copy the wasi built, node_modules
  try{
    await copyDir(
      path.resolve("node_modules/wasi/build/Release"),
      path.join(USERDIR, "../Release")
    );
  } catch (error) {
    stderr(error);
  }
};

export const addSSLKeys = async (USERDIR, config) => {
  // Load the key and certificate
  const caPath = path.resolve(config.caPath);
  const certPath = path.resolve(config.certPath);
  const keyPath = path.resolve(config.keyPath);

  try {
    await fs.copyFile(caPath, path.join(USERDIR, "ca.pem"));
    await fs.copyFile(certPath, path.join(USERDIR, path.basename(certPath)));
    await fs.copyFile(keyPath, path.join(USERDIR, path.basename(keyPath)));
  } catch (error) {
    stderr(error);
  }
};
