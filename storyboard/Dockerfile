# Base image pinned by digest for full reproducibility (supply-chain hardening).
FROM python:3.12.7-slim-bookworm@sha256:60d9996b6a8a3689d36db740b49f4327be3be09a21122bd02fb8895abb38b50d

# System tools: an SSH/scp client to reach the GPU host, and git (read-only)
# for the in-app Scene Review diff. Both from Debian's GPG-signed distro repos;
# no third-party apt sources.
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssh-client=1:9.2p1-2+deb12u10 git \
    && rm -rf /var/lib/apt/lists/*

ENV PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install pinned Python deps in their own layer (no app code yet => cache-friendly,
# and the dependency surface is fully isolated from the host Python).
COPY requirements.txt /app/requirements.txt
RUN pip install --no-deps -r requirements.txt

# App code is bind-mounted at runtime (see docker-compose.yml), so the image
# itself stays just "pinned deps + ssh client".
EXPOSE 8008
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8008"]
