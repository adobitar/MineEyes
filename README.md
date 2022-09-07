# MineEyes
Web/service interface for MinerEyes system monitor.

Uses SQLite snaps.db 

Thanks to Geshan Manandhar for the nodejs-sqlite quotes tutorial from which this is based.  #learning
https://geshan.com.np/blog/2021/10/nodejs-sqlite/

Uses supervisor to restart server on file changes.  Start app using supervisor server.js.  (after installing supervisor: npm install superviso -g)