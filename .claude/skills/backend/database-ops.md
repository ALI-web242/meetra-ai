# Database Operations

## Description
Implements database queries and operations using TypeORM with PostgreSQL.

## Trigger
- Database operations needed
- `/code database` command
- Entity/repository creation

## Instructions

### Entity File Location
```
backend/src/{module}/entities/{entity}.entity.ts
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
  Index,
} from 'typeorm';

@Entity('table_name')
export class EntityName {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', unique: true })
  @Index()
  email: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  // Relations
  @ManyToOne(() => Parent, (parent) => parent.children)
  @JoinColumn({ name: 'parent_id' })
  parent: Parent;

  @Column({ type: 'uuid' })
  parentId: string;

  @OneToMany(() => Child, (child) => child.parent)
  children: Child[];
}
```

### Query Patterns

#### Basic CRUD
```typescript
// Create
const entity = repository.create({ name: 'Test' });
await repository.save(entity);

// Read
const one = await repository.findOne({ where: { id } });
const all = await repository.find();
const withRelations = await repository.find({
  relations: ['parent', 'children'],
});

// Update
await repository.update(id, { name: 'Updated' });

// Delete
await repository.delete(id);
await repository.softDelete(id); // Soft delete
```

#### Query Builder
```typescript
// Complex queries
const results = await repository
  .createQueryBuilder('entity')
  .leftJoinAndSelect('entity.parent', 'parent')
  .where('entity.isActive = :isActive', { isActive: true })
  .andWhere('entity.createdAt > :date', { date: startDate })
  .orderBy('entity.createdAt', 'DESC')
  .skip(offset)
  .take(limit)
  .getMany();

// Count
const count = await repository
  .createQueryBuilder('entity')
  .where('entity.isActive = :isActive', { isActive: true })
  .getCount();

// Aggregation
const stats = await repository
  .createQueryBuilder('entity')
  .select('COUNT(*)', 'total')
  .addSelect('SUM(entity.amount)', 'totalAmount')
  .getRawOne();
```

#### Pagination
```typescript
async findPaginated(page: number, limit: number) {
  const [items, total] = await this.repository.findAndCount({
    skip: (page - 1) * limit,
    take: limit,
    order: { createdAt: 'DESC' },
  });

  return {
    data: items,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
```

#### Transactions
```typescript
async transferFunds(fromId: string, toId: string, amount: number) {
  return this.dataSource.transaction(async (manager) => {
    const from = await manager.findOne(Account, { where: { id: fromId } });
    const to = await manager.findOne(Account, { where: { id: toId } });

    from.balance -= amount;
    to.balance += amount;

    await manager.save([from, to]);
  });
}
```

### Migration Commands

```bash
# Generate migration
npm run migration:generate -- src/database/migrations/AddUserTable

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

### Migration Template

```typescript
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
```

## Tools Used
- `Read`: Read existing entities
- `Write`: Create entity files
- `Edit`: Modify entities
- `Bash`: Run migration commands

## Best Practices
- Use UUIDs for primary keys
- Add indexes on queried columns
- Use migrations for schema changes
- Handle soft deletes
- Use transactions for multi-step operations
