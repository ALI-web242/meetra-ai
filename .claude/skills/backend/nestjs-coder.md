# NestJS Coder

## Description
Implements NestJS modules, controllers, services, and related components following NestJS best practices.

## Trigger
- Backend implementation tasks
- `/code backend` command
- API endpoint creation

## Instructions

### Project Structure

```
backend/src/
├── app.module.ts
├── main.ts
├── {module}/
│   ├── {module}.module.ts
│   ├── {module}.controller.ts
│   ├── {module}.service.ts
│   ├── dto/
│   │   ├── create-{entity}.dto.ts
│   │   └── update-{entity}.dto.ts
│   └── entities/
│       └── {entity}.entity.ts
├── common/
│   ├── decorators/
│   ├── guards/
│   ├── interceptors/
│   └── filters/
└── database/
    └── migrations/
```

### Module Template

```typescript
// {module}/{module}.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { {Entity} } from './entities/{entity}.entity';
import { {Module}Controller } from './{module}.controller';
import { {Module}Service } from './{module}.service';

@Module({
  imports: [TypeOrmModule.forFeature([{Entity}])],
  controllers: [{Module}Controller],
  providers: [{Module}Service],
  exports: [{Module}Service],
})
export class {Module}Module {}
```

### Controller Template

```typescript
// {module}/{module}.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { {Module}Service } from './{module}.service';
import { Create{Entity}Dto } from './dto/create-{entity}.dto';
import { Update{Entity}Dto } from './dto/update-{entity}.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('{route}')
@UseGuards(JwtAuthGuard)
export class {Module}Controller {
  constructor(private readonly {module}Service: {Module}Service) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: Create{Entity}Dto) {
    return this.{module}Service.create(dto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.{module}Service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.{module}Service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: Update{Entity}Dto) {
    return this.{module}Service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.{module}Service.remove(id);
  }
}
```

### Service Template

```typescript
// {module}/{module}.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { {Entity} } from './entities/{entity}.entity';
import { Create{Entity}Dto } from './dto/create-{entity}.dto';
import { Update{Entity}Dto } from './dto/update-{entity}.dto';

@Injectable()
export class {Module}Service {
  constructor(
    @InjectRepository({Entity})
    private readonly repository: Repository<{Entity}>,
  ) {}

  async create(dto: Create{Entity}Dto): Promise<{Entity}> {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  async findAll(query?: any): Promise<{Entity}[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<{Entity}> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`{Entity} with ID ${id} not found`);
    }
    return entity;
  }

  async update(id: string, dto: Update{Entity}Dto): Promise<{Entity}> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repository.remove(entity);
  }
}
```

### DTO Templates

```typescript
// dto/create-{entity}.dto.ts
import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

export class Create{Entity}Dto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  description?: string;
}

// dto/update-{entity}.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { Create{Entity}Dto } from './create-{entity}.dto';

export class Update{Entity}Dto extends PartialType(Create{Entity}Dto) {}
```

### Common Patterns

#### Auth Module Structure
```typescript
// auth/auth.module.ts
@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

## Tools Used
- `Read`: Read existing modules
- `Write`: Create new files
- `Edit`: Modify existing files
- `Bash`: Run nest CLI commands

## Best Practices
- Use dependency injection
- Validate all inputs with DTOs
- Handle errors properly
- Use guards for authentication
- Export services for reuse
