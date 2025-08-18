.PHONY: install build rebuild clean run-frontend run-backend run-db-ui generate-migrate create-db-container

install:
	yarn install

build:
	npx tsc -b --verbose

rebuild: clean build
	@echo "Rebuild complete."

clean:
	@echo "Cleaning up build artifacts..."
	@rm -rf types/dist types/*.tsbuildinfo types/.tsbuildinfo \
    	backend/dist backend/*.tsbuildinfo backend/.tsbuildinfo \
        frontend/dist frontend/*.tsbuildinfo frontend/.tsbuildinfo || true

run-frontend:
	cd frontend && npx expo start --web --port 3001

run-backend:
	cd backend && yarn start:dev

# Run local drizzle stiduo 
run-db-ui:
	cd backend && npx drizzle-kit studio

generate-migrate:
	cd backend && npx drizzle-kit generate && npx drizzle-kit migrate

create-db-container:
	docker run -d \
		--name notes-app-db \
		-p 5432:5432 \
		-v pgdata:/var/lib/postgresql/data \
		-e POSTGRES_PASSWORD=pass \
		postgres



