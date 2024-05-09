
# Since the conatiner is named it can be started using the name in the future
docker run -p 4433:4433 --name dcap_server --platform linux/x86_64  -v ${PWD}:/node-red-sgx -t adnanjamil/sgx-dcap-server  bash -c "cd /node-red-sgx/secret-prov-server && LD_LIBRARY_PATH=. RA_TLS_ALLOW_DEBUG_ENCLAVE_INSECURE=1 RA_TLS_ALLOW_OUTDATED_TCB_INSECURE=1  ./secret_prov_server_dcap"

# After first time start using:
docker start dcap_server

# Once the container is running we can use it to execute the pf_crypt binary in it for encrypting all files in user-dir

docker exec dcap_server bash -c "cd node-red-sgx && sh ./encrypt-user-dir.sh"



# run this on the server 

RA_TLS_ALLOW_DEBUG_ENCLAVE_INSECURE=1 RA_TLS_ALLOW_OUTDATED_TCB_INSECURE=1 RA_TLS_ALLOW_HW_CONFIG_NEEDED=1 RA_TLS_ALLOW_SW_HARDENING_NEEDED=1 ./server_dcap wrap_key
