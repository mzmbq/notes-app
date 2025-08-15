install:
	cd backend && npm install
	cd frontend && npm install

run-frontend:
	cd frontend && npx expo start --web --port 3001

run-backend:
	cd backend && npm run start:dev

# Run local drizzle stiduo 
run-db-ui:
	cd backend && npx drizzle-kit studio

generate-migrate:
	cd backend && npx drizzle-kit generate && npx drizzle-kit migrate

run-db-local:
	docker run -d \
		--name notes-app-db \
		-p 5432:5432 \
		-v pgdata:/var/lib/postgresql/data \
		-e POSTGRES_PASSWORD=pass \
		postgres

