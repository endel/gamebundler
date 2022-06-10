import fs from 'fs';
import path from 'path';
import http from 'http';
import httpServer from 'http-server';
import * as ws from "ws";

import events from 'events';
import { config } from "@gamebundler/comptime";

import cli from './cli-parsed.js';
import { templatePath } from './paths.js';
import { injectHTML } from './html/processing.js';

export const devEvents = new events.EventEmitter();
export const isDevelopment = !config.isReleaseMode();



export const devServer = isDevelopment && httpServer.createServer({
  root: cli.options.out,
  cors: true,
  autoIndex: true,
  showDir: true,
  cache: -1, // prevent caching assets
  before: [function(req: http.IncomingMessage, res: http.ServerResponse, next: any) {
    // intercept reload script.
    if (req.url === "/gamebundler/development.js") {
      res.setHeader("Content-Type", "text/javascript");
      res.write(fs.readFileSync(path.resolve(templatePath, "development.js")));
      res.end();
      return;

    } else if (req.url === "/gamebundler/development.css") {
      res.setHeader("Content-Type", "text/css");
      res.write(fs.readFileSync(path.resolve(templatePath, "development.css")));
      res.end();
      return;

    } else if (req.url === "/" || req.url === "/index.html") {
      // serve static HTML file
      res.setHeader("Content-Type", "text/html");
      res.setHeader("Cache-Control", "no-cache");

      const htmlContents = fs.readFileSync(cli.options.html).toString();
      const devHTML = injectHTML(htmlContents, [
        '<script src="bundle.js"></script>',
        '<script src="/gamebundler/development.js"></script>',
        '<link rel="stylesheet" href="/gamebundler/development.css" />'
      ].join("\n"));
      res.write(devHTML);

      res.end();
      return;

    } else {
      next();
    }
  }]
}) || undefined;

if (isDevelopment) {
  // the raw http server
  const rawServer = (devServer as any)['server'];

  // the WebSocket server
  const wss = new ws.WebSocketServer({ server: rawServer });
  wss.on('connection', (socket) => {
    devEvents.on('reload', () => socket.send(JSON.stringify({ type: 'reload' })));
    devEvents.on('error', (err) => socket.send(JSON.stringify({
      type: 'error',
      message: err.message,
      stack: err.stack,
    })));
  });
}
