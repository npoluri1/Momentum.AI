.PHONY: dev build up down logs clean test

dev:
	@echo "Starting development environment..."
	docker compose -f infra/docker-compose.yml up --build

dev-detach:
	docker compose -f infra/docker-compose.yml up --build -d

build:
	docker compose -f infra/docker-compose.yml build --parallel

up:
	docker compose -f infra/docker-compose.yml up -d --remove-orphans

down:
	docker compose -f infra/docker-compose.yml down

logs:
	docker compose -f infra/docker-compose.yml logs -f

clean:
	docker compose -f infra/docker-compose.yml down -v --rmi all
	docker system prune -f

restart:
	docker compose -f infra/docker-compose.yml restart

ps:
	docker compose -f infra/docker-compose.yml ps

deploy:
	@echo "Deploying to production..."
	./scripts/deploy.sh prod
