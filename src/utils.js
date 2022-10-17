import * as path from "path";
import * as fs from "fs/promises";
// eslint-disable-next-line no-console
export const stdout = console.log.bind(console);
export const stderr = console.error.bind(console);

export const getRequiredNodes = async (USERDIR, config) => {
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
        (file) =>
          `\n'${file}': ()=>require('${file.replace(
            /.*\/node_modules\/(.*)/,
            "$1"
          )}')`
      )
      .join(",") +
    "}[node.file]()";

  await fs.writeFile(
    `${USERDIR}/.config.nodes.json`,
    JSON.stringify(requiredNodes)
  );
  await fs.writeFile(`${USERDIR}/flow.json`, JSON.stringify(flowData));

  return { requiredNodes, configNodesRaw, origNodeLoader };
};

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
