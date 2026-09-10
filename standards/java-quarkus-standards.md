---
description: Backend development standards, best practices, and conventions for Java/Quarkus applications including Domain-Driven Design, SOLID principles, architecture patterns, API design, persistence, and testing practices
globs: ["backend/src/main/java/**/*.java", "backend/src/main/resources/**/*.{yml,yaml,properties,xml}", "backend/src/test/java/**/*.java", "backend/pom.xml", "backend/mvnw", "backend/Dockerfile"]
alwaysApply: true
---

# Backend Project Standards and Best Practices

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
  - [Core Technologies](#core-technologies)
  - [Database and ORM](#database-and-orm)
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
	- [Java Usage](#java-usage)
  - [Error Handling](#error-handling)
  - [Validation Patterns](#validation-patterns)
  - [Logging Standards](#logging-standards)
- [API Design Standards](#api-design-standards)
  - [REST Endpoints](#rest-endpoints)
  - [Request and Response Patterns](#request-and-response-patterns)
  - [Error Response Format](#error-response-format)
  - [CORS Configuration](#cors-configuration)
- [Database Patterns](#database-patterns)
  - [JPA Entity Model](#jpa-entity-model)
  - [Migrations](#migrations)
  - [Repository Pattern](#repository-pattern)
- [Testing Standards](#testing-standards)
  - [Unit Testing](#unit-testing)
  - [Integration Testing](#integration-testing)
  - [Native Testing](#native-testing)
  - [Test Coverage Requirements](#test-coverage-requirements)
  - [Mocking Standards](#mocking-standards)
- [Performance Best Practices](#performance-best-practices)
  - [Database Query Optimization](#database-query-optimization)
  - [Asynchronous and Reactive Patterns](#asynchronous-and-reactive-patterns)
  - [Build-Time Optimization and Native Readiness](#build-time-optimization-and-native-readiness)
- [Security Best Practices](#security-best-practices)
  - [Input Validation](#input-validation)
  - [Environment Variables and Configuration](#environment-variables-and-configuration)
  - [Dependency Injection and Contexts](#dependency-injection-and-contexts)
- [Observability Standards](#observability-standards)
  - [Health Checks](#health-checks)
  - [Metrics and Tracing](#metrics-and-tracing)
  - [OpenAPI and API Documentation](#openapi-and-api-documentation)
- [Development Workflow](#development-workflow)
  - [Git Workflow](#git-workflow)
  - [Development Scripts](#development-scripts)
  - [Code Quality](#code-quality)

---

## Overview

This document defines standards, conventions, and best practices for Java/Quarkus backend applications. It preserves Domain-Driven Design (DDD) and layered architecture principles, while adopting Quarkus-specific design decisions for build-time optimization, cloud-native execution, and optional native compilation.

## Technology Stack

### Core Technologies
- **Java 21 (LTS)**: Runtime and language baseline for modern development
- **Quarkus 3.x**: Build-time optimized, cloud-native Java framework
- **RESTEasy Reactive (JAX-RS)**: REST API development
- **Maven 3.9+**: Build and dependency management

### Database and ORM
- **PostgreSQL**: Relational database
- **Hibernate ORM with Panache (optional)**: ORM and repository support
- **Jakarta Persistence (JPA)**: Domain model and persistence contracts
- **Flyway or Liquibase**: Database migration tool

### Testing Framework
- **JUnit 5**: Testing framework
- **Mockito**: Mocking framework
- **Quarkus Test**: Integration testing support (`@QuarkusTest`)
- **Coverage Threshold**: 90% for branches, functions, lines, and statements

### Development Tools
- **Checkstyle or Spotless**: Code style and formatting
- **PMD and SpotBugs**: Static analysis
- **JaCoCo**: Coverage reporting
- **Quarkus Maven Plugin**: Dev mode, packaging, and native build support

## Architecture Overview

### Domain-Driven Design (DDD)

Domain-Driven Design is a methodology that focuses on modeling software according to business logic and domain knowledge. By centering development on a deep understanding of the domain, DDD facilitates the creation of complex systems.

**Benefits:**
- **Improved Communication**: Promotes a common language between developers and domain experts, improving communication and reducing interpretation errors.
- **Clear Domain Models**: Helps build models that accurately reflect business rules and processes.
- **High Maintainability**: By dividing the system into subdomains, it facilitates maintenance and software evolution.

### Layered Architecture

The backend follows a layered DDD architecture:

**Presentation Layer** (`resource`)
- Resource classes handle HTTP requests and responses using JAX-RS
- Endpoints are defined with clear API contracts
- Resource classes must remain thin and delegate business logic

**Application Layer** (`service` + `util`)
- Services contain business logic and orchestration
- Utility components support reusable cross-cutting operations
- Transaction boundaries are defined at service methods

**Domain Layer** (`entity` + `dto`)
- Entities define core domain concepts and persistence identity
- DTOs represent request/response and cross-layer contracts
- Domain rules stay close to domain concepts

**Persistence Layer** (`repository`)
- Repository interfaces define data access contracts
- Hibernate ORM or Panache repositories encapsulate persistence operations
- JPA mappings are explicit and consistent

### Project Structure

```text
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/app/
│   │   │       ├── resource/        # JAX-RS request handlers
│   │   │       ├── service/         # Business logic services
│   │   │       ├── util/            # Utility and helper components
│   │   │       ├── repository/      # Persistence repositories
│   │   │       ├── entity/          # JPA entities
│   │   │       ├── dto/             # API and service DTOs
│   │   │       ├── config/          # Quarkus and CDI configuration
│   │   │       ├── exception/       # Custom exceptions and mappers
│   │   │       └── Application.java # Optional startup entry point
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── db/migration/        # Flyway migrations
│   │       └── import.sql           # Optional bootstrap data for local dev
│   └── test/
│       └── java/com/example/app/    # Unit and integration tests
├── pom.xml
├── mvnw
└── Dockerfile
```

## Domain-Driven Design Principles

### Entities

Entities are objects with a distinct identity that persists over time.

**Before:**
```java
Map<String, Object> candidate = Map.of(
	"id", 1L,
	"firstName", "John",
	"lastName", "Doe",
	"email", "john.doe@example.com"
);
```

**After:**
```java
@Entity
@Table(name = "candidates")
public class Candidate {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String firstName;

	@Column(nullable = false)
	private String lastName;

	@Column(nullable = false, unique = true)
	private String email;

	public void validateEmail() {
		if (email == null || !email.contains("@")) {
			throw new IllegalArgumentException("Invalid email");
		}
	}
}
```

**Explanation**: `Candidate` is an entity because it has a unique identifier (`id`) that distinguishes it from other candidates, even if other properties are identical.

**Best Practice**: Entities should encapsulate business logic related to their domain concept and maintain consistency of their internal state.

### Value Objects

Value Objects describe aspects of the domain without conceptual identity. They are defined by their attributes rather than an identifier.

**Before:**
```java
Map<String, Object> education = Map.of(
	"institution", "University",
	"degree", "Bachelor",
	"startDate", LocalDate.of(2010, 1, 1),
	"endDate", LocalDate.of(2014, 1, 1)
);
```

**After:**
```java
@Embeddable
public class Education {

	@Column(name = "institution", nullable = false)
	private String institution;

	@Column(name = "title", nullable = false)
	private String title;

	@Column(name = "start_date", nullable = false)
	private LocalDate startDate;

	@Column(name = "end_date")
	private LocalDate endDate;
}
```

**Explanation**: `Education` can be treated as a Value Object when it has no independent lifecycle and only makes sense within the aggregate boundary.

**Recommendation**: Prefer `@Embeddable` and immutable design for Value Objects. Use entity identity only when independent lifecycle or cross-aggregate references are required.

### Aggregates

Aggregates are clusters of objects that must be treated as a unit. They have a root entity that enforces invariants and consistency boundaries.

**Before:**
```java
Candidate candidate = candidateRepository.findById(1L).orElseThrow();
List<EducationRecord> educations = educationRepository.findByCandidateId(1L);
```

**After:**
```java
@Entity
@Table(name = "candidates")
public class Candidate {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ElementCollection
	@CollectionTable(name = "candidate_educations", joinColumns = @JoinColumn(name = "candidate_id"))
	private List<Education> educations = new ArrayList<>();

	public void addEducation(Education education) {
		this.educations.add(education);
	}
}
```

**Explanation**: `Candidate` acts as an aggregate root that controls consistency for associated concepts such as education or work history.

**Recommendation**: Operations that affect child members inside an aggregate should be executed through the aggregate root in the service layer.

### Repositories

Repositories provide interfaces for accessing aggregates and entities, encapsulating data access logic.

**Before:**
```java
public Candidate loadCandidate(Long id) {
	return entityManager.createQuery("select c from Candidate c where c.id = :id", Candidate.class)
		.setParameter("id", id)
		.getSingleResult();
}
```

**After:**
```java
@ApplicationScoped
public class CandidateRepository implements PanacheRepository<Candidate> {

	public Optional<Candidate> findByEmail(String email) {
		return find("email", email).firstResultOptional();
	}
}

@ApplicationScoped
public class CandidateService {

	@Inject
	CandidateRepository candidateRepository;

	public Optional<Candidate> findById(Long id) {
		return candidateRepository.findByIdOptional(id);
	}
}
```

**Explanation**: `CandidateRepository` provides a clear contract for candidate access while the service layer coordinates business behavior.

**Recommendation:**
- Define repository contracts per aggregate root
- Keep shared repositories in shared modules in multi-module projects
- Place custom queries behind repository interfaces and avoid persistence logic in resource classes
- Use Panache when it improves readability, not as a mandatory style

### Domain Services

Domain Services contain business logic that does not naturally belong to an entity or value object.

**Before:**
```java
public int calculateAge(LocalDate birthDate) {
	return Period.between(birthDate, LocalDate.now()).getYears();
}
```

**After:**
```java
@ApplicationScoped
public class CandidateDomainService {

	public int calculateAge(Candidate candidate) {
		return Period.between(candidate.getBirthDate(), LocalDate.now()).getYears();
	}
}
```

**Explanation**: `CandidateDomainService` encapsulates domain operations that involve business rules crossing entity boundaries.

### Additional Recommendations

**Use of Factories**

Factories are useful in DDD to encapsulate the logic of creating complex objects, ensuring that all created objects comply with domain rules from the moment of creation.

**Recommendation**: Implement factories for creation of entities and aggregates when constructors become complex or invariants require orchestration.

**Improvement in Relationship Modeling**

Relationships between entities and aggregates must be clear and consistent with business rules.

**Recommendation**: Design JPA associations intentionally (`@OneToMany`, `@ManyToOne`, `@OneToOne`) with clear ownership, fetch strategy, and cascade behavior.

**Domain Events Integration**

Domain events are important in DDD and can be used to handle side effects of domain operations in a decoupled manner.

**Recommendation**: Implement domain event publication through CDI events or messaging infrastructure to decouple side effects from core use cases.

## SOLID and DRY Principles

### SOLID Principles

SOLID principles are five object-oriented design principles that help create more understandable, flexible, and maintainable systems.

#### Single Responsibility Principle (SRP)

Each class should have a single responsibility or reason to change.

**Before:**
```java
public class CandidateProcessor {

	public void process(Candidate candidate) {
		if (candidate.getEmail() == null || !candidate.getEmail().contains("@")) {
			throw new IllegalArgumentException("Invalid email");
		}
		candidateRepository.persist(candidate);
		emailClient.sendCreatedNotification(candidate);
	}
}
```

**After:**
```java
public class CandidateValidator {
	public void validate(Candidate candidate) {
		if (candidate.getEmail() == null || !candidate.getEmail().contains("@")) {
			throw new IllegalArgumentException("Invalid email");
		}
	}
}

@ApplicationScoped
public class CandidateService {

	@Inject
	CandidateValidator validator;

	@Inject
	CandidateRepository repository;

	@Transactional
	public Candidate create(Candidate candidate) {
		validator.validate(candidate);
		repository.persist(candidate);
		return candidate;
	}
}
```

**Explanation**: Validation and persistence responsibilities are separated, improving maintainability and testability.

#### Open/Closed Principle (OCP)

Software entities should be open for extension but closed for modification.

**Before:**
```java
public class NotificationService {
	public void send(String channel, String message) {
		if ("EMAIL".equals(channel)) {
			// email
		} else if ("SMS".equals(channel)) {
			// sms
		}
	}
}
```

**After:**
```java
public interface NotificationChannel {
	void send(String message);
}

@ApplicationScoped
public class EmailNotificationChannel implements NotificationChannel {
	public void send(String message) {
		// email
	}
}

@ApplicationScoped
public class SmsNotificationChannel implements NotificationChannel {
	public void send(String message) {
		// sms
	}
}
```

**Explanation**: New channels are introduced through extension, without changing existing implementations.

#### Liskov Substitution Principle (LSP)

Objects of a derived class should be replaceable with objects of the base class without altering the program's functionality.

**Before:**
```java
public class TemporaryCandidateService extends CandidateService {
	@Override
	public Candidate create(Candidate candidate) {
		throw new UnsupportedOperationException("Not supported");
	}
}
```

**After:**
```java
public class TemporaryCandidateService extends CandidateService {
	@Override
	public Candidate create(Candidate candidate) {
		return super.create(candidate);
	}
}
```

**Explanation**: Derived services must keep contract behavior and remain safely substitutable.

#### Interface Segregation Principle (ISP)

Many specific interfaces are better than a single general interface.

**Before:**
```java
public interface CandidateOperations {
	Candidate save(Candidate candidate);
	Candidate update(Candidate candidate);
	void sendEmail(Candidate candidate);
	byte[] generateReport(Long candidateId);
}
```

**After:**
```java
public interface CandidatePersistence {
	Candidate save(Candidate candidate);
	Candidate update(Candidate candidate);
}

public interface CandidateNotification {
	void sendEmail(Candidate candidate);
}

public interface CandidateReport {
	byte[] generateReport(Long candidateId);
}
```

**Explanation**: Segregated interfaces reduce accidental coupling and simplify implementation and testing.

#### Dependency Inversion Principle (DIP)

High-level modules should not depend on low-level modules. Both should depend on abstractions.

**Before:**
```java
@ApplicationScoped
public class CandidateService {

	private final CandidateRepository repository = new CandidateRepository();

	public Candidate create(Candidate candidate) {
		repository.persist(candidate);
		return candidate;
	}
}
```

**After:**
```java
public interface CandidateGateway {
	Candidate save(Candidate candidate);
}

@ApplicationScoped
public class CandidateService {

	@Inject
	CandidateGateway candidateGateway;

	public Candidate create(Candidate candidate) {
		return candidateGateway.save(candidate);
	}
}
```

**Explanation**: Services depend on abstractions, making persistence technology replaceable and testing easier.

### DRY (Don't Repeat Yourself)

The DRY principle focuses on reducing duplication in code. Each piece of knowledge should have a single, unambiguous, and authoritative representation within a system.

**Before:**
```java
public void createCandidate(Candidate candidate) {
	if (candidate.getEmail() == null || !candidate.getEmail().contains("@")) {
		throw new IllegalArgumentException("Invalid email");
	}
	candidateRepository.persist(candidate);
}

public void updateCandidate(Candidate candidate) {
	if (candidate.getEmail() == null || !candidate.getEmail().contains("@")) {
		throw new IllegalArgumentException("Invalid email");
	}
	candidateRepository.persist(candidate);
}
```

**After:**
```java
public class CandidateRules {

	public static void validateEmail(String email) {
		if (email == null || !email.contains("@")) {
			throw new IllegalArgumentException("Invalid email");
		}
	}
}

@ApplicationScoped
public class CandidateService {

	@Inject
	CandidateRepository candidateRepository;

	public Candidate create(Candidate candidate) {
		CandidateRules.validateEmail(candidate.getEmail());
		candidateRepository.persist(candidate);
		return candidate;
	}

	public Candidate update(Candidate candidate) {
		CandidateRules.validateEmail(candidate.getEmail());
		candidateRepository.persist(candidate);
		return candidate;
	}
}
```

**Explanation**: Validation rules are centralized and reused across operations.

## Coding Standards

### Language and Naming Conventions

- **Variable Naming**: Use camelCase for variables and methods (for example, `candidateId`, `findCandidateById`)
- **Class Naming**: Use PascalCase for classes and interfaces (for example, `Candidate`, `CandidateRepository`)
- **Constants Naming**: Use UPPER_SNAKE_CASE for constants (for example, `MAX_CANDIDATES_PER_PAGE`)
- **Package Naming**: Use lowercase package names grouped by layer and bounded context
- **File Naming**: Java file names must match public class names

**Examples:**

```java
@ApplicationScoped
public class CandidateRepositoryAdapter {

	@Inject
	CandidateRepository candidateRepository;

	public Optional<Candidate> findById(Long candidateId) {
		return candidateRepository.findByIdOptional(candidateId);
	}
}
```

**Error Messages and Logs:**

```java
throw new ResourceNotFoundException("Candidate not found with the provided ID");
log.error("Failed to create candidate", ex);
```

### Java Usage

- **Java Usage**: Use modern Java language features compatible with the project baseline
- **Strong Typing**: Use explicit return types in public APIs and avoid raw types
- **DTO Contracts**: Define DTOs for API boundaries and avoid exposing JPA entities directly
- **Null Safety**: Use Bean Validation, `Optional`, and clear nullability rules

```java
public Optional<CandidateDto> findCandidateById(Long id) {
	return candidateRepository.findByIdOptional(id).map(candidateMapper::toDto);
}
```

### Error Handling

- **Custom Exception Classes**: Create domain-specific and application-specific exceptions
- **Global Exception Mapping**: Use `ExceptionMapper` for consistent error responses
- **Error Messages**: Provide descriptive messages and stable machine-readable codes

```java
@Provider
public class ResourceNotFoundExceptionMapper implements ExceptionMapper<ResourceNotFoundException> {

	@Override
	public Response toResponse(ResourceNotFoundException ex) {
		ErrorResponse body = new ErrorResponse(false, "NOT_FOUND", ex.getMessage());
		return Response.status(Response.Status.NOT_FOUND).entity(body).build();
	}
}
```

### Validation Patterns

- **Input Validation**: Validate all inputs at the API boundary
- **Use Bean Validation**: Use `jakarta.validation` annotations (`@NotNull`, `@Email`, `@Size`)
- **Validate Before Processing**: Always validate before executing business logic

```java
public record CreateCandidateRequest(
	@NotBlank String firstName,
	@NotBlank String lastName,
	@Email String email
) {}

@POST
public Response create(@Valid CreateCandidateRequest request) {
	CandidateResponse response = candidateService.create(request);
	return Response.status(Response.Status.CREATED).entity(response).build();
}
```

### Logging Standards

- **Use JBoss Logging API**: Use the logging facade integrated by Quarkus
- **Log Levels**: Use appropriate levels (`info`, `warn`, `error`, `debug`)
- **Structured Logging**: Include correlation IDs, request IDs, and business keys when possible

```java
private static final Logger log = Logger.getLogger(CandidateService.class);

log.infof("Candidate created id=%d email=%s", candidate.getId(), candidate.getEmail());
log.error("Failed to create candidate", ex);
```

## API Design Standards

### REST Endpoints

- **RESTful Naming**: Use RESTful conventions for endpoint naming
- **HTTP Methods**: Use appropriate HTTP methods (GET, POST, PUT, DELETE, PATCH)
- **Resource-Based URLs**: URLs should represent resources, not actions

```text
GET    /candidates          # List candidates
GET    /candidates/{id}     # Get candidate by ID
POST   /candidates          # Create new candidate
PUT    /candidates/{id}     # Update candidate
DELETE /candidates/{id}     # Delete candidate
```

### Request and Response Patterns

- **JSON Format**: Use JSON for request and response bodies
- **Consistent Structure**: Maintain consistent response structure across all endpoints
- **Status Codes**: Use appropriate HTTP status codes

```json
{
  "success": true,
  "data": {},
  "messageCode": "SUCCESS",
  "message": "Operation completed successfully"
}
```

### Error Response Format

- **Consistent Format**: All errors should follow the same response structure
- **Error Codes**: Use meaningful error codes for different error types
- **HTTP Status Codes**: Map errors to appropriate HTTP status codes

```json
{
  "success": false,
  "error": {
	"message": "Validation failed",
	"code": "VALIDATION_ERROR",
	"details": []
  }
}
```

### CORS Configuration

- **Enable CORS Explicitly**: Configure CORS only for allowed origins
- **Secure Configuration**: Use environment-specific origins
- **Credentials**: Enable credentials only when strictly needed

```properties
quarkus.http.cors=true
quarkus.http.cors.origins=http://localhost:3000
quarkus.http.cors.methods=GET,POST,PUT,DELETE,PATCH
quarkus.http.cors.access-control-allow-credentials=true
```

## Database Patterns

### JPA Entity Model

- **Single Source of Truth**: JPA entities and migration scripts are the source of truth for database structure
- **Relationships**: Define relationships with explicit JPA annotations
- **Naming Conventions**: Use consistent conventions for tables, columns, indexes, and constraints

### Migrations

- **Version Control**: All schema changes must be version-controlled through migrations
- **Migration Naming**: Use descriptive migration names and version prefixes
- **Review Migrations**: Review migration files before applying

```bash
# Flyway
./mvnw flyway:migrate

# Liquibase
./mvnw liquibase:update
```

### Repository Pattern

- **Repository Interfaces**: Define repository interfaces in the persistence boundary
- **Hibernate and Panache**: Use Hibernate ORM and Panache repositories when they reduce boilerplate
- **Entity Management Alignment**: Keep entity scanning and persistence units aligned in multi-module projects

```java
@ApplicationScoped
public class CandidateRepository implements PanacheRepository<Candidate> {
}
```

## Testing Standards

The project has strict requirements for code quality and maintainability. These are the unit testing standards and best practices that must be applied.

### Unit Testing

- Use descriptive test file names: `[ComponentName]Test.java`
- Place unit tests under `src/test/java` with mirrored package structure
- Use JUnit 5 with Mockito for unit tests
- Maintain 90% coverage threshold for branches, functions, lines, and statements

### Integration Testing

- Use `@QuarkusTest` for container-managed integration tests
- Use test profiles (`QuarkusTestProfile`) for environment-specific configurations
- Use Dev Services or Testcontainers for database-backed integration tests

Template:
```java
@QuarkusTest
class CandidateResourceTest {

	@Test
	void shouldReturnCreatedWhenRequestIsValid() {
		// Arrange

		// Act

		// Assert
	}
}
```

### Native Testing

- Use native tests for critical paths when native packaging is part of deployment
- Validate startup behavior, serialization, reflection-sensitive code, and persistence mappings
- Keep native test suites focused on representative scenarios to balance feedback speed and confidence

### Mocking Standards

- Mock all external dependencies (repositories, clients, gateways)
- In `@QuarkusTest`, use `@InjectMock` for CDI-managed beans that must be replaced
- Reset mocks in setup methods to ensure test isolation

### Test Coverage Requirements

- **Comprehensive test coverage**: Include these test categories for each function:
1. **Happy Path Tests**: Valid inputs producing expected outputs
2. **Error Handling Tests**: Invalid inputs, missing data, persistence errors
3. **Edge Cases**: Boundary values, null inputs, empty data
4. **Validation Tests**: Input validation and business rule enforcement
5. **Integration Points**: External service calls and database operations

- **Threshold**: 90% for branches, functions, lines, and statements
- **Coverage Reports**: Generate coverage reports with Maven JaCoCo plugin
- **Coverage Files**: Coverage reports in `target/site/jacoco/` adding dated summaries like `YYYYMMDD-backend-coverage.md`

### Error Testing

- Test both expected and unexpected errors
- Verify error messages are descriptive and useful
- Test error propagation through service layers
- Ensure proper HTTP status codes in resource tests

### Resource Testing Specifics

- Mock the service layer where required
- Test HTTP request and response handling with RestAssured
- Verify parameter parsing and validation
- Test error response formatting

### Service Testing Specifics

- Mock repositories and gateways
- Test business logic in isolation
- Verify data transformation and validation
- Test error handling and edge cases

### Database Testing

- Use transactional integration tests or Testcontainers-based integration tests
- Test both successful and failed database operations
- Verify query behavior and constraints
- Test transaction behavior and rollback scenarios

### Async Testing

- Use `UniAssertSubscriber` or equivalent utilities for asynchronous and reactive tests when needed
- Use deterministic async tests and explicit timeouts
- Test timeout and failure scenarios where applicable

### Test Data Management

- Use factory methods or builders for creating test data
- Keep test data consistent and realistic
- Avoid hardcoded duplicated values
- Use meaningful scenarios aligned with domain behavior

### Common Anti-Patterns to Avoid

- Do not test implementation details, test behavior
- Do not create overly complex test setups
- Do not ignore failing tests or skip error scenarios
- Do not use real external services in unit tests
- Do not write tests tightly coupled to implementation details

## Performance Best Practices

### Database Query Optimization

- **Select Specific Fields**: Fetch only required columns
- **Use Indexes**: Ensure proper indexes for frequently queried fields
- **Avoid N+1 Queries**: Use fetch joins, batch strategies, or explicit query shaping

```java
public Optional<Candidate> findByIdWithEducations(Long id) {
	return find("select c from Candidate c left join fetch c.educations where c.id = ?1", id)
		.firstResultOptional();
}
```

### Asynchronous and Reactive Patterns

- Use blocking style by default for simple CRUD services
- Use reactive style (`Uni`, `Multi`) for I/O-bound concurrency and streaming use cases
- Do not mix reactive and blocking persistence in the same call path without explicit thread model control

```java
public Uni<CandidateResponse> findByIdAsync(Long id) {
	return candidateReactiveRepository.findById(id)
		.onItem().ifNull().failWith(() -> new ResourceNotFoundException("Candidate not found"))
		.onItem().transform(candidateMapper::toResponse);
}
```

### Build-Time Optimization and Native Readiness

- Prefer build-time configuration and avoid runtime reflection when possible
- Keep libraries compatible with native image constraints if native packaging is planned
- Avoid dynamic classloading patterns that are difficult to optimize for native execution
- Validate critical services with regular native builds in CI when native image is a deployment target

## Security Best Practices

### Input Validation

- **Validate All Inputs**: Validate all user inputs before processing
- **Sanitize Data**: Protect against injection attacks and unsafe deserialization
- **Type Checking**: Use DTO validation and strong typing

### Environment Variables and Configuration

- **Never Commit Secrets**: Never commit credentials or secrets to version control
- **Use Environment Variables**: Externalize configuration using Quarkus config and env vars
- **Validate Environment**: Validate required properties at startup

```properties
%dev.app.security.jwt-secret=${JWT_SECRET:dev-secret}
%prod.app.security.jwt-secret=${JWT_SECRET}
```

### Dependency Injection and Contexts

- Use CDI injection for services, repositories, and infrastructure adapters
- Avoid manual wiring with `new` in business classes
- Choose proper bean scope (`@ApplicationScoped`, `@RequestScoped`, etc.) based on lifecycle requirements

```java
@ApplicationScoped
public class CandidateService {

	@Inject
	CandidateRepository candidateRepository;
}
```

## Observability Standards

### Health Checks

- Expose readiness and liveness checks through SmallRye Health
- Ensure checks represent real dependencies (database, messaging, required external APIs)
- Keep health endpoints lightweight and deterministic

### Metrics and Tracing

- Publish standard metrics and business-level metrics where useful
- Use OpenTelemetry for distributed tracing
- Propagate correlation identifiers across service boundaries

### OpenAPI and API Documentation

- Generate OpenAPI documentation using SmallRye OpenAPI annotations where needed
- Keep endpoint descriptions, parameters, and response schemas consistent with implementation
- Treat API documentation as part of the contract and validate it in CI

## Development Workflow

### Git Workflow

- **Feature Branches**: Develop features in separate branches using clear descriptive names
- **Descriptive Commits**: Write descriptive commit messages in English
- **Code Review**: Perform code review before merging
- **Small Branches**: Keep branches small and focused

### Development Scripts

```bash
./mvnw quarkus:dev            # Development server with live reload
./mvnw clean package          # Build JVM artifact
./mvnw test                   # Run tests
./mvnw verify                 # Run full verification
./mvnw jacoco:report          # Generate coverage report
./mvnw flyway:migrate         # Apply Flyway migrations
./mvnw spotless:apply         # Apply formatting rules
./mvnw package -Dnative       # Build native executable
```

### Code Quality

- **Static Analysis Validation**: Run Checkstyle, PMD, and SpotBugs before commits
- **Compilation Check**: Ensure compilation without warnings that indicate defects
- **All Tests Passing**: Ensure all tests pass before deployment
- **Code Review**: Review code for adherence to standards and architecture rules

This document serves as the foundation for maintaining code quality and consistency across Java/Quarkus backend applications. All team members should follow these practices to ensure a maintainable, scalable, and testable codebase.
