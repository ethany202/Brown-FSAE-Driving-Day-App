.PHONY: setvenv runserver

VENV_NAME = venv
PYTHON = python3
PIP = $(VENV_NAME)/bin/pip

setvenv:
	$(PYTHON) -m $(VENV_NAME) $(VENV_NAME)
	$(PIP) install -r requirements.txt

runserver: setvenv
	$(PIP) manage.py runserver
