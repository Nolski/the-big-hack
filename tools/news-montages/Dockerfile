FROM python:3.12.7-slim-bookworm

RUN apt-get update \
    && apt-get install -y --no-install-recommends ffmpeg fonts-dejavu-core \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /repo
ENV PYTHONDONTWRITEBYTECODE=1
