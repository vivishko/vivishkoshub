APP_DIR := apps/web
NPM := npm --prefix $(APP_DIR)

.DEFAULT_GOAL := help

.PHONY: help install dev build start test lint lint-fix format format-check

help:
	@echo "Available commands:"
	@echo "  make install       Install web app dependencies"
	@echo "  make dev           Run the Next.js development server"
	@echo "  make build         Build the web app"
	@echo "  make start         Start the built web app"
	@echo "  make test          Run project checks"
	@echo "  make lint          Run ESLint"
	@echo "  make lint-fix      Run ESLint with autofix"
	@echo "  make format        Format files with Prettier"
	@echo "  make format-check  Check formatting with Prettier"

install:
	$(NPM) install

dev:
	$(NPM) run dev

build:
	$(NPM) run build

start:
	$(NPM) run start

test:
	$(NPM) run lint
	$(NPM) run format:check

lint:
	$(NPM) run lint

lint-fix:
	$(NPM) run lint:fix

format:
	$(NPM) run format

format-check:
	$(NPM) run format:check
