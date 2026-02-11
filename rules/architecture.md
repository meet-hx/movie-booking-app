# Movie Booking Application - Architecture Rules

## Project Structure

This is a NestJS application following **Clean Architecture** principles with the following layers:

```
src/
├── application/       # Application Layer (Controllers, DTOs, Services)
├── domain/           # Domain Layer (Repositories, Entities)
├── infrastructure/   # Infrastructure Layer (Prisma, Persistence)
├── utils/           # Shared utilities
└── main.ts          # Application entry point
```

## Layer Responsibilities

### 1. Application Layer (`src/application/`)

- **Controllers**: Handle HTTP requests/responses, route definitions
- **Services**: Business logic implementation
- **DTOs**: Data Transfer Objects for request/response validation
- **Modules**: Feature modules grouping related functionality

**Rules:**

- Controllers should ONLY handle HTTP concerns (request/response)
- Business logic belongs in Services, NOT Controllers
- Each feature should have its own module (e.g., `auth.module.ts`, `user.module.ts`)
- Services should depend on repository interfaces, not concrete implementations

### 2. Domain Layer (`src/domain/`)

- **Repositories**: Interface definitions for data access
- **Entities**: Domain models (if needed beyond Prisma models)

**Rules:**

- Repository interfaces define contracts for data operations
- Domain layer should NOT depend on infrastructure or application layers
- Keep domain logic pure and framework-agnostic

### 3. Infrastructure Layer (`src/infrastructure/`)

- **Prisma**: Database client and service
- **Persistence**: Repository implementations using Prisma

**Rules:**

- Repository implementations go in `infrastructure/persistence/`
- Prisma service handles database connection lifecycle
- All database queries should go through repositories

## Module Architecture

### Feature Module Structure

Each feature should follow this pattern:

```
application/
└── feature-name/
    ├── feature-name.module.ts      # Module definition
    ├── feature-name.controller.ts  # HTTP endpoints
    ├── feature-name.service.ts     # Business logic
    └── dto/                        # Request/Response DTOs
        ├── create-feature.dto.ts
        ├── update-feature.dto.ts
        └── feature-response.dto.ts
```

### Module Rules

1. Each module should be self-contained
2. Import `PersistenceModule` for repository access
3. Export services if they need to be used by other modules
4. Use dependency injection for all dependencies

## Controller Guidelines

### Structure

```typescript
@ApiTags('Feature Name')
@Controller('feature-name')
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  @Post()
  @ApiOperation({ summary: 'Create feature' })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  async create(@Body() dto: CreateFeatureDto) {
    return this.featureService.create(dto);
  }
}
```

### Rules

1. **Always use Swagger decorators** on every endpoint:
   - `@ApiTags()` on the controller class
   - `@ApiOperation()` on each method
   - `@ApiResponse()` for success and error responses
   - `@ApiBody()` when needed for complex request bodies

2. **HTTP Methods**:
   - `@Get()` - Retrieve resources
   - `@Post()` - Create resources
   - `@Put()` / `@Patch()` - Update resources
   - `@Delete()` - Delete resources

3. **Route Naming**:
   - Use kebab-case for routes
   - Use RESTful conventions
   - Avoid verbs in route names (use HTTP methods instead)

4. **Validation**:
   - Use DTOs with class-validator decorators
   - Let NestJS ValidationPipe handle validation

5. **Error Handling**:
   - Let services throw exceptions
   - Use NestJS built-in exceptions (BadRequestException, NotFoundException, etc.)

## Service Guidelines

### Structure

```typescript
@Injectable()
export class FeatureService {
  constructor(
    @Inject(FEATURE_REPOSITORY_TOKEN)
    private readonly featureRepository: FeatureRepository,
  ) {}

  async create(dto: CreateFeatureDto): Promise<Feature> {
    // Business logic here
    return this.featureRepository.create(dto);
  }
}
```

### Rules

1. **Single Responsibility**: Each service should handle one feature area
2. **Dependency Injection**: Inject repositories using tokens from `domain/repositories/tokens.ts`
3. **Business Logic**: All business rules and validation go here
4. **Error Handling**: Throw descriptive exceptions
5. **Transactions**: Use Prisma transactions for multi-step operations
6. **Service Composition**: Prefer calling other services over directly injecting their repositories to avoid duplicating business logic.

## Swagger Documentation

### Configuration

Swagger is configured in `src/main.ts`:

```typescript
const config = new DocumentBuilder()
  .setTitle('Book your show')
  .setDescription('The movie booking API description')
  .setVersion('0.1')
  .addTag('movies')
  .build();

SwaggerModule.setup('info', app, documentFactory);
```

### DTO Documentation

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;
}
```

### Rules

1. **Every DTO property** must have `@ApiProperty()` decorator
2. Include `description` and `example` in ApiProperty
3. Response DTOs should use `@ApiProperty()` to document return types
4. Use `@ApiTags()` to group related endpoints
5. Document all possible response codes with `@ApiResponse()`

## Data Transfer Objects (DTOs)

### DTO File Structure

Each operation should have its own DTO file with Request and Response classes:

```
dto/
├── create-movie.dto.ts       # CreateMovieRequest, CreateMovieResponse
├── update-movie.dto.ts       # UpdateMovieRequest, UpdateMovieResponse
├── get-movie.dto.ts          # GetMovieResponse
├── list-movies.dto.ts        # ListMoviesQuery, ListMoviesResponse
└── delete-movie.dto.ts       # DeleteMovieResponse
```

### DTO Naming Conventions

1. **Request DTOs**: `{Action}{Entity}Request`
   - `CreateMovieRequest`
   - `UpdateMovieRequest`
   - `ListMoviesQuery`

2. **Response DTOs**: `{Action}{Entity}Response`
   - `CreateMovieResponse`
   - `UpdateMovieResponse`
   - `GetMovieResponse`
   - `ListMoviesResponse`

3. **File Names**: `{action}-{entity}.dto.ts`
   - `create-movie.dto.ts`
   - `update-movie.dto.ts`
   - `list-movies.dto.ts`

### Complete DTO Example: Create Movie

```typescript
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  IsEnum,
  IsUUID,
  IsOptional,
  MaxLength,
  MinLength,
  IsArray,
} from 'class-validator';
import { MovieType } from '@prisma/client';

// Request DTO
export class CreateMovieRequest {
  @ApiProperty({
    description: 'Movie title',
    example: 'Inception',
    minLength: 1,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @ApiProperty({
    description: 'Movie description',
    example: 'A mind-bending thriller about dreams within dreams',
    required: false,
    maxLength: 1000,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    description: 'Movie duration in minutes',
    example: 148,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  duration: number;

  @ApiProperty({
    description: 'Movie type',
    enum: MovieType,
    example: MovieType.IMAX,
  })
  @IsEnum(MovieType)
  type: MovieType;

  @ApiProperty({
    description: 'Genre ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  genreId: string;

  @ApiProperty({
    description: 'Array of language IDs',
    example: [
      '123e4567-e89b-12d3-a456-426614174001',
      '123e4567-e89b-12d3-a456-426614174002',
    ],
    type: [String],
    isArray: true,
  })
  @IsUUID('4', { each: true })
  @IsArray()
  @IsNotEmpty()
  languageIds: string[];
}

// Nested Response DTOs
class GenreResponse {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Action' })
  name: string;
}

class LanguageResponse {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
  id: string;

  @ApiProperty({ example: 'English' })
  name: string;
}

// Response DTO
export class CreateMovieResponse {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174003',
    description: 'Movie unique identifier',
  })
  id: string;

  @ApiProperty({ example: 'Inception' })
  title: string;

  @ApiProperty({
    example: 'A mind-bending thriller about dreams within dreams',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({ example: 148 })
  duration: number;

  @ApiProperty({ enum: MovieType, example: MovieType.IMAX })
  type: MovieType;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  genreId: string;

  @ApiProperty({ type: GenreResponse })
  genre: GenreResponse;

  @ApiProperty({ type: [LanguageResponse], isArray: true })
  languages: LanguageResponse[];

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ example: null, nullable: true })
  deletedAt: Date | null;
}
```

### Update DTO Pattern

For updates, use `@IsOptional()` on all fields:

```typescript
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { MovieType } from '@prisma/client';

export class UpdateMovieRequest {
  @ApiProperty({
    description: 'Movie title',
    example: 'Inception',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  title?: string;

  @ApiProperty({
    description: 'Movie description',
    example: 'Updated description',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    description: 'Movie duration in minutes',
    example: 150,
    required: false,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  duration?: number;

  @ApiProperty({
    description: 'Movie type',
    enum: MovieType,
    example: MovieType.THREE_D,
    required: false,
  })
  @IsEnum(MovieType)
  @IsOptional()
  type?: MovieType;
}

export class UpdateMovieResponse extends CreateMovieResponse {}
```

### List/Query DTO Pattern

For pagination and filtering:

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, Max, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { MovieType } from '@prisma/client';

export class ListMoviesQuery {
  @ApiProperty({
    description: 'Page number',
    example: 1,
    minimum: 1,
    required: false,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    required: false,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 10;

  @ApiProperty({
    description: 'Search by title',
    example: 'Inception',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: 'Filter by movie type',
    enum: MovieType,
    required: false,
  })
  @IsEnum(MovieType)
  @IsOptional()
  type?: MovieType;
}

export class ListMoviesResponse {
  @ApiProperty({ type: [CreateMovieResponse], isArray: true })
  data: CreateMovieResponse[];

  @ApiProperty({ example: 100, description: 'Total number of items' })
  total: number;

  @ApiProperty({ example: 1, description: 'Current page' })
  page: number;

  @ApiProperty({ example: 10, description: 'Items per page' })
  limit: number;

  @ApiProperty({ example: 10, description: 'Total pages' })
  totalPages: number;
}
```

### Common Validation Decorators

#### String Validation

```typescript
@IsString()              // Must be a string
@IsNotEmpty()            // Cannot be empty
@MinLength(5)            // Minimum length
@MaxLength(100)          // Maximum length
@IsEmail()               // Valid email format
@IsUrl()                 // Valid URL format
@Matches(/regex/)        // Custom regex pattern
@IsOptional()            // Field is optional
```

#### Number Validation

```typescript
@IsInt()                 // Must be integer
@IsNumber()              // Must be number (float/int)
@Min(0)                  // Minimum value
@Max(100)                // Maximum value
@IsPositive()            // Must be positive
```

#### Date Validation

```typescript
@IsDate()                // Must be Date object
@Type(() => Date)        // Transform to Date
@IsISO8601()             // ISO date string
```

#### Array Validation

```typescript
@IsArray()                        // Must be array
@ArrayMinSize(1)                  // Minimum array length
@ArrayMaxSize(10)                 // Maximum array length
@IsUUID('4', { each: true })      // Validate each element
```

#### Enum Validation

```typescript
@IsEnum(MovieType)       // Must be enum value
```

#### UUID Validation

```typescript
@IsUUID()                // Valid UUID v4
@IsUUID('4')             // Explicit v4
```

#### Boolean Validation

```typescript
@IsBoolean()             // Must be boolean
@Type(() => Boolean)     // Transform to boolean
```

### Advanced DTO Patterns

#### Using PartialType for Updates

```typescript
import { PartialType } from '@nestjs/swagger';

export class UpdateMovieRequest extends PartialType(CreateMovieRequest) {}
```

#### Using OmitType to Exclude Fields

```typescript
import { OmitType } from '@nestjs/swagger';

export class CreateMovieRequest extends OmitType(MovieEntity, [
  'id',
  'createdAt',
  'updatedAt',
] as const) {}
```

#### Nested Object Validation

```typescript
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SeatDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  seatId: string;

  @ApiProperty({ example: 15.99 })
  @IsNumber()
  amount: number;
}

export class CreateBookingRequest {
  @ApiProperty({ type: [SeatDto], isArray: true })
  @ValidateNested({ each: true })
  @Type(() => SeatDto)
  @IsArray()
  seats: SeatDto[];
}
```

### DTO Scalability Rules

To maintain a scalable project, follow these mandatory DTO maintenance rules:

1.  **Minimum 2 DTOs Per Operation**: Every endpoint operation (Create, Update, Get, etc.) MUST have at least two DTOs defined in its corresponding `.dto.ts` file:
    - A **Request DTO** (e.g., `CreateSeatRequest`)
    - A **Response DTO** (e.g., `CreateSeatResponse`)
2.  **Single File Per Operation**: Keep the Request and Response DTOs for a single operation in the same file named `{action}-{entity}.dto.ts`.
3.  **No Direct Entity Exposure**: Never return database entities directly. Always map them to a Response DTO to control what data is exposed.

### DTO Best Practices

1. **Always validate input**: Use class-validator decorators on all Request DTOs
2. **Document everything**: Every property needs `@ApiProperty()`
3. **Provide examples**: Include realistic example values
4. **Use TypeScript types**: Leverage enums, unions, and interfaces
5. **Separate concerns**: One file per operation (create, update, list, etc.)
6. **Reuse when appropriate**: Extend base DTOs or use `PartialType`, `PickType`, `OmitType`
7. **Transform data**: Use `@Type()` from class-transformer for proper type conversion
8. **Handle optionals**: Use `@IsOptional()` for optional fields
9. **Nested validation**: Use `@ValidateNested()` and `@Type()` for nested objects
10. **Array handling**: Use `{ each: true }` for array element validation

## Repository Pattern

### Interface Definition (`domain/repositories/`)

```typescript
export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
  update(id: string, data: UpdateUserData): Promise<User>;
  delete(id: string): Promise<void>;
}
```

### Implementation (`infrastructure/persistence/`)

```typescript
@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
  // ... other methods
}
```

### Rules

1. Define repository interfaces in `domain/repositories/`
2. Implement repositories in `infrastructure/persistence/`
3. Register repositories in `PersistenceModule`
4. Use injection tokens from `domain/repositories/tokens.ts`
5. Keep repository methods focused on data access only

## Database & Prisma

### Schema Rules

1. Every model must have:
   - `id String @id @default(uuid())`
   - `createdAt DateTime @default(now())`
   - `updatedAt DateTime @updatedAt @default(now())`
   - `deletedAt DateTime?` (for soft deletes)

2. Use appropriate indexes for:
   - Foreign keys
   - Frequently queried fields
   - Unique constraints

3. Use enums for fixed value sets

### Migration Rules

1. Always review generated migrations before applying
2. Add `DEFAULT CURRENT_TIMESTAMP` to `updatedAt` in migrations for existing data
3. Test migrations on development database first
4. Use descriptive migration names

## Authentication & Authorization

### Current Implementation

- JWT-based authentication
- Passport strategies (Local, JWT)
- Guards: `LocalAuthGuard`, `JwtAuthGuard`
- Tokens stored in HTTP-only cookies

### Rules

1. Use `@UseGuards(JwtAuthGuard)` for protected routes
2. Store sensitive tokens in HTTP-only cookies
3. Extract user from request object: `@Request() req` → `req.user`
4. Hash passwords using bcrypt (via `src/utils/bcrypt`)

## Naming Conventions

### Files

- Controllers: `feature-name.controller.ts`
- Services: `feature-name.service.ts`
- Modules: `feature-name.module.ts`
- DTOs: `action-feature.dto.ts` (e.g., `create-user.dto.ts`)
- Repositories: `feature-name.repository.ts`

### Classes

- Controllers: `FeatureNameController`
- Services: `FeatureNameService`
- Modules: `FeatureNameModule`
- DTOs: `ActionFeatureDto` (e.g., `CreateUserDto`)
- Repositories: `FeatureNameRepository`

### Routes

- Use kebab-case: `/feature-name/sub-resource`
- RESTful conventions
- Version prefix if needed: `/v1/feature-name`

## Testing

### Structure

- Unit tests: `*.spec.ts` next to source files
- E2E tests: `test/` directory

### Rules

1. Test business logic in services
2. Mock repositories in service tests
3. Use E2E tests for integration testing
4. Maintain test coverage for critical paths

## Environment & Configuration

### Environment Variables

- Database URL: `DATABASE_URL`
- JWT Secret: `JWT_SECRET`
- Port: `PORT`

### Rules

1. Never commit `.env` files
2. Use `.env.example` for documentation
3. Validate environment variables at startup
4. Use ConfigModule for configuration management

## Best Practices

1. **Dependency Injection**: Use constructor injection for all dependencies
2. **Error Handling**: Use NestJS exception filters and built-in exceptions
3. **Validation**: Use class-validator decorators on DTOs
4. **Logging**: Use NestJS Logger service
5. **Type Safety**: Leverage TypeScript strictly, avoid `any`
6. **Async/Await**: Use async/await for all asynchronous operations
7. **Transactions**: Wrap multi-step database operations in Prisma transactions
8. **Soft Deletes**: Use `deletedAt` field instead of hard deletes
9. **API Versioning**: Plan for versioning from the start
10. **Documentation**: Keep Swagger docs up-to-date with every change
