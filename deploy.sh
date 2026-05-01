#!/bin/bash
set -e

echo "Starting deployment..."

git pull

echo "Installing root dependencies..."
npm install

echo "Installing frontend dependencies..."
npm install --prefix frontend

echo "Installing backend dependencies..."
npm install --prefix backend

echo "Building frontend and copying to backend..."
npm run deploy

echo "Restarting app with PM2..."
pm2 restart owlcook

echo "Deployment complete."
