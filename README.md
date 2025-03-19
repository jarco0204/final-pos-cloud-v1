# NestJS Ecommerce FinalPOS 🚀

This repository contains the backend solution for the FinalPOS coding assignment. The application is built using NestJS and follows a multi-module architecture with ZERO module cohesion, leveraging event-driven communication to decouple modules.

## Overview

This project is a backend implementation of a shop and shopping cart system. It demonstrates:

- A robust CRUD interface for products.
- A shopping cart module that handles cart operations and automatically updates product stock.
- Decoupled modules via an event-driven Pub/Sub pattern.
- Comprehensive testing with Jest (unit and integration tests).
- Containerization with Docker and orchestration with Docker Compose.
- CI/CD integration using GitHub Actions for automated testing and quality assurance.

## Coder(s) 🦾

- jarco0204, Backend Developer

## Libraries & Technologies

- **NestJS:** Framework for building scalable server-side applications.
- **@nestjs/swagger & swagger-ui-express:** Auto-generated API documentation.
- **@nestjs/mongoose & mongoose:** MongoDB integration.
- **@nestjs/serve-static:** Serving static files if required.
- **class-validator & class-transformer:** DTO validation and transformation.
- **Docker & Docker Compose:** Containerization of the application and MongoDB.
- **Jest:** Testing framework for unit and integration tests.
- **GitHub Actions:** CI/CD pipeline to run tests and ensure code quality.

## General Task Instructions 👑

- Design a multi-module Shop and Shopping Cart application with ZERO module cohesion.
- Implement event-driven communication (Pub/Sub) to decouple the Shopping Cart from the Product module.

## Database Schema Design

- **Architecture:** `Root -> (Product & Shopping Cart)`
- **Product Schema:**
  - **Name:** Maximum 64 characters.
  - **Description:** Maximum 2048 characters (optional).
  - **Image:** Base64 data URL (less than 1MB).
  - **Price:** Numeric value.
  - **Stock:** Must not be negative.
- **Shopping Cart Schema:**
  - Contains an array of cart items.
  - Each cart item references a Product (via ObjectId) and includes a quantity.
  - Timestamps for tracking creation and updates are enabled.

## Specific Backend Requirements

- **Products CRUD:**
  - Create, read, update, and delete products.
- **Shopping Cart CRUD:**
  - Create a Cart.
  - Add a Product to the Cart.
  - Delete a Product from the Cart.
  - Edit the Quantity of a Product in the Cart.
  - Delete the Shopping Cart.
- **Stock Management:**
  - When operating with the cart, the product stock is updated correctly using an event-driven approach.
  - Edge cases and concurrency are handled gracefully.

## Deliverables

- **Database Schema Design:** Detailed schema for Product and Shopping Cart.
- **Node.js Application Code:** Developed with NestJS following best practices.
- **Git Repository:** Uses proper Gitflow and conventional commit messages.
- **API Documentation:** Automatically generated via Swagger.
- **Dockerfile:** For building the NestJS app container.
- **docker-compose.yaml:** For starting additional services (MongoDB) and the backend app.
- **Tests:** Comprehensive tests (unit & integration) using Jest.
- **CI/CD Pipeline:** GitHub Actions workflow to automate testing and ensure code quality in QA.

## NEST.JS Learning & Best Practices

- **Modular Architecture:**  
  Each feature (e.g., Product, Shopping Cart) is implemented as a dedicated module with its own controller, service, and schema.
- **Dependency Injection:**  
  Leveraging NestJS's powerful DI system to create maintainable and testable code.
- **Decorator Usage:**  
  Utilization of decorators for controllers, services, DTOs, and Mongoose schemas similar to Angular’s design patterns.
- **Event-Driven Communication:**  
  Implemented a Pub/Sub pattern using `@nestjs/event-emitter` to decouple modules and manage stock updates.
- **Testing Strategy:**
  - **Unit Tests:** Validate individual service methods with Jest and mocks.
  - **Integration Tests:** End-to-end tests using Jest and Supertest to verify API endpoints.
- **Containerization & CI/CD:**  
  Docker is used for local development and testing, while GitHub Actions provides an automated pipeline for continuous integration and testing in QA.

## Docker & CI/CD Integration

- **Docker:**
  - A `Dockerfile` is provided to containerize the NestJS application.
  - `docker-compose.yaml` orchestrates the application alongside MongoDB.
- **CI/CD with GitHub Actions:**
  - The GitHub Actions workflow builds the Docker images, spins up containers, waits for services using a `wait-for-it.sh` script, runs integration tests (via `npm run test:e2e`), and tears down the containers.
  - This setup ensures that every commit and pull request is validated through automated tests.

## Future Enhancements

- **Order Module:**  
  Introduce an Order module to act as a parent node for both Cart and Payment, reflecting that every cart is associated with a payment record.
- **Improved Error Handling:**  
  Enhance exception filters and logging to capture and manage edge cases effectively.
- **Scalability:**  
  Extend the event-driven architecture to integrate additional microservices for notifications, analytics, and more.
