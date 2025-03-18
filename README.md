# nestjs-ecommerce-finalPOS 🚀
- This is a repository created for the backend coding assignment for FinalPOS, 2025

### Coder(s) 🦾
- jarco0204, backend dev

### Libraries
- NestJS (Installed with npm install -g @nestjs/cli)

### General Task Instructions 👑
- Use Git for Code Management with NestJS Code Conventions
- Design a multi-module application with ZERO Module Cohesion
- Simple Shop and Shopping Cart Pages

### Specific Backend Requirements
- CRUD manipulation for products with the following schema:
    - Name: Maximum length of 64 characters
    - Description: Maximum length of 2048 characters, optional
    - Image: Base64 data URL source, less than 1MB
    - Price: Numeric value
    - Stock: Cannot be negative
- CRUD for Shopping Cart
    - Create a Cart
    - Add a Product
    - Delete a Product from the Cart
    - Edit Quantity of a Product in the Cart
    - Delete the Shopping Cart

### Further Notes
- When Operating with the Cart, the stock for products should be updated correctly
    - Must Handle Edge Cases
- Modules should NOT depend on each other, meaning we must use Standalone Singletons

### Deliverables
- Database schema design
- Node.js application code based on NestJS framework
- Swagger documentation
- Dockerfile for building the NestJS app container
    - docker-compose.yaml file for starting additional services and backend app
- Tests for the NestJS application, covering main functions (optional)
- Git repository with proper gitflow and conventional commit messages
