// Simple static file server for Amvera
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 80;
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'application/font-woff',
  '.woff2': 'application/font-woff2',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.xml': 'application/xml',
  '.txt': 'text/plain'
};

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

const server = http.createServer((req, res) => {
  // Remove query string and decode URI
  let filePath = '.' + decodeURIComponent(req.url.split('?')[0]);
  
  // Default to index.html for root
  if (filePath === './' || filePath === '.') {
    filePath = './index.html';
  }
  
  // Security: prevent directory traversal
  filePath = path.normalize(filePath);
  if (!filePath.startsWith('.' + path.sep)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found, try index.html for directory requests
        if (filePath.endsWith('/')) {
          filePath = filePath + 'index.html';
        } else {
          res.writeHead(404);
          res.end('File not found');
          return;
        }
        
        fs.readFile(filePath, (err, content) => {
          if (err) {
            res.writeHead(404);
            res.end('File not found');
          } else {
            res.writeHead(200, { 'Content-Type': getMimeType(filePath) });
            res.end(content, 'utf-8');
          }
        });
      } else {
        res.writeHead(500);
        res.end('Server error: ' + err.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': getMimeType(filePath) });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
