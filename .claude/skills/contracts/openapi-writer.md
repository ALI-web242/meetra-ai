# OpenAPI Writer

## Description
Creates OpenAPI 3.0 specifications for REST APIs, defining endpoints, request/response schemas, and authentication requirements.

## Trigger
- Planning phase complete
- `/contracts api` command
- API design needed

## Instructions

### OpenAPI File Location
```
specs/{spec-id}/contracts/{name}.yaml
```

### Standard Template

```yaml
openapi: 3.0.3
info:
  title: {API Title}
  description: {API Description}
  version: 1.0.0

servers:
  - url: http://localhost:3001/api
    description: Development
  - url: https://api.example.com
    description: Production

tags:
  - name: {tag}
    description: {description}

paths:
  /endpoint:
    get:
      tags:
        - {tag}
      summary: {summary}
      description: {description}
      operationId: {operationId}
      parameters:
        - name: {param}
          in: query|path|header
          required: true|false
          schema:
            type: string
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Response'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'

components:
  schemas:
    {SchemaName}:
      type: object
      required:
        - field1
      properties:
        field1:
          type: string
          description: {description}

  responses:
    BadRequest:
      description: Bad Request
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
    Unauthorized:
      description: Unauthorized
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

security:
  - bearerAuth: []
```

### Common Patterns

#### CRUD Endpoints
```yaml
paths:
  /resources:
    get:
      summary: List resources
      responses:
        '200':
          description: List of resources
    post:
      summary: Create resource
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateResource'
      responses:
        '201':
          description: Created

  /resources/{id}:
    get:
      summary: Get resource
    put:
      summary: Update resource
    delete:
      summary: Delete resource
```

#### Authentication Endpoints
```yaml
paths:
  /auth/register:
    post:
      security: []
      summary: Register user
  /auth/login:
    post:
      security: []
      summary: Login user
  /auth/logout:
    post:
      summary: Logout user
  /auth/refresh:
    post:
      summary: Refresh token
```

## Tools Used
- `Read`: Read spec and plan
- `Write`: Create YAML files

## Best Practices
- Use $ref for reusable schemas
- Include error responses
- Document all parameters
- Add examples where helpful
