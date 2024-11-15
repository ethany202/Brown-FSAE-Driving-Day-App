.PHONY: venv run clean

PYTHON = python3
VENV_NAME = venv
PIP = $(VENV_NAME)/bin/pip

venv: $(VENV_NAME)/bin/activate

# make venv
$(VENV_NAME)/bin/activate: requirements.txt
	$(PYTHON) -m venv $(VENV_NAME)
	. $(VENV_NAME)/bin/activate && $(PIP) install -r requirements.txt

# run 
run: venv
	. $(VENV_NAME)/bin/activate && $(PYTHON) fsae_backend/manage.py runserver

clean:
	rm -rf $(VENV_NAME)


