# Contract Validator

## Description
Validates API implementation against OpenAPI contracts to ensure spec compliance.

## Trigger
- Contract validation needed
- `/test contract` command
- API verification

## Instructions

### Validation Approach

1. **Parse OpenAPI spec**
2. **Make requests to endpoints**
3. **Validate responses against schema**
4. **Report violations**

### Using OpenAPI Validator

```typescript
// tests/contract/validator.ts
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

export class ContractValidator {
  private spec: any;
  private ajv: Ajv;

  constructor(specPath: string) {
    this.spec = yaml.load(fs.readFileSync(specPath, 'utf8'));
    this.ajv = new Ajv({ allErrors: true });
    addFormats(this.ajv);
  }

  validateResponse(path: string, method: string, statusCode: number, body: any) {
    const schema = this.getResponseSchema(path, method, statusCode);
    if (!schema) {
      throw new Error(`No schema found for ${method} ${path} ${statusCode}`);
    }

    const validate = this.ajv.compile(schema);
    const valid = validate(body);

    if (!valid) {
      return {
        valid: false,
        errors: validate.errors,
      };
    }

    return { valid: true, errors: [] };
  }

  private getResponseSchema(path: string, method: string, statusCode: number) {
    const pathSpec = this.spec.paths[path];
    if (!pathSpec) return null;

    const methodSpec = pathSpec[method.toLowerCase()];
    if (!methodSpec) return null;

    const responseSpec = methodSpec.responses[statusCode.toString()];
    if (!responseSpec) return null;

    return responseSpec.content?.['application/json']?.schema;
  }
}
```

### Contract Test Suite

```typescript
// tests/contract/auth.contract.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ContractValidator } from './validator';
import { AppModule } from '../../src/app.module';

describe('Auth API Contract', () => {
  let app: INestApplication;
  let validator: ContractValidator;

  beforeAll(async () => {
    validator = new ContractValidator('specs/001-auth-user-access/contracts/auth.yaml');

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('POST /auth/register', () => {
    it('should match contract for 201 response', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'contract@test.com',
          password: 'Password123!',
        })
        .expect(201);

      const validation = validator.validateResponse(
        '/auth/register',
        'POST',
        201,
        response.body
      );

      expect(validation.valid).toBe(true);
      if (!validation.valid) {
        console.log('Contract violations:', validation.errors);
      }
    });

    it('should match contract for 400 response', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'invalid',
        })
        .expect(400);

      const validation = validator.validateResponse(
        '/auth/register',
        'POST',
        400,
        response.body
      );

      expect(validation.valid).toBe(true);
    });
  });

  describe('POST /auth/login', () => {
    it('should match contract for 200 response', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'contract@test.com',
          password: 'Password123!',
        })
        .expect(200);

      const validation = validator.validateResponse(
        '/auth/login',
        'POST',
        200,
        response.body
      );

      expect(validation.valid).toBe(true);
    });
  });
});
```

### Validation Report

```typescript
// tests/contract/report.ts
interface ValidationReport {
  endpoint: string;
  method: string;
  statusCode: number;
  valid: boolean;
  errors: any[];
}

export function generateReport(results: ValidationReport[]) {
  console.log('\n=== Contract Validation Report ===\n');

  const passed = results.filter(r => r.valid);
  const failed = results.filter(r => !r.valid);

  console.log(`Total: ${results.length}`);
  console.log(`Passed: ${passed.length}`);
  console.log(`Failed: ${failed.length}`);

  if (failed.length > 0) {
    console.log('\n--- Failures ---\n');
    failed.forEach(f => {
      console.log(`${f.method} ${f.endpoint} (${f.statusCode})`);
      console.log('Errors:', JSON.stringify(f.errors, null, 2));
      console.log('---');
    });
  }
}
```

### Common Validations

```markdown
## Contract Checklist

### Response Structure
- [ ] All required fields present
- [ ] Field types match schema
- [ ] Nullable fields handled
- [ ] Array items match schema

### Status Codes
- [ ] 200 for successful GET/PUT
- [ ] 201 for successful POST
- [ ] 204 for successful DELETE
- [ ] 400 for validation errors
- [ ] 401 for unauthorized
- [ ] 404 for not found

### Headers
- [ ] Content-Type correct
- [ ] Authentication header accepted

### Error Format
- [ ] Consistent error structure
- [ ] Error messages present
- [ ] Status code in response
```

### Automated Contract Testing

```typescript
// tests/contract/all-endpoints.spec.ts
import { ContractValidator } from './validator';
import * as yaml from 'js-yaml';
import * as fs from 'fs';

describe('All Endpoints Contract', () => {
  const spec = yaml.load(
    fs.readFileSync('specs/001-auth-user-access/contracts/auth.yaml', 'utf8')
  ) as any;

  Object.entries(spec.paths).forEach(([path, methods]: [string, any]) => {
    Object.entries(methods).forEach(([method, details]: [string, any]) => {
      if (['get', 'post', 'put', 'delete', 'patch'].includes(method)) {
        describe(`${method.toUpperCase()} ${path}`, () => {
          Object.keys(details.responses).forEach((statusCode) => {
            it(`should validate ${statusCode} response`, async () => {
              // Test implementation
            });
          });
        });
      }
    });
  });
});
```

## Tools Used
- `Read`: Read OpenAPI specs
- `Write`: Create validation tests
- `Bash`: Run validation

## Best Practices
- Validate all response codes
- Check required fields
- Verify data types
- Test error responses
- Generate reports
