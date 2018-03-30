#!/usr/bin/env python
from BaseHTTPServer import HTTPServer
from BaseHTTPServer import BaseHTTPRequestHandler
import cgi


PORT = 8888
FILE_PREFIX = "."

if __name__ == "__main__":
    try:
        import argparse

        parser = argparse.ArgumentParser(description='A simple fake server for testing your API client.')
        parser.add_argument('-p', '--port', type=int, dest="PORT",
                           help='the port to run the server on; defaults to 8888')
        parser.add_argument('--path', type=str, dest="PATH",
                           help='the folder to find the json files')

        args = parser.parse_args()

        if args.PORT:
            PORT = args.PORT
        if args.PATH:
            FILE_PREFIX = args.PATH

    except Exception:
        # Could not successfully import argparse or something
        pass


class JSONRequestHandler (BaseHTTPRequestHandler):

    def do_GET(self):

        #send response code:
        self.send_response(200)
        #send headers:
        self.send_header("Content-type", "application/json")
        # send a blank line to end headers:
        self.wfile.write("\r\n")


        output = "{'GET': 'OK'}"
        self.wfile.write(output)

    def do_POST(self):
        response_code = 200

        try:
            self.send_response(response_code)
            self.wfile.write('Content-Type: application/json\r\n')
            self.wfile.write('Client: %s\r\n' % str(self.client_address))
            self.wfile.write('Path: %s\r\n' % self.path)

            self.end_headers()
            print 'POST received'
            for key in self.headers:
                print (key, self.headers[key])
            self.data_string = self.rfile.read(int(self.headers['content-length']))
            if not self.data_string:
                self.data_string = '"No Data Provided"'

            print "{}".format(self.data_string)

            self.wfile.write('{\n')
            self.wfile.write('"status": "OK", "data": %s' % self.data_string)
            self.wfile.write('\n}')

        except Exception as e:
            print 'JSON Server Error: %s' % e
            self.send_response(500)


server = HTTPServer(("localhost", PORT), JSONRequestHandler)
print "Test Coach Agent Server running on port %d" % PORT
server.serve_forever()
