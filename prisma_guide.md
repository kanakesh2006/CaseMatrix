# Prisma Guide for CaseMatrixDB

This guide explains how to use Prisma in this project to manage the database schema and interact with the data.

## Useful Commands

### 🔄 Synchronize Schema (Migrations)
When you modify the `prisma/schema.prisma` file, you need to run a migration to update the database:
```bash
npx prisma migrate dev --name your_migration_name
```
This command:
1. Creates a SQL migration file in `prisma/migrations`.
2. Applies the migration to the database.
3. Re-generates the Prisma Client.

### 🌱 Seed Database
To populate the database with initial data (as defined in `prisma/seed.js`):
```bash
npm run db:seed
```

### 🔍 Prisma Studio
Prisma Studio is a visual tool to view and edit your database data:
```bash
npx prisma studio
```

---

## How to Update the Schema

1. Open `prisma/schema.prisma`.
2. Add or modify your models. For example, to add a `Hearing` model:
   ```prisma
   model Hearing {
     id       String   @id @default(uuid())
     case     Case     @relation(fields: [caseId], references: [id])
     caseId   String
     date     DateTime
     location String
   }
   ```
3. Update relationships in other models if necessary (e.g., adding `hearings Hearing[]` to the `Case` model).
4. Run the migration command:
   ```bash
   npx prisma migrate dev --name add_hearing_model
   ```

---

## Interacting with Data (Prisma Client)

In your code, you can use the `prisma` instance from `@/lib/prisma`:

```typescript
import prisma from '@/lib/prisma';

// Fetch all cases
const cases = await prisma.case.findMany();

// Create a new case
const newCase = await prisma.case.create({
  data: {
    title: "New Case Title",
    status: "Open",
    date: new Date(),
    user: { connect: { id: userId } }
  }
});
```





### Before normalization - prisma schema

// Prisma schema for CaseMatrixDB
// Adjust provider to 'postgresql', 'mysql', or 'sqlite' as needed

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql" // Change to your SQL type
  url      = env("DATABASE_URL")
}

model User {
  id             String   @id @default(uuid())
  email          String   @unique
  passwordHash   String
  role           String
  specialization String? // for lawyers
  appointedCases Case[]  @relation("LawyerCases")
  cases          Case[]  @relation("UserCases")
}

model Case {
  id          String   @id @default(uuid())
  title       String
  status      String
  date        DateTime
  description String?
  user        User     @relation("UserCases", fields: [userId], references: [id])
  userId      String
  lawyer      User?    @relation("LawyerCases", fields: [lawyerId], references: [id])
  lawyerId    String?
  evidence    Evidence[]
  witnesses   Witness[]
}

model Evidence {
  id        String   @id @default(uuid())
  case      Case     @relation(fields: [caseId], references: [id])
  caseId    String
  name      String
  type      String
  uploaded  DateTime
}

model Witness {
  id        String   @id @default(uuid())
  case      Case     @relation(fields: [caseId], references: [id])
  caseId    String
  name      String
  statement String
}





### After normalization - prisma schema

// Prisma schema for CaseMatrixDB
// Adjust provider to 'postgresql', 'mysql', or 'sqlite' as needed

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql" // Change to your SQL type
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String
  role         String

  cases          Case[] @relation("UserCases")
  appointedCases Case[] @relation("LawyerCases")

  lawyer Lawyer?
}

model Lawyer {
  userId         String @id
  specialization String

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Case {
  id          String   @id @default(uuid())
  title       String
  date        DateTime
  description String?

  userId   String
  user     User @relation("UserCases", fields: [userId], references: [id])

  lawyerId String?
  lawyer   User? @relation("LawyerCases", fields: [lawyerId], references: [id])

  statusId String
  status   CaseStatus @relation(fields: [statusId], references: [id])

  evidence  Evidence[]
  witnesses Witness[]
}

model CaseStatus {
  id    String @id @default(uuid())
  name  String

  cases Case[]
}

model Evidence {
  id        String   @id @default(uuid())
  caseId    String
  case      Case     @relation(fields: [caseId], references: [id], onDelete: Cascade)

  name      String
  uploaded  DateTime

  typeId String
  type   EvidenceType @relation(fields: [typeId], references: [id])
}

model EvidenceType {
  id   String @id @default(uuid())
  name String

  evidence Evidence[]
}

model Witness {
  id        String   @id @default(uuid())
  caseId    String
  case      Case     @relation(fields: [caseId], references: [id], onDelete: Cascade)
  name      String
  statement String
}