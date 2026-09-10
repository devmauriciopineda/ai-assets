---
description: Backend development standards, best practices, and conventions for Python FastAPI applications including Domain-Driven Design, SOLID principles, architecture patterns, API design, and testing practices
globs: ["app/**/*.py", "pyproject.toml", ".vscode/settings.json"]
alwaysApply: true
---

# Backend Project Standards and Best Practices

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
  - [Core Technologies](#core-technologies)
  - [Database & ORM](#database--orm)
  - [Testing Framework](#testing-framework)
  - [Development Tools](#development-tools)
- [Architecture Overview](#architecture-overview)
  - [Domain-Driven Design (DDD)](#domain-driven-design-ddd)
  - [Layered Architecture](#layered-architecture)
  - [Project Structure](#project-structure)
- [Domain-Driven Design Principles](#domain-driven-design-principles)
  - [Entities](#entities)
  - [Value Objects](#value-objects)
  - [Aggregates](#aggregates)
  - [Repositories](#repositories)
  - [Domain Services](#domain-services)
  - [Additional Recommendations](#additional-recommendations)
- [SOLID and DRY Principles](#solid-and-dry-principles)
  - [Single Responsibility Principle (SRP)](#single-responsibility-principle-srp)
  - [Open/Closed Principle (OCP)](#openclosed-principle-ocp)
  - [Liskov Substitution Principle (LSP)](#liskov-substitution-principle-lsp)
  - [Interface Segregation Principle (ISP)](#interface-segregation-principle-isp)
  - [Dependency Inversion Principle (DIP)](#dependency-inversion-principle-dip)
  - [DRY (Don't Repeat Yourself)](#dry-dont-repeat-yourself)
- [Coding Standards](#coding-standards)
  - [Language and Naming Conventions](#language-and-naming-conventions)
  - [Python Usage](#python-usage)
  - [Error Handling](#error-handling)
  - [Validation Patterns](#validation-patterns)
  - [Logging Standards](#logging-standards)
- [API Design Standards](#api-design-standards)
  - [REST Endpoints](#rest-endpoints)
  - [Request/Response Patterns](#requestresponse-patterns)
  - [Error Response Format](#error-response-format)
  - [CORS Configuration](#cors-configuration)
- [Database Patterns](#database-patterns)
  - [SQLAlchemy Models](#sqlalchemy-models)
  - [Migrations](#migrations)
  - [Repository Pattern](#repository-pattern)
- [Testing Standards](#testing-standards)
  - [Unit Testing](#unit-testing)
  - [Integration Testing](#integration-testing)
  - [Test Coverage Requirements](#test-coverage-requirements)
  - [Mocking Standards](#mocking-standards)
- [Performance Best Practices](#performance-best-practices)
  - [Database Query Optimization](#database-query-optimization)
  - [Async/Await Patterns](#asyncawait-patterns)
  - [Error Handling Performance](#error-handling-performance)
- [Security Best Practices](#security-best-practices)
  - [Input Validation](#input-validation)
  - [Environment Variables](#environment-variables)
  - [Dependency Injection](#dependency-injection)
- [Development Workflow](#development-workflow)
  - [Git Workflow](#git-workflow)
  - [Development Scripts](#development-scripts)
  - [Code Quality](#code-quality)

---

## Overview

This document outlines the best practices, conventions, and standards for FastAPI backend applications developed in Python. The backend follows Domain-Driven Design (DDD) principles and implements a layered architecture to ensure code consistency, maintainability, and scalability.

## Technology Stack

### Core Technologies
- **Python**: Programming language (version 3.11+)
- **FastAPI**: Modern web application framework with automatic documentation
- **Pydantic**: Data validation and settings management
- **Pydantic Settings**: Environment variables and configuration management
- **SQLAlchemy**: SQL toolkit and Object-Relational Mapping (ORM)

### Database & ORM
- **PostgreSQL**: Relational database (via Docker container or cloud)
- **SQLAlchemy**: ORM for database operations and model definition
- **Alembic**: Database migration tool integrated with SQLAlchemy

### Testing Framework
- **pytest**: Testing framework with fixture support
- **pytest-cov**: Code coverage measurement
- **Coverage Threshold**: 80% for coverage targets
- **Test Location**: `tests/` directory with structure mirroring `app/`

### Development Tools
- **black**: Code formatter (line length: 88 characters)
- **isort**: Import statement sorter
- **flake8**: Linting and code style checking
- **mypy**: Static type checking
- **colorlog**: Colored logging output
- **python-dotenv**: Environment variable loading

## Architecture Overview

### Domain-Driven Design (DDD)

Domain-Driven Design is a methodology that focuses on modeling software according to business logic and domain knowledge. By centering development on a deep understanding of the domain, DDD facilitates the creation of complex systems.

**Benefits:**
- **Improved Communication**: Promotes a common language between developers and domain experts, improving communication and reducing interpretation errors.
- **Clear Domain Models**: Helps build models that accurately reflect business rules and processes.
- **High Maintainability**: By dividing the system into subdomains, it facilitates maintenance and software evolution.

### Layered Architecture

The backend follows a layered DDD architecture:

**Presentation Layer** (`app/api/`)
- Routers handle HTTP requests and define endpoints
- Request/response validation using Pydantic schemas
- Routers delegate to services from Application layer

**Application Layer** (`app/services/`)
- Services contain business logic and orchestration
- Input validation and data transformation
- Services use repositories from Domain layer

**Domain Layer** (`app/domain/`)
- Models define core business entities
- Repository interfaces define data access contracts
- Pure business logic without external dependencies

**Infrastructure Layer** (`app/infrastructure/`)
- SQLAlchemy ORM models and database configuration
- Repository implementations satisfying domain interfaces
- Database connection management

### Project Structure

```
app/
├── api/
│   ├── __init__.py
│   ├── v1/
│   │   ├── __init__.py
│   │   ├── endpoints/
│   │   │   ├── __init__.py
│   │   │   ├── users.py          # User-related routes
│   │   │   └── products.py       # Product-related routes
│   │   └── deps.py               # Dependency injection
│   └── router.py                 # Main API router
│
├── domain/
│   ├── __init__.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py               # User entity
│   │   └── product.py            # Product entity
│   └── repositories/
│       ├── __init__.py
│       ├── base.py               # Base repository interface
│       ├── user_repository.py    # User repository interface
│       └── product_repository.py # Product repository interface
│
├── infrastructure/
│   ├── __init__.py
│   ├── db/
│   │   ├── __init__.py
│   │   ├── session.py            # Database session management
│   │   ├── base.py               # SQLAlchemy declarative base
│   │   └── models/
│   │       ├── __init__.py
│   │       ├── user.py           # User ORM model
│   │       └── product.py        # Product ORM model
│   ├── repositories/
│   │   ├── __init__.py
│   │   ├── user_repository.py    # User repository implementation
│   │   └── product_repository.py # Product repository implementation
│   └── logger.py                 # Logging configuration
│
├── schemas/
│   ├── __init__.py
│   ├── user.py                   # User request/response schemas
│   └── product.py                # Product request/response schemas
│
├── services/
│   ├── __init__.py
│   ├── user_service.py           # User business logic
│   └── product_service.py        # Product business logic
│
├── core/
│   ├── __init__.py
│   ├── config.py                 # Settings and configuration
│   ├── exceptions.py             # Custom exceptions
│   └── security.py               # Security utilities
│
├── config/
│   ├── __init__.py
│   └── logging.py                # Logging setup
│
├── main.py                       # Application entry point
└── __init__.py

tests/
├── __init__.py
├── conftest.py                   # Shared test fixtures
├── test_users.py                 # User endpoint tests
├── test_products.py              # Product endpoint tests
├── unit/
│   ├── services/
│   │   └── test_user_service.py
│   └── repositories/
│       └── test_user_repository.py
└── integration/
    └── test_api_endpoints.py

pyproject.toml                    # Project configuration and dependencies
requirements.txt                  # Production dependencies
.env.example                      # Example environment variables
README.md                         # Project documentation
```

## Domain-Driven Design Principles

### Entities

Entities are objects with a distinct identity that persists over time.

**Before:**
```python
# Simple dictionary without methods
user = {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com"
}
```

**After:**
```python
from pydantic import BaseModel, EmailStr
from datetime import datetime

class User(BaseModel):
    id: int | None = None
    first_name: str
    last_name: str
    email: EmailStr
    created_at: datetime | None = None
    
    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"
```

**Explanation**: `User` is an entity because it has a unique identifier (`id`) that distinguishes it from other users. Entities should encapsulate business logic and maintain consistency of their internal state.

**Best Practice**: Entities should include computed properties and methods that encapsulate business logic related to their domain concept.

### Value Objects

Value Objects describe aspects of the domain without conceptual identity. They are defined by their attributes rather than an identifier.

**Before:**
```python
# Simple tuple
address = ("123 Main St", "New York", "NY", "10001")
```

**After:**
```python
from pydantic import BaseModel

class Address(BaseModel):
    street: str
    city: str
    state: str
    postal_code: str
    
    def __str__(self) -> str:
        return f"{self.street}, {self.city}, {self.state} {self.postal_code}"
```

**Explanation**: `Address` is a Value Object that describes location information without requiring a unique identifier. Value Objects are compared by their attributes, not by identity.

**Recommendation**: Use Pydantic models for Value Objects to ensure immutability and validation. Value Objects should not have an `id` field.

### Aggregates

Aggregates are clusters of objects that must be treated as a unit. They have a root entity that enforces invariants and consistency boundaries.

**Before:**
```python
# User and address data handled separately
user = {"id": 1, "name": "John Doe"}
addresses = [{"user_id": 1, "street": "123 Main St"}]
```

**After:**
```python
from typing import List

class User(BaseModel):
    id: int | None = None
    first_name: str
    last_name: str
    email: EmailStr
    addresses: List[Address] = []
    
    def add_address(self, address: Address) -> None:
        self.addresses.append(address)
    
    def remove_address(self, street: str) -> None:
        self.addresses = [addr for addr in self.addresses if addr.street != street]
```

**Explanation**: `User` acts as an aggregate root that manages related `Address` objects. The aggregate enforces consistency boundaries and encapsulates operations on its related entities.

**Recommendation**: Aggregates should be carefully designed to ensure that all operations within the aggregate boundary maintain consistency. Operations that affect child objects should be handled through the aggregate root.

### Repositories

Repositories provide interfaces for accessing aggregates and entities, encapsulating data access logic.

**Before:**
```python
# Direct database access without abstraction
def get_user_by_id(user_id: int):
    return db.query("SELECT * FROM users WHERE id = ?", (user_id,))
```

**After:**
```python
from abc import ABC, abstractmethod

class UserRepository(ABC):
    @abstractmethod
    async def find_by_id(self, user_id: int) -> User | None:
        pass
    
    @abstractmethod
    async def save(self, user: User) -> User:
        pass
    
    @abstractmethod
    async def find_all(self) -> List[User]:
        pass

class SQLAlchemyUserRepository(UserRepository):
    def __init__(self, session):
        self.session = session
    
    async def find_by_id(self, user_id: int) -> User | None:
        db_user = self.session.query(UserModel).filter(
            UserModel.id == user_id
        ).first()
        return self._to_domain_model(db_user) if db_user else None
    
    async def save(self, user: User) -> User:
        db_user = UserModel(**user.dict())
        self.session.add(db_user)
        self.session.commit()
        return self._to_domain_model(db_user)
```

**Explanation**: `UserRepository` provides a clear interface for accessing user data, encapsulating database access logic and separating domain logic from infrastructure concerns.

**Recommendation**: 
- Define repository interfaces in the domain layer using abstract base classes
- Implement repositories using SQLAlchemy in the infrastructure layer
- Use dependency injection to inject repositories into services

### Domain Services

Domain Services contain business logic that doesn't naturally belong to an entity or value object.

**Before:**
```python
# Loose function without clear ownership
def calculate_age(birth_date: datetime) -> int:
    today = datetime.today()
    age = today.year - birth_date.year
    if today.month < birth_date.month or (
        today.month == birth_date.month and today.day < birth_date.day
    ):
        age -= 1
    return age
```

**After:**
```python
from datetime import datetime

class UserService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository
    
    @staticmethod
    def calculate_age(birth_date: datetime) -> int:
        today = datetime.today()
        age = today.year - birth_date.year
        if today.month < birth_date.month or (
            today.month == birth_date.month and today.day < birth_date.day
        ):
            age -= 1
        return age
    
    async def get_user_profile(self, user_id: int) -> dict:
        user = await self.user_repository.find_by_id(user_id)
        if not user:
            raise ValueError("User not found")
        
        age = self.calculate_age(user.birth_date)
        return {"user": user, "age": age}
```

**Explanation**: `UserService` encapsulates business logic related to users, providing a centralized point for handling complex operations that involve multiple entities or require orchestration.

### Additional Recommendations

**Use of Factories**

Factories are useful in DDD to encapsulate the logic of creating complex objects, ensuring that all created objects comply with domain rules from the moment of creation.

**Recommendation**: Implement factories for the creation of entities and aggregates, especially those that are complex and require specific initial configuration that complies with business rules.

**Improvement in Relationship Modeling**

Relationships between entities and aggregates must be clear and consistent with business rules.

**Recommendation**: Review and possibly redesign relationships between entities to ensure they accurately reflect domain needs and rules. This may include removing unnecessary relationships or adding new relationships that facilitate business operations.

**Domain Events Integration**

Domain events are an important part of DDD and can be used to handle side effects of domain operations in a decoupled manner.

**Recommendation**: Implement a domain event system that allows entities and aggregates to publish events that other system components can handle without being tightly coupled to the entities that generate them.

## SOLID and DRY Principles

### SOLID Principles

SOLID principles are five object-oriented design principles that help create more understandable, flexible, and maintainable systems.

#### Single Responsibility Principle (SRP)

Each class should have a single responsibility or reason to change.

**Before:**
```python
# A service that handles multiple responsibilities
class UserService:
    def __init__(self, db_session):
        self.db_session = db_session
    
    def create_user(self, user_data: dict):
        # Validation
        if not user_data.get("email"):
            raise ValueError("Email required")
        
        # Database operation
        db_user = UserModel(**user_data)
        self.db_session.add(db_user)
        self.db_session.commit()
        
        # Logging
        print(f"User created: {user_data['email']}")
        
        # Email sending
        send_email(user_data["email"], "Welcome!")
```

**After:**
```python
import logging
from app.domain.repositories import UserRepository

logger = logging.getLogger(__name__)

class UserService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository
    
    async def create_user(self, user_data: UserCreateSchema) -> User:
        user_data.validate()  # Validation
        user = await self.user_repository.save(user_data)
        logger.info(f"User created: {user.email}")
        return user

class EmailService:
    async def send_welcome_email(self, email: str) -> None:
        # Email sending logic
        pass
```

**Explanation**: Each class now has a single, well-defined responsibility. `UserService` handles user creation business logic, while `EmailService` handles email operations.

#### Open/Closed Principle (OCP)

Software entities should be open for extension but closed for modification.

**Before:**
```python
# Direct dependency on specific implementation
class UserService:
    def __init__(self):
        self.db = PostgresDatabase()
    
    async def get_user(self, user_id: int):
        return await self.db.query("SELECT * FROM users WHERE id = ?", user_id)
```

**After:**
```python
from abc import ABC, abstractmethod

class DatabaseConnection(ABC):
    @abstractmethod
    async def query(self, sql: str, params: tuple):
        pass

class UserService:
    def __init__(self, database: DatabaseConnection):
        self.database = database
    
    async def get_user(self, user_id: int):
        return await self.database.query(
            "SELECT * FROM users WHERE id = ?", 
            (user_id,)
        )
```

**Explanation**: `UserService` now depends on an abstraction (`DatabaseConnection`), allowing different implementations without modifying the service.

#### Liskov Substitution Principle (LSP)

Objects of a derived class should be replaceable with objects of the base class without altering the program's functionality.

**Before:**
```python
# Subclass that cannot completely replace its base class
class User:
    def save(self):
        # Database save logic
        pass

class TemporaryUser(User):
    def save(self):
        raise NotImplementedError("Temporary users cannot be saved")
```

**After:**
```python
# Use composition instead of inheritance
class User:
    def __init__(self, repository: UserRepository):
        self.repository = repository
    
    async def save(self):
        return await self.repository.save(self)

class TemporaryUser:
    async def save(self):
        # Appropriate implementation for temporary storage
        return await temporary_storage.store(self)
```

**Explanation**: Avoid inheritance hierarchies that violate LSP. Use composition to provide different behavior while maintaining consistent interfaces.

#### Interface Segregation Principle (ISP)

Many specific interfaces are better than a single general interface.

**Before:**
```python
# Large interface that implementations don't fully use
class EntityRepository(ABC):
    @abstractmethod
    async def create(self, entity): pass
    
    @abstractmethod
    async def read(self, entity_id): pass
    
    @abstractmethod
    async def update(self, entity): pass
    
    @abstractmethod
    async def delete(self, entity_id): pass
    
    @abstractmethod
    async def search(self, filters): pass
    
    @abstractmethod
    async def export_to_csv(self, entities): pass
```

**After:**
```python
# Segregated interfaces
class ReadRepository(ABC):
    @abstractmethod
    async def read(self, entity_id): pass
    
    @abstractmethod
    async def search(self, filters): pass

class WriteRepository(ABC):
    @abstractmethod
    async def create(self, entity): pass
    
    @abstractmethod
    async def update(self, entity): pass
    
    @abstractmethod
    async def delete(self, entity_id): pass

class UserRepository(ReadRepository, WriteRepository):
    pass
```

**Explanation**: Interfaces are segregated into smaller, more specific contracts, allowing implementations to be more focused and maintainable.

#### Dependency Inversion Principle (DIP)

High-level modules should not depend on low-level modules; both should depend on abstractions.

**Before:**
```python
# High-level module depends on low-level module
from app.infrastructure.repositories import SQLAlchemyUserRepository

class UserController:
    def __init__(self):
        self.repository = SQLAlchemyUserRepository()
```

**After:**
```python
# Both depend on abstraction
from app.domain.repositories import UserRepository

class UserController:
    def __init__(self, user_repository: UserRepository):
        self.repository = user_repository

# Dependency injection
router = APIRouter()
user_repository = SQLAlchemyUserRepository()
controller = UserController(user_repository)
```

**Explanation**: Both high-level and low-level modules depend on abstractions, making the code more flexible and testable.

### DRY (Don't Repeat Yourself)

The DRY principle focuses on reducing duplication in code. Each piece of knowledge should have a single, unambiguous, and authoritative representation within a system.

**Before:**
```python
# Repeated validation logic
def create_user(user_data: dict):
    if not user_data.get("email"):
        raise ValueError("Email is required")
    if "@" not in user_data.get("email", ""):
        raise ValueError("Invalid email format")
    # ... more code

def update_user(user_id: int, user_data: dict):
    if not user_data.get("email"):
        raise ValueError("Email is required")
    if "@" not in user_data.get("email", ""):
        raise ValueError("Invalid email format")
    # ... more code
```

**After:**
```python
# Centralized validation
from pydantic import BaseModel, EmailStr

class UserSchema(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str

async def create_user(user_data: UserSchema):
    # Validation is automatic via Pydantic
    user = await user_repository.save(user_data)
    return user

async def update_user(user_id: int, user_data: UserSchema):
    # Same validation applies
    user = await user_repository.update(user_id, user_data)
    return user
```

**Explanation**: Validation logic is centralized in a Pydantic schema, eliminating code duplication and ensuring consistency.

## Coding Standards

### Naming Conventions

- **Variable Naming**: Use `snake_case` for variables and functions (e.g., `user_id`, `create_user`)
- **Class Naming**: Use `PascalCase` for classes (e.g., `User`, `UserRepository`)
- **Constants Naming**: Use `UPPER_SNAKE_CASE` for constants (e.g., `MAX_USERS_PER_PAGE`)
- **Module Naming**: Use `snake_case` for module names (e.g., `user_service.py`, `user_repository.py`)
- **Private Methods**: Use leading underscore for private methods (e.g., `_validate_email()`)

**Examples:**

```python
# Good: Snake case for functions and variables
async def get_user_by_email(email: str) -> User | None:
    # Find user by email in the database
    db_user = db_session.query(UserModel).filter(
        UserModel.email == email
    ).first()
    return User.from_orm(db_user) if db_user else None

# Avoid: Non-English names
async def obtener_usuario_por_email(email: str) -> Usuario | None:
    # Implementation
    pass

# Good: PascalCase for classes
class UserRepository:
    pass

# Avoid: Non-English class names
class RepositorioDeUsuarios:
    pass
```

**Error Messages and Logs:**

```python
# Good: English error messages
logger.error("Failed to create user", extra={"user_email": user.email})
raise ValueError("Email address is already registered")

# Avoid: Non-English messages
logger.error("Error al crear usuario")
raise ValueError("El email ya está registrado")
```

### Python Usage

- **Type Hints**: Use type hints for all function parameters and return types
- **Union Types**: Use `X | Y` syntax (Python 3.10+) instead of `Union[X, Y]`
- **Optional**: Use `X | None` instead of `Optional[X]`
- **Dataclasses/Pydantic**: Use Pydantic for validation and serialization
- **Context Managers**: Use `with` statements for resource management
- **Avoid**: Never use bare `except`, never use `pass` without explanation

```python
# Good: Type hints and Pydantic
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str

async def create_user(user_data: UserCreate) -> User:
    # Implementation with type safety
    pass

# Avoid: Missing type hints
def create_user(user_data):
    # Implementation
    pass
```

### Error Handling

- **Custom Exception Classes**: Create domain-specific exception classes
- **Specific Exceptions**: Catch specific exceptions, not generic `Exception`
- **Error Context**: Provide descriptive error messages with context

```python
# Custom exceptions
class UserNotFoundError(Exception):
    def __init__(self, user_id: int):
        self.user_id = user_id
        super().__init__(f"User with ID {user_id} not found")

class EmailAlreadyRegisteredError(Exception):
    def __init__(self, email: str):
        self.email = email
        super().__init__(f"Email {email} is already registered")

# In service
async def get_user(user_id: int) -> User:
    user = await user_repository.find_by_id(user_id)
    if not user:
        logger.warning(f"User not found", extra={"user_id": user_id})
        raise UserNotFoundError(user_id)
    return user
```

### Validation Patterns

- **Pydantic Schemas**: Use Pydantic models for input validation
- **Custom Validators**: Implement custom validators for complex business rules
- **Validate Early**: Always validate inputs before processing

```python
from pydantic import BaseModel, field_validator, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    age: int
    
    @field_validator("age")
    @classmethod
    def validate_age(cls, v: int) -> int:
        if v < 18:
            raise ValueError("User must be at least 18 years old")
        return v
    
    @field_validator("first_name", "last_name")
    @classmethod
    def validate_names(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Name cannot be empty")
        return v.strip()

# In router
@router.post("/users", response_model=UserResponse)
async def create_user(user_data: UserCreate) -> User:
    # Validation is automatic via Pydantic
    user = await user_service.create_user(user_data)
    return user
```

### Logging Standards

- **Use Logger Module**: Use Python's `logging` module with configuration from `app/config/logging.py`
- **Structured Logging**: Include relevant context in log messages using `extra` parameter
- **Log Levels**: Use appropriate levels (debug, info, warning, error, critical)
- **Avoid Print Statements**: Never use `print()` in production code

```python
import logging

logger = logging.getLogger(__name__)

# Good: Structured logging with context
logger.info("User created successfully", extra={
    "user_id": user.id,
    "user_email": user.email
})

logger.error("Failed to create user", extra={
    "error": str(e),
    "user_email": user_data.email
})

# Avoid: Print statements
print(f"User created: {user.id}")  # Never do this
```

## API Design Standards

### REST Endpoints

- **RESTful Naming**: Use RESTful conventions for endpoint naming
- **HTTP Methods**: Use appropriate HTTP methods (GET, POST, PUT, DELETE, PATCH)
- **Resource-Based URLs**: URLs should represent resources, not actions
- **Versioning**: Use API versioning in the path (e.g., `/api/v1/`)

```python
# Good: RESTful endpoints
GET    /api/v1/users              # List users
GET    /api/v1/users/{id}         # Get user by ID
POST   /api/v1/users              # Create new user
PUT    /api/v1/users/{id}         # Update user
DELETE /api/v1/users/{id}         # Delete user
PATCH  /api/v1/users/{id}         # Partial update

# Avoid: Action-based URLs
GET    /api/v1/users/getById/{id}
POST   /api/v1/users/create
```

### Request/Response Patterns

- **JSON Format**: Use JSON for request and response bodies
- **Consistent Structure**: Maintain consistent response structure across all endpoints
- **Status Codes**: Use appropriate HTTP status codes
- **Pagination**: Implement pagination for list endpoints

```python
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

router = APIRouter()

class UserResponse(BaseModel):
    id: int
    email: str
    first_name: str
    last_name: str

class ListResponse(BaseModel):
    items: list[UserResponse]
    total: int
    page: int
    page_size: int

# Success response with proper status codes
@router.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(user_data: UserCreate) -> UserResponse:
    user = await user_service.create_user(user_data)
    return user

@router.get("/users", response_model=ListResponse)
async def list_users(skip: int = 0, limit: int = 10) -> ListResponse:
    users, total = await user_service.list_users(skip, limit)
    return ListResponse(items=users, total=total, page=skip // limit, page_size=limit)
```

### Error Response Format

- **Consistent Format**: All errors should follow the same response structure
- **Error Codes**: Use meaningful error codes for different error types
- **HTTP Status Codes**: Map errors to appropriate HTTP status codes
- **Exception Handlers**: Use FastAPI exception handlers for consistent error responses

```python
from fastapi import FastAPI, HTTPException, status
from fastapi.responses import JSONResponse

app = FastAPI()

class APIError(BaseModel):
    detail: str
    code: str
    status_code: int

@app.exception_handler(UserNotFoundError)
async def user_not_found_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={
            "detail": str(exc),
            "code": "USER_NOT_FOUND",
            "status_code": 404
        }
    )

@app.exception_handler(EmailAlreadyRegisteredError)
async def email_registered_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "detail": str(exc),
            "code": "EMAIL_ALREADY_REGISTERED",
            "status_code": 400
        }
    )
```

### CORS Configuration

- **Enable CORS**: Configure CORS to allow frontend origin
- **Secure Configuration**: Only allow specific origins in production
- **Credentials**: Configure credentials handling appropriately

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Database Patterns

### SQLAlchemy Models

- **ORM Models**: Define SQLAlchemy ORM models in `app/infrastructure/db/models/`
- **Base Model**: Create a base model with common fields (id, created_at, updated_at)
- **Relationships**: Use SQLAlchemy relationships for entity associations
- **Naming Conventions**: Use `snake_case` for table and column names

```python
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from app.infrastructure.db.base import Base

class UserModel(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    addresses = relationship("AddressModel", back_populates="user")
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email})>"
```

### Migrations

- **Alembic**: Use Alembic for database version control
- **Migration Naming**: Use descriptive names for migrations
- **Review Migrations**: Review migration files before applying

```bash
# Create migration
alembic revision --autogenerate -m "Add user table"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

### Repository Pattern

- **Repository Interfaces**: Define repository interfaces in the domain layer
- **SQLAlchemy Implementation**: Implement repositories using SQLAlchemy in the infrastructure layer
- **Dependency Injection**: Inject repositories into services

```python
# Domain layer interface
from abc import ABC, abstractmethod
from typing import List
from app.domain.models import User

class UserRepository(ABC):
    @abstractmethod
    async def find_by_id(self, user_id: int) -> User | None:
        pass
    
    @abstractmethod
    async def find_by_email(self, email: str) -> User | None:
        pass
    
    @abstractmethod
    async def save(self, user: User) -> User:
        pass
    
    @abstractmethod
    async def find_all(self, skip: int = 0, limit: int = 10) -> tuple[List[User], int]:
        pass
    
    @abstractmethod
    async def delete(self, user_id: int) -> bool:
        pass

# Infrastructure layer implementation
from sqlalchemy.orm import Session
from app.infrastructure.db.models import UserModel

class SQLAlchemyUserRepository(UserRepository):
    def __init__(self, session: Session):
        self.session = session
    
    async def find_by_id(self, user_id: int) -> User | None:
        db_user = self.session.query(UserModel).filter(
            UserModel.id == user_id
        ).first()
        return self._to_domain_model(db_user) if db_user else None
    
    async def save(self, user: User) -> User:
        db_user = UserModel(**user.dict(exclude={"id"}))
        self.session.add(db_user)
        self.session.commit()
        self.session.refresh(db_user)
        return self._to_domain_model(db_user)
    
    def _to_domain_model(self, db_user: UserModel) -> User:
        return User.from_orm(db_user)
```

## Testing Standards

The project has strict requirements for code quality and maintainability. These are the unit testing standards and best practices that must be applied.

### Test File Structure
- Use descriptive test file names: `test_[module_name].py`
- Place test files in `tests/` directory with structure mirroring `app/`
- Use pytest as the testing framework
- Maintain 80% code coverage threshold

### Test Organization Pattern

Template:
```python
import pytest
from unittest.mock import AsyncMock, patch

class TestUserService:
    @pytest.fixture
    def mock_repository(self):
        return AsyncMock()
    
    @pytest.fixture
    def service(self, mock_repository):
        return UserService(user_repository=mock_repository)
    
    class TestFindById:
        @pytest.mark.asyncio
        async def test_returns_user_when_found(self, service, mock_repository):
            # Arrange
            user_id = 1
            expected_user = User(id=1, email="test@example.com")
            mock_repository.find_by_id.return_value = expected_user
            
            # Act
            result = await service.find_by_id(user_id)
            
            # Assert
            assert result == expected_user
            mock_repository.find_by_id.assert_called_once_with(user_id)
        
        @pytest.mark.asyncio
        async def test_raises_error_when_user_not_found(self, service, mock_repository):
            # Arrange
            user_id = 999
            mock_repository.find_by_id.return_value = None
            
            # Act & Assert
            with pytest.raises(UserNotFoundError):
                await service.find_by_id(user_id)
```

### Test Case Naming Convention
- Use descriptive, behavior-driven naming: `test_should_[expected_behavior]_when_[condition]`
- Group related tests using test classes
- Use clear names that describe the scenario being tested

### Test Structure (AAA Pattern)
Always follow the Arrange-Act-Assert pattern:
```python
@pytest.mark.asyncio
async def test_should_create_user_successfully_when_valid_data_provided():
    # Arrange - Set up test data and mocks
    user_data = UserCreate(
        email="test@example.com",
        first_name="John",
        last_name="Doe",
        age=30
    )
    mock_repository = AsyncMock()
    service = UserService(user_repository=mock_repository)
    
    # Act - Execute the function under test
    result = await service.create_user(user_data)
    
    # Assert - Verify the expected behavior
    assert result.email == user_data.email
    mock_repository.save.assert_called_once()
```

### Mocking Standards

- Mock all external dependencies (repositories, services, database clients)
- Use `AsyncMock` for async functions
- Mock repository layers in service tests
- Mock service layers in endpoint tests
- Use pytest fixtures for reusable mocks
- Clear mocks between tests

```python
import pytest
from unittest.mock import AsyncMock

@pytest.fixture
def mock_user_repository():
    return AsyncMock()

@pytest.fixture
def user_service(mock_user_repository):
    return UserService(user_repository=mock_user_repository)

@pytest.mark.asyncio
async def test_get_user(user_service, mock_user_repository):
    # Setup mock
    mock_user_repository.find_by_id.return_value = User(id=1, email="test@example.com")
    
    # Execute
    result = await user_service.get_user(1)
    
    # Assert
    assert result.id == 1
    mock_user_repository.find_by_id.assert_called_once_with(1)
```

### Test Coverage Requirements

- **Comprehensive test coverage**: Include these test categories for each function:
  1. **Happy Path Tests**: Valid inputs producing expected outputs
  2. **Error Handling Tests**: Invalid inputs, missing data, database errors
  3. **Edge Cases**: Boundary values, null/undefined inputs, empty data
  4. **Validation Tests**: Input validation, business rule enforcement
  5. **Integration Points**: External service calls, database operations

- **Threshold**: 80% coverage target
- **Coverage Reports**: Generate coverage reports with `pytest --cov=app tests/`
- **Coverage Files**: Coverage reports should be reviewed before merging

### Integration Testing

- **Endpoint Testing**: Test API endpoints with real request/response cycle
- **Database Testing**: Test repository implementations with actual database (or test database)
- **Service Testing**: Test services with mocked repositories
- **End-to-End Flow**: Test complete request flows

```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

@pytest.mark.asyncio
async def test_create_user_endpoint():
    # Act
    response = client.post(
        "/api/v1/users",
        json={
            "email": "test@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "age": 30
        }
    )
    
    # Assert
    assert response.status_code == 201
    assert response.json()["email"] == "test@example.com"
```






### Error Testing
- Test both expected errors and unexpected errors
- Verify error messages are descriptive and helpful
- Test error propagation through service layers
- Ensure proper HTTP status codes in endpoint tests

### Endpoint Testing Specifics
- Use `TestClient` for testing FastAPI endpoints
- Test HTTP request/response handling
- Verify parameter parsing and validation
- Test error response formatting
- Test async endpoint execution

### Service Testing Specifics
- Mock domain models and repositories
- Test business logic in isolation
- Verify data transformation and validation
- Test error handling and edge cases
- Mock external dependencies and third-party services

### Database Testing
- Use test database or fixtures
- Test both successful and failed database operations
- Verify correct queries and parameters
- Test transaction handling and rollback scenarios

### Async Testing
- Always use `async/await` for asynchronous operations
- Use `pytest.mark.asyncio` decorator for async tests
- Use `asyncio.gather()` for concurrent operations
- Properly handle asyncio exceptions in tests

### Test Data Management
- Use pytest fixtures for reusable test data
- Keep test data consistent and realistic
- Avoid hardcoded values in multiple places
- Use meaningful test data that reflects real-world scenarios

### Code Quality Standards

#### Python Usage
- Use type hints for all test parameters and return values
- Define proper Pydantic models for mock data
- Use assertions that match pytest conventions
- Leverage Python's type system for better test reliability

#### Documentation
- Write clear, descriptive test names that explain the scenario
- Add comments for complex test setups
- Document any special test conditions or edge cases
- Keep test code as readable as production code

#### Performance Considerations
- Keep tests fast and focused
- Avoid unnecessary async operations in tests
- Use appropriate mock strategies to avoid real I/O
- Group related tests to minimize setup/teardown overhead

### Integration with Development Workflow
- Run tests before every commit: `pytest`
- Ensure all tests pass before merging
- Use test-driven development when appropriate
- Update tests when modifying existing functionality
- Check coverage with: `pytest --cov=app tests/`

### Common Anti-Patterns to Avoid
- Don't test implementation details, test behavior
- Don't create overly complex test setups
- Don't ignore failing tests or skip error scenarios
- Don't use real database connections in unit tests
- Don't create tests that depend on external services
- Don't write tests that are too tightly coupled to implementation



## Performance Best Practices

### Database Query Optimization

- **Select Specific Fields**: Only select fields that are needed using SQLAlchemy's `with_entities()`
- **Use Indexes**: Ensure proper database indexes for frequently queried fields
- **Avoid N+1 Queries**: Use SQLAlchemy's `joinedload()` or `selectinload()` for related data

```python
from sqlalchemy.orm import selectinload, joinedload

# Good: Fetch related data efficiently
user = session.query(UserModel).options(
    joinedload(UserModel.addresses),
    joinedload(UserModel.orders)
).filter(UserModel.id == user_id).first()

# Avoid: N+1 queries
user = session.query(UserModel).filter(UserModel.id == user_id).first()
addresses = session.query(AddressModel).filter(AddressModel.user_id == user_id).all()
orders = session.query(OrderModel).filter(OrderModel.user_id == user_id).all()
```

### Async/Await Patterns

- **Always Use Async/Await**: Use async/await with AsyncSession for database operations
- **Error Handling**: Properly handle errors in async operations
- **Parallel Operations**: Use `asyncio.gather()` for parallel operations when appropriate

```python
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession

# Good: Parallel operations
async def get_user_data(user_id: int, session: AsyncSession):
    users, orders, addresses = await asyncio.gather(
        user_repository.find_by_id(user_id),
        order_repository.find_by_user_id(user_id),
        address_repository.find_by_user_id(user_id)
    )
    return {"user": users, "orders": orders, "addresses": addresses}

# Avoid: Sequential operations
async def get_user_data_slow(user_id: int, session: AsyncSession):
    user = await user_repository.find_by_id(user_id)
### Error Handling Performance

- **Early Returns**: Return early to avoid unnecessary processing
- **Error Propagation**: Let errors propagate naturally through the call stack
- **Avoid Over-Wrapping**: Don't wrap errors unnecessarily

## Security Best Practices

### Input Validation

- **Validate All Inputs**: Validate all user inputs with Pydantic before processing
- **Sanitize Data**: Sanitize data to prevent injection attacks
- **Type Checking**: Use type hints and Pydantic for type safety

```python
from pydantic import BaseModel, field_validator, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        return v
```

### Environment Variables

- **Never Commit Secrets**: Never commit `.env` files or secrets to version control
- **Use Environment Variables**: Use pydantic-settings for configuration
- **Validate Environment**: Validate required environment variables at startup

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    secret_key: str
    debug: bool = False
    
    class Config:
        env_file = ".env"

settings = Settings()
```

### Dependency Injection

- **Inject Services**: Inject services and repositories via FastAPI dependency system
- **Avoid Global State**: Avoid global state for database connections
- **Testability**: Use dependency injection to improve testability

```python
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from app.infrastructure.db.session import get_db

app = FastAPI()

@app.get("/users/{user_id}")
async def get_user(user_id: int, db: Session = Depends(get_db)):
    user = await user_repository.find_by_id(user_id)
    return user
```

### Authentication & Authorization

- **JWT Tokens**: Use JWT for API authentication
- **Secure Headers**: Include security headers (CORS, Content-Type, etc.)
- **Rate Limiting**: Implement rate limiting for endpoints
- **HTTPS Only**: Always use HTTPS in production

```python
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer
import jwt

security = HTTPBearer()

async def verify_token(credentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, settings.secret_key, algorithms=["HS256"])
        return payload
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
```

## Development Workflow

### Git Workflow

- **Feature Branches**: Develop features in separate branches using clear descriptive names
- **Descriptive Commits**: Write descriptive commit messages in English
- **Code Review**: Code review before merging
- **Small Branches**: Keep branches small and focused

### Development Scripts

```bash
# Setup
pip install -r requirements.txt

# Development
python -m uvicorn app.main:app --reload

# Testing
pytest                          # Run all tests
pytest --cov=app tests/        # Run tests with coverage
pytest tests/test_users.py     # Run specific test file

# Code Quality
black app/                      # Format code
isort app/                      # Sort imports
flake8 app/                     # Lint code
mypy app/                       # Type checking

# Database
alembic upgrade head            # Apply migrations
alembic downgrade -1            # Rollback migration
```

### Code Quality

- **Black Formatting**: Run Black before commits (`black app/`)
- **Import Sorting**: Use isort for consistent imports (`isort app/`)
- **Type Checking**: Ensure mypy passes without errors (`mypy app/`)
- **All Tests Passing**: Ensure all tests pass before deployment (`pytest`)
- **Code Review**: Review code for adherence to standards

This document serves as the foundation for maintaining code quality and consistency across the image classification backend application. All team members should follow these practices to ensure a maintainable, scalable, and testable codebase.
