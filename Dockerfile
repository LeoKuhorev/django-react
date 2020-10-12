#python version
FROM python:3.8-slim

# ENV settings
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Setting up work directory
RUN mkdir /code
WORKDIR /code

# Install dependencies
COPY requirements.txt /code/
RUN pip install -r requirements.txt

COPY . /code