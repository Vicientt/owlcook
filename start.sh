#!/bin/bash
PORT=${1:-4039}

sed -i "s/^PORT=.*/PORT=$PORT/" backend/.env
pkill -f "node index.js" 2>/dev/null || true
sleep 1

nohup npm start > owlcook.log 2>&1 &
echo "Server starting on port $PORT (PID $!)..."
sleep 4
tail -3 owlcook.log
