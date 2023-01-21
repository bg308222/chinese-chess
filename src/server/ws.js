//import express 和 ws 套件
const express = require("express");
const SocketServer = require("ws").Server;

//指定開啟的 port
const PORT = 3001;

//創建 express 的物件，並綁定及監聽 3000 port ，且設定開啟後在 console 中提示
const server = express().listen(PORT, () =>
  console.log(`Listening on ${PORT}`)
);

//將 express 交給 SocketServer 開啟 WebSocket 的服務
const wss = new SocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  setTimeout(() => {
    if (wss.clients.size === 2) {
      let index = 0;
      wss.clients.forEach((client) => {
        client.send(
          JSON.stringify({
            action: 3,
            payload: index++ === 0 ? "r" : "b",
          })
        );
      });
    }
  }, 100);

  //連結時執行此 console 提示
  ws.on("message", (msg) => {
    const res = msg.toString();
    wss.clients.forEach((client) => {
      client.send(res);
    });
  });

  //當 WebSocket 的連線關閉時執行
  ws.on("close", () => {
    console.log("Close connected");
  });
});
