.PHONY: setvenv runserver

setvenv:
	python3 -m venv venv
	venv/bin/pip install -r requirements.txt

runserver: setvenv
	venv/bin/python3 fsae_backend/manage.py runserver
