import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
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
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // Handle root path
  let filePath;
  
  if (req.url === '/') {
    filePath = path.join(__dirname, 'kitchensink', 'index.html');
  } 
  // Special case for partials
  else if (req.url.startsWith('/partials/')) {
    const partialPath = req.url.replace('/partials/', '');
    filePath = path.join(__dirname, 'kitchensink', 'partials', partialPath);
    console.log(`Loading partial: ${filePath}`);
  }
  // All other paths
  else {
    filePath = path.join(__dirname, req.url);
  }
  
  // Get the file extension
  const extname = path.extname(filePath);
  let contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  // Read the file
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // File not found
        console.error(`File not found: ${filePath}`);
        res.writeHead(404);
        res.end('404 Not Found');
      } else {
        // Server error
        console.error(`Server error: ${error.code}`);
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Kitchensink available at http://localhost:${PORT}/`);
  
  // Try to open the browser automatically
  const startUrl = `http://localhost:${PORT}/`;
  const command = process.platform === 'win32' ? 'start' : 
                 process.platform === 'darwin' ? 'open' : 'xdg-open';
  
  try {
    import('child_process').then(({ exec }) => {
      exec(`${command} ${startUrl}`);
    }).catch(err => {
      console.log('Could not open browser automatically. Please open manually.');
    });
  } catch (err) {
    console.log('Could not open browser automatically. Please open manually.');
  }
}); 