.PHONY:

setvenv:
	python3 -m venv venv && \
	source venv/bin/activate && \
	pip install -r requirements.txt

runserver: setvenv
	cd fsae_backend && \
	python3 manage.py runserver