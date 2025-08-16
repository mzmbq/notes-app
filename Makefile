install:
	yarn install

run-frontend:
	cd packages/frontend && npx expo start --web --port 3001

run-backend:
	cd packages/backend && yarn start:dev

# Run local drizzle stiduo 
run-db-ui:
	cd packages/backend && npx drizzle-kit studio

generate-migrate:
	cd packages/backend && npx drizzle-kit generate && npx drizzle-kit migrate

create-db-container:
	docker run -d \
		--name notes-app-db \
		-p 5432:5432 \
		-v pgdata:/var/lib/postgresql/data \
		-e POSTGRES_PASSWORD=pass \
		postgres

