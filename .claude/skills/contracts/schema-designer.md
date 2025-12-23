# Schema Designer

## Description
Designs database schemas and entity relationships for TypeORM, ensuring proper normalization and data integrity.

## Trigger
- Contracts phase
- `/contracts schema` command
- Database design needed

## Instructions

### Schema File Location
```
specs/{spec-id}/contracts/schemas/
backend/src/{module}/entities/
```

### Entity Template

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('table_name')
export class EntityName {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  field: string;

  @Column({ type: 'varchar', unique: true })
  uniqueField: string;

  @Column({ type: 'text', nullable: true })
  optionalField: string | null;

  @Column({ type: 'boolean', default: false })
  boolField: boolean;

  @Column({ type: 'jsonb', nullable: true })
  jsonField: Record<string, any> | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => OtherEntity, (other) => other.items)
  @JoinColumn({ name: 'other_id' })
  other: OtherEntity;

  @Column({ type: 'uuid' })
  otherId: string;

  @OneToMany(() => ChildEntity, (child) => child.parent)
  children: ChildEntity[];
}
```

### Common Patterns

#### User Entity
```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ nullable: true })
  name: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

#### Soft Delete Pattern
```typescript
@Column({ type: 'timestamp', nullable: true })
deletedAt: Date | null;
```

### Relationship Types

| Type | Use Case |
|------|----------|
| OneToOne | User-Profile |
| OneToMany | User-Posts |
| ManyToOne | Post-User |
| ManyToMany | Post-Tags |

### Naming Conventions
- Table: snake_case plural (users, blog_posts)
- Column: snake_case (created_at)
- Entity: PascalCase singular (User, BlogPost)
- Foreign Key: {relation}_id

## Tools Used
- `Read`: Read spec requirements
- `Write`: Create entity files

## Best Practices
- Always use UUIDs for IDs
- Add timestamps (created, updated)
- Use proper column types
- Index frequently queried columns
- Define cascade rules
