const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { HttpsProxyAgent } = require("https-proxy-agent");

const app = express();

// Configure the HTTPS proxy agent
const httpsAgent = new HttpsProxyAgent("https://e3z4acki-gv85bq9:ksc8d3rmv7@de-008.totallyacdn.com:443");

// Middleware to extract and validate target URL from the request path
app.use(
  "/",
  (req, res, next) => {
    const urlPath = req.path.slice(1); // Remove leading '/'
    
    try {
      // Check if the URL starts with "http" or "https"
      if (!/^https?:\/\//.test(urlPath)) {
        throw new Error("Invalid URL format");
      }
      
      // Construct and decode the target URL
      req.targetUrl = decodeURIComponent(urlPath);
      next();
    } catch (error) {
      res.status(400).send("Invalid URL format.");
    }
  },
  (req, res, next) => {
    if (!req.targetUrl) {
      res.status(400).send("Invalid target URL.");
      return;
    }

    // Proxy middleware options with dynamic target
    const proxyOptions = {
      target: req.targetUrl,
      changeOrigin: true,
      agent: httpsAgent,
      onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader("Access-Control-Allow-Origin", "*");
      },
      onError: (err, req, res) => {
        res.status(500).send("Proxy error: " + err.message);
      },
    };

    // Apply the proxy middleware
    createProxyMiddleware(proxyOptions)(req, res, next);
  }
);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`CORS Proxy server running on port ${PORT}`);
});
