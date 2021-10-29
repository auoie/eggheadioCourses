.PHONY: build up exec down clean
build:
	docker-compose build
up:
	docker-compose up
exec:
	docker exec --interactive --tty eggheadiofree /bin/zsh
down:
	docker-compose down && docker container prune --force && docker volume prune --force
clean:
	rm -rf dist/
