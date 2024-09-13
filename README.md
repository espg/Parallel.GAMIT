# React + TypeScript + Vite

## Prerequisites

- Docker must be installed on your machine.

## Setup

1. Check the `.env.sample` file and update the server URL to where the API is hosted. Rename it to `.env`.

## Running the Project

- To start the project using Docker, run:

  ```bash
  docker-compose up --build -d
  ```
  
This will build the Docker image and start the application in detached mode.

- The application will be available at http://localhost:80.

## Development

- To run the project locally without Docker, use:

  ```bash
  npm install
  npm run dev
  ```
This will start the development server on your local machine.
