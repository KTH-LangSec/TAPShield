alias "pf=LD_LIBRARY_PATH=../pf_crypt ../pf_crypt/gramine-sgx-pf-crypt"

# Create encryption key
#! Commented out since the server will already have the key in memory and we don't want to create a new key
# pf gen-key --wrap-key  ./secret-prov-server/files/wrap-key

cd build

# Encrypt all files in user-dir

LD_LIBRARY_PATH=../pf_crypt ../pf_crypt/gramine-sgx-pf-crypt encrypt  -w ../secret-prov-server/files/wrap-key -i user-dir -o user-dir
