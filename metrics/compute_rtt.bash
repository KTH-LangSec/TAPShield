
node rtt.js weather_metrics_direct_output.txt 7c3d98dee1484ade 2dd4f7e75b813efc # Http in and http response nodes
node rtt.js weather_metrics_sgx_output.txt 7c3d98dee1484ade 2dd4f7e75b813efc # Http in and http response nodes

# Exec metrics
node rtt.js exec_metrics_direct_output.txt 5fd0039701e8d5d2 5dc5be0ecad2e0ce # inject and file write
node rtt.js exec_metrics_sgx_output.txt 5fd0039701e8d5d2 5dc5be0ecad2e0ce # inject and file write

# Object
node rtt.js object_metrics_direct_output.txt acb4b61ad9e45af6 6569e44f9e852c9b
node rtt.js object_metrics_sgx_output.txt acb4b61ad9e45af6 6569e44f9e852c9b

# File large
node rtt.js files_metrics_direct_output_large.txt b0c40804f3644833 bce217521d0875a5
node rtt.js files_metrics_sgx_output_large.txt b0c40804f3644833 bce217521d0875a5

# File small

node rtt.js files_metrics_direct_output_small.txt b0c40804f3644833 bce217521d0875a5
node rtt.js files_metrics_sgx_output_small.txt b0c40804f3644833 bce217521d0875a5

# MQTT
node rtt.js mqtt_metrics_direct_output.txt 8402bc253e3d4afe c63d814f6da16eaf
node rtt.js mqtt_metrics_sgx_output.txt 8402bc253e3d4afe c63d814f6da16eaf

# UDP
node rtt.js udp_metrics_direct_output.txt 34c90cb5.cb36f4 9457cf66.6ba83
node rtt.js udp_metrics_sgx_output.txt 34c90cb5.cb36f4 9457cf66.6ba83

