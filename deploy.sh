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

echo "Applying database schema..."
_DB_USER=$(grep '^DB_USER=' backend/.env | cut -d'=' -f2)
_DB_PASSWORD=$(grep '^DB_PASSWORD=' backend/.env | cut -d'=' -f2)
_DB_NAME=$(grep '^DB_NAME=' backend/.env | cut -d'=' -f2)
mysql -h localhost -u "$_DB_USER" -p"$_DB_PASSWORD" "$_DB_NAME" < docs/schema.sql

echo "Restarting app with PM2..."
pm2 restart owlcook

echo "Deployment complete."
