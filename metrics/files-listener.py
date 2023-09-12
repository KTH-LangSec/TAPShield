import ssl
import websocket

ws = websocket.WebSocket(sslopt={"cert_reqs": ssl.CERT_NONE})

ws = create_connection("wss://localhost:8443/api/monitor")

print "Receiving..."
result =  ws.recv()
print("Received '%s'" % result
ws.close()