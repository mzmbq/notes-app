install:
	cd backend && npm install
	cd frontend && npm install

run-frontend:
	cd frontend && npx expo start --web --port 3001

run-backend:
	cd backend && npm run start:dev

#run local drizzle stiduo 
run-drizzle:
	cd backend && npx drizzle-kit studio

#
generate-migrate:
	cd backend && npx drizzle-kit generate && npx drizzle-kit migrate