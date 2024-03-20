from http.server import HTTPServer, CGIHTTPRequestHandler
server_adress = ("localhost", 8000)
httpd = HTTPServer(server_adress, CGIHTTPRequestHandler)
print("Server started on port: 8000")
httpd.serve_forever()