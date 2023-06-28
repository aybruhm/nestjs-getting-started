# Base image
FROM node:20-bullseye-slim

# Create app directory
WORKDIR /task_management

# Copy application dependency manifests to the container image.
COPY package.json /task_management/
COPY package-lock.json /task_management/

# install app dependencies
RUN --mount=type=cache,target=/root/.cache npm install
RUN npm install yarn

# Bundle app source
COPY . /task_management/