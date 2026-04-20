.PHONY: install build deploy run stop restart logs

PORT ?= 4039

install:
	cd backend && npm install
	cd frontend && npm install

build:
	cd frontend && npm run build

deploy: build
	rm -rf backend/dist
	cp -r frontend/dist backend/dist

run: deploy
	bash start.sh $(PORT)

stop:
	@pkill -f "node index.js" 2>/dev/null && echo "Server stopped" || echo "No server running"

restart: stop
	@sleep 1
	nohup npm start > owlcook.log 2>&1 &
	@sleep 3 && tail -3 owlcook.log

logs:
	tail -f owlcook.log
