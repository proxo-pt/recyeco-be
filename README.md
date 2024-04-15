# Recyeco Mart - Backend

This repository contains the backend codebase for constructing APIs using **Express** and **PostgreSQL**. It's tailored for **Recyeco's Front-End (FE)** developers to streamline their application development process.

## Requirements

Before getting started, ensure you have the following prerequisites:

- **Node.js** (version 18 or later)
- **Docker** and **docker-compose**
- **npm** or **yarn** (Package Manager)

## Installation

Follow these steps to install and set up the backend using Docker Compose:

1. **Clone the repository**

   ```bash
   git clone https://github.com/proxo-pt/recyeco-be
   ```

2. **Navigate to the project directory**

   ```bash
   cd recyeco-backend
   ```

3. **Copy environment variables**

   Copy the `.env.example` file to `.env` and fill in the necessary environment variables.

4. **Build and start containers**

   ```bash
   docker-compose up -d
   ```

## Running the Server

To start the server, use one of the following commands:

- Using npm:
  ```bash
  npm start
  ```
- Using yarn:
  ```bash
  yarn start
  ```
- Using nodemon (for development):
  ```bash
  nodemon index
  ```

## Docker Compose Configuration

The `docker-compose.yml` file is configured to set up the PostgreSQL database and tables within Docker containers. Ensure that Docker and docker-compose are properly installed and running on your system.

## Package Manager

You can use either npm or yarn as your package manager. Choose one and stick to it throughout the project.

## Contributing

Feel free to contribute to this project by submitting pull requests or raising issues.
