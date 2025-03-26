FROM homeassistant/home-assistant:latest

RUN apk add --no-cache \
  nodejs \
  npm \
  git

WORKDIR /local/custom_components