install:
	cd backend && npm install
	cd frontend && npm install

run-frontend:
	cd frontend && npx expo start --web --port 3001

run-backend:
	cd backend && npm run start