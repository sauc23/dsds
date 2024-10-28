const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { HttpsProxyAgent } = require("https-proxy-agent"); // Import directly from https-proxy-agent

const app = express();

// Configure the HTTPS proxy agent
const httpsAgent = new HttpsProxyAgent("http://194.180.16.105:3128");

// Proxy middleware options
const proxyOptions = {
  target: "https://cors.jdx3.org", // Target URL
  changeOrigin: true,
  agent: httpsAgent, // Set the HTTPS proxy agent
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader("Access-Control-Allow-Origin", "*");
  },
};

// Use the proxy middleware
app.use("/", createProxyMiddleware(proxyOptions));

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`CORS Proxy server running on port ${PORT}`);
});
