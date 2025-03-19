# nestjs-ecommerce-finalPOS 🚀

- This is a repository created for the backend coding assignment for FinalPOS, 2025

### Coder(s) 🦾

- jarco0204, backend dev

### Libraries

- NestJS (Installed with npm install -g @nestjs/cli)
- @nestjs/swagger swagger-ui-express
- @nestjs/mongoose mongoose
- @nestjs/serve-static
- class-validator & class-transformer

### General Task Instructions 👑

- Design a multi-module Shop and Shopping Cart application with ZERO Module Cohesion

### Database Schema Design

- `Root -> (Product & Shopping Cart)`
- Event-Driven Communication to follow Pub/Sub Pattern to decouple Shopping Cart and Product

### Specific Backend Requirements

- CRUD manipulation for products with the following schema:
  - Name: Maximum length of 64 characters ✅
  - Description: Maximum length of 2048 characters, optional ✅
  - Image: Base64 data URL source, less than 1MB ✅
  - Price: Numeric value ✅
  - Stock: Cannot be negative ✅
- CRUD for Shopping Cart
  - Create a Cart ✅
  - Add a Product ✅
  - Delete a Product from the Cart ✅
  - Edit Quantity of a Product in the Cart ✅
  - Delete the Shopping Cart ✅

### Further Notes

- When Operating with the Cart, the stock for products should be updated correctly
  - Must Handle Edge Cases ✅
- Modules should NOT depend on each other, meaning we must use Standalone Singletons ✅

### Deliverables

- Database schema design ✅
- Node.js application code based on NestJS framework ✅
- Git repository with proper flow and conventional commit messages ✅
- Swagger documentation ✅
- Dockerfile for building the NestJS app container ✅
- docker-compose.yaml file for starting additional services and backend app ✅
- Tests for the NestJS application, covering main functions (optional)

### NEST.JS Learning

- For a typical CRUD feature, one needs a dedicated module, controller, and service.
- You can use generate command in CLI
- Similarities with Angular since NestJS uses decorators, modules, controllers, and dependency injection. This design makes your backend architecture modular and maintainable.
- Microservices (createMicroservice) similar to HTTP Servers except they use different Transport Protocol
- Decorators are special kind function that be attached to methods and other members
  - Injectable indicates is a provider to use dependency injection and follow singleton pattern

### Future

- Since Every Cart will Be Associated with a Payment Record, Add another module called Order to act as a Parent Node for both Cart and Payment
