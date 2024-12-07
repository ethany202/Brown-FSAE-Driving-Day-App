.PHONY: setvenv runserver

VENV_NAME = venv
PYTHON = python3
SOURCE = $(VENV_NAME)/bin/$(PYTHON)

setvenv:
	$(PYTHON) -m $(VENV_NAME) $(VENV_NAME)
	pip install -r requirements.txt

runserver: setvenv
	$(SOURCE) manage.py runserver
