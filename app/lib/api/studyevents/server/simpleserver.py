#!/usr/bin/env python

import SimpleHTTPServer
import SocketServer
import time
import thread
import re
import cgi
from pprint import pprint
import json

class LocalData(object):
  records = {'0': 'initialized'}

def dump(obj):
    for attr in dir(obj):
        if hasattr( obj, attr ):
            print( "obj.%s = %s" % (attr, getattr(obj, attr)))



class MyHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path.startswith('/kill_server'):
            print "Server shutdown requested"
            def kill_me_please(server):
                server.shutdown()
            thread.start_new_thread(kill_me_please, (httpd,))
            self.send_error(500)
        print "Processing request" + self.path
        if None != re.search('/api/v1/addrecord/*', self.path):
            ctype, pdict = cgi.parse_header(self.headers.getheader('content-type'))
            if ctype == 'application/json':
                length = int(self.headers.getheader('content-length'))
                data = cgi.parse_qs(self.rfile.read(length), keep_blank_values=1)
                #recordID = self.path.split('/')[-1]
                recordID = len(LocalData.records)
                LocalData.records[recordID] = data
                print "record %s is added successfully" % recordID
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                #self.wfile.write(data.keys()[0])
                self.wfile.write('{"status": 1, "record":%s}'%recordID)
            else:
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
        elif None != re.search('/api/v1/invalid', self.path):
             ctype, pdict = cgi.parse_header(self.headers.getheader('content-type'))
             if ctype == 'application/json':
                 length = int(self.headers.getheader('content-length'))
                 data = cgi.parse_qs(self.rfile.read(length), keep_blank_values=1)
                 print "returning invalid indicator"
                 self.send_response(200)
                 self.send_header('Content-Type', 'application/json')
                 self.end_headers()
                 self.wfile.write('{"status": 0}')
             else:
                 self.send_response(200)
                 self.send_header('Content-Type', 'application/json')
                 self.end_headers()
        else:
            self.send_response(403)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
        return
    def do_GET(self):
        if None != re.search('/api/v1/getrecord/*', self.path):
            recordID = self.path.split('/')[-1]
            print "GET looking for " + recordID
            print(LocalData.records[recordID])
            if LocalData.records.has_key(recordID):
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write('{"status": 1, "record":"%s"}'%LocalData.records[recordID])
            else:
                self.send_response(400, 'Bad Request: record does not exist')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
        else:
            self.send_response(403)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
        return


class MyTCPServer(SocketServer.TCPServer):
    def server_bind(self):
        import socket
        self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.socket.bind(self.server_address)

server_address = ('', 8000)
httpd = MyTCPServer(server_address, MyHandler)
print 'Starting test server'
try:
    httpd.serve_forever()
except KeyboardInterrupt:
    pass
httpd.server_close()
