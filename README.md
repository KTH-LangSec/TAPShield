# TAPShield

## Preparing the environment

You will need to run a local Attestation/Secret provisioning server. This server will be used to provision the SGX enclave with the secret key which is used to decrypt the flow-related data. 

The server binary is available in the folder [secret-prov-server/secret_prov_server_dcap](./secret-prov-server/secret_prov_server_dcap). 

The automation script assumes the server to be running inside a docker container and also it requires the docker container for executing the encryption program.


> If you have a x86_64 machine, running ubuntu focal you should be able to run the server and pf_crypt directly on your machine without using docker but that requires some changes to the ansible script in [playbook.yaml](./playbook.yaml).


### Setting up the docker container

Pull the image from: [https://hub.docker.com/repository/docker/adnanjamil/sgx-dcap-server](https://hub.docker.com/repository/docker/adnanjamil/sgx-dcap-server)

```bash
    docker pull adnanjamil/sgx-dcap-server
```

Run the container once from this directory:

```bash
docker run -p 4433:4433 --name dcap_server --platform linux/x86_64  -v ${PWD}:/node-red-sgx -t adnanjamil/sgx-dcap-server  bash -c "cd /node-red-sgx/secret-prov-server && LD_LIBRARY_PATH=. RA_TLS_ALLOW_DEBUG_ENCLAVE_INSECURE=1 RA_TLS_ALLOW_OUTDATED_TCB_INSECURE=1  ./secret_prov_server_dcap"
```

This command immediately starts the server. You can stop the container if you want because the playbook will start the container again using the named reference `dcap_server`.

### Open up the ports

The port 4433 is used by the server to communicate with the enclave. You will need to open up this port on your local machine to the internet and also on the remote server.

### Specify the server address
You can specify the server address and ssh certificate in the [inventory.yaml](./inventory.yaml) file 

## Configuration

The file [build.config.json](./build.config.json) contains all the configuration for the automation playbook, the flow and the enclave.

<!-- 
   "minify": true, 
    "sourcemap": false,
    "bundleOnlyRequiredNodes": true,
    "outputDir": "build",
    "configNodesFilePath": "/Users/adnanjamil/.node-red/.config.nodes.json",
    "flowFilePath": "/Users/adnanjamil/projects/node-red/flows/watcher.json",
    "caPath": "/Users/adnanjamil/ssl/certs/ca.pem",
    "certPath": "/Users/adnanjamil/ssl/certs/server.cert",
    "keyPath": "/Users/adnanjamil/ssl/certs/server.key",
    "manifestFilePath": "/Users/adnanjamil/projects/node-red-bundler/manifests/files.toml",
    "remoteDir": "/home/azureuser/gramine-test",
    "uploadBundle": true,
    "startEnclave": false,
    "encryptUserDir": true
 -->

<!-- Create table -->
| Key | Type | Description |
| --- | --- | --- |
| minify | Boolean | Minify the javascript code |
| sourcemap | Boolean | Generate JS source map |
| bundleOnlyRequiredNodes | Boolean | Bundle only the nodes used in the flow |
| outputDir | String | Local output directory for the bundle (recommended: build)|
| configNodesFilePath | String | Absolute path to the config nodes file (normally in ~/.node-red/.config.node.json) |
| flowFilePath | String | Absolute path to the flow specification. See examples of flows in [./flows](./flows) |
|SSL configuration | | |
| caPath | String | Absolute path to the CA certificate |
| certPath | String | Absolute path to the server certificate |
| keyPath | String | Absolute path to the server key |
| manifestFilePath | String | Absolute path to the manifest file, see [1].|
| remoteDir | String | Absolute path of remote directory where the bundle and all data will be uploaded |
| uploadBundle | Boolean | Whether to upload the Node-RED bundle to the remote server, see [2].|
| startEnclave | Boolean | Whether to immidiately start the enclave on the remote server after building|
| encryptUserDir | Boolean | Whether to encrypt the user directory on the remote server, see [3]|

[1] The manifest file is used to specifies the enclave configuration. An example of the manifest is shown in [files.toml](./manifests/files.toml), and other files in this directory. The manifest file is mandatory otherwise the enclave will not run. See the documentation of Gramine ([manifest-syntax.html](https://gramine.readthedocs.io/en/stable/manifest-syntax.html)) for more info on the manifest syntax.

[2] The bundle is a file containing the Node-RED source code and all its dependencies. The bundle is not encrypted and it is not uploaded if the `uploadBundle` flag is set to `false`, which is useful for testing a flow with different manifest specifications.

[3] The user directory is the directory where the flow-related data , e.g. flow specification, SSL certificate/keys etc. is stored. If set to `false` the user directory will not be encrypted and the secret provisioning server will not be started.

## Creating your flow

It is recommended that you create your flow using the Node-RED editor in a separate place. Later, refer to the JSON file as the `flowFilePath` in the [build.config.json](./build.config.json) file.

## Running the playbook

The playbook is written in ansible and it is located in [playbook.yaml](./playbook.yaml). You can run it using the following command:

```bash
ansible-playbook playbook.yaml -i inventory.yaml
```
This performs the following steps:

1. Build the Node-RED bundle
2. Start the secret provisioning server (if `encryptUserDir` is set to `true`)
3. Encrypt the user directory (if `encryptUserDir` is set to `true`)
4. Upload the bundle and user directory to the remote server (if `uploadBundle` is set to `true`)
5. Upload the [Makefile](./Makefile) to the remote server. This is used to build the enclave.
6. Upload manifest file to the remote server
7. Upload the [libsecret_prov_attest.so](./libsecret_prov_attest.so) to the remote server, this is required by the enclave for remote attestation.
8. Upload the secret provisioning servers [ca.crt](secret-prov-server/ssl/ca.crt) to the remote server, this is required by the enclave for establishing a TLS connection with the secret provisioning server.
9. Build the enclave on the remote server
10. Start the enclave on the remote server (if `startEnclave` is set to `true`)

## 
