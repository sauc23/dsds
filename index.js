const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { HttpsProxyAgent } = require("https-proxy-agent"); // Import directly from https-proxy-agent

const app = express();

// Configure the HTTPS proxy agent
const httpsAgent = new HttpsProxyAgent("https://e3z4acki-gv85bq9:ksc8d3rmv7@sg-011.totallyacdn.com:443");

// Proxy middleware options
const proxyOptions = {
  target: "https://linearjitp-playback.astro.com.my", // Target URL
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
