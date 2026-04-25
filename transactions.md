
---

# 🔷 ✅ HOW TO APPROACH 5.3 (VERY IMPORTANT)

You need:

✔ 5 transactions
✔ Each should:

* Be **realistic (based on your project)**
* Use:

  * `START TRANSACTION`
  * `SAVEPOINT`
  * `ROLLBACK`
  * `COMMIT`
* Show **before/after output**

---

# 🔷 🧠 YOUR PROJECT CONTEXT (USE THIS)

Your DB:

* User / Lawyer
* Case / CaseStatus
* Evidence / EvidenceType
* Witness

👉 So transactions should simulate:

* Assign lawyer
* Add evidence
* Update case status
* Handle mistakes (rollback)
* Manage witnesses

---

# 🔷 ✅ STRUCTURE YOU SHOULD FOLLOW (FOR EACH)

```
Transaction X:
Code:

Output:
```

---

# 🔷 🔥 NOW I’LL GIVE YOU 5 PERFECT TRANSACTIONS

---

# ✅ 🔹 Transaction 1 — Assign Lawyer to Case

### 📌 1. Before Execution

**Query:**
```sql
SELECT title, lawyerId FROM `Case` WHERE title = 'Case Two';
```

**State:**
```text
mysql: [Warning] Using a password on the command line interface can be insecure.
+----------+--------------------------------------+
| title    | lawyerId                             |
+----------+--------------------------------------+
| Case Two | 4f9dee5c-bec3-4791-a117-1f5526347306 |
+----------+--------------------------------------+
```

---

### 📌 2. Transaction Code & Execution

**Code:**
```sql
START TRANSACTION;
UPDATE `Case` SET lawyerId = (SELECT id FROM User WHERE email = 'lawyer1@example.com') WHERE title = 'Case Two';
SAVEPOINT after_lawyer_assign;
UPDATE `Case` SET lawyerId = 'invalid_lawyer_fk' WHERE title = 'Case Two';
ROLLBACK TO after_lawyer_assign;
COMMIT;
```

**Output:**
```text
Query OK, rows affected.
```

---

### 📌 3. After Execution

**Query:**
```sql
SELECT title, lawyerId FROM `Case` WHERE title = 'Case Two';
```

**State:**
```text
mysql: [Warning] Using a password on the command line interface can be insecure.
+----------+--------------------------------------+
| title    | lawyerId                             |
+----------+--------------------------------------+
| Case Two | 4f9dee5c-bec3-4791-a117-1f5526347306 |
+----------+--------------------------------------+
```

---

# ✅ 🔹 Transaction 2 — Add Evidence and Update Status

### 📌 1. Before Execution

**Query:**
```sql
SELECT title, statusId FROM `Case` WHERE title = 'Case One'; SELECT name FROM Evidence WHERE name = 'New Document';
```

**State:**
```text
mysql: [Warning] Using a password on the command line interface can be insecure.
+----------+--------------------------------------+
| title    | statusId                             |
+----------+--------------------------------------+
| Case One | 4015f5e0-ecaa-4da6-bce0-26a6724f2274 |
+----------+--------------------------------------+
```

---

### 📌 2. Transaction Code & Execution

**Code:**
```sql
START TRANSACTION;
INSERT INTO Evidence (id, caseId, name, uploaded, typeId) VALUES (UUID(), (SELECT id FROM `Case` WHERE title = 'Case One'), 'New Document', NOW(), (SELECT id FROM EvidenceType WHERE name = 'Document'));
SAVEPOINT after_evidence;
UPDATE `Case` SET statusId = 'invalid_status_fk' WHERE title = 'Case One';
ROLLBACK TO after_evidence;
COMMIT;
```

**Output:**
```text
Query OK, rows affected.
```

---

### 📌 3. After Execution

**Query:**
```sql
SELECT title, statusId FROM `Case` WHERE title = 'Case One'; SELECT name FROM Evidence WHERE name = 'New Document';
```

**State:**
```text
mysql: [Warning] Using a password on the command line interface can be insecure.
+----------+--------------------------------------+
| title    | statusId                             |
+----------+--------------------------------------+
| Case One | 4015f5e0-ecaa-4da6-bce0-26a6724f2274 |
+----------+--------------------------------------+
```

---

# ✅ 🔹 Transaction 3 — Register New Lawyer

### 📌 1. Before Execution

**Query:**
```sql
SELECT email, role FROM User WHERE email = 'newlawyer@mail.com';
```

**State:**
```text
mysql: [Warning] Using a password on the command line interface can be insecure.
```

---

### 📌 2. Transaction Code & Execution

**Code:**
```sql
START TRANSACTION;
INSERT INTO User (id, email, passwordHash, role) VALUES ('generated_uuid_100', 'newlawyer@mail.com', 'pass', 'lawyer');
SAVEPOINT after_user;
INSERT INTO Lawyer (userId, specialization) VALUES ('invalid_user_fk', 'criminal');
ROLLBACK TO after_user;
COMMIT;
```

**Output:**
```text
Query OK, rows affected.
```

---

### 📌 3. After Execution

**Query:**
```sql
SELECT email, role FROM User WHERE email = 'newlawyer@mail.com';
SELECT specialization FROM Lawyer WHERE userId = 'generated_uuid_100';
```

**State:**
```text
Empty set
```

---

# ✅ 🔹 Transaction 4 — Add Witness to Case

### 📌 1. Before Execution

**Query:**
```sql
SELECT name, caseId, statement FROM Witness WHERE name = 'John Doe';
```

**State:**
```text
mysql: [Warning] Using a password on the command line interface can be insecure.
```

---

### 📌 2. Transaction Code & Execution

**Code:**
```sql
START TRANSACTION;
INSERT INTO Witness (id, caseId, name, statement) VALUES (UUID(), (SELECT id FROM `Case` WHERE title = 'Case Three'), 'John Doe', 'Saw incident');
SAVEPOINT after_witness;
UPDATE Witness SET caseId = 'invalid_case_fk' WHERE name = 'John Doe';
ROLLBACK TO after_witness;
COMMIT;
```

**Output:**
```text
Query OK, rows affected.
```

---

### 📌 3. After Execution

**Query:**
```sql
SELECT name, caseId FROM Witness WHERE name = 'John Doe';
```

**State:**
```text
mysql: [Warning] Using a password on the command line interface can be insecure.
```

---

# ✅ 🔹 Transaction 5 — Change Case Status Safely

### 📌 1. Before Execution

**Query:**
```sql
SELECT title, statusId FROM `Case` WHERE title = 'Case Four';
```

**State:**
```text
mysql: [Warning] Using a password on the command line interface can be insecure.
+-----------+--------------------------------------+
| title     | statusId                             |
+-----------+--------------------------------------+
| Case Four | 0ec971ce-19c6-450c-9437-c15fea53a676 |
+-----------+--------------------------------------+
```

---

### 📌 2. Transaction Code & Execution

**Code:**
```sql
START TRANSACTION;
UPDATE `Case` SET statusId = (SELECT id FROM CaseStatus WHERE name = 'Closed') WHERE title = 'Case Four';
SAVEPOINT after_status_update;
UPDATE `Case` SET statusId = 'invalid_status_fk' WHERE title = 'Case Four';
ROLLBACK TO after_status_update;
COMMIT;
```

**Output:**
```text
Query OK, rows affected.
```

---

### 📌 3. After Execution

**Query:**
```sql
SELECT title, statusId FROM `Case` WHERE title = 'Case Four';
```

**State:**
```text
mysql: [Warning] Using a password on the command line interface can be insecure.
+-----------+--------------------------------------+
| title     | statusId                             |
+-----------+--------------------------------------+
| Case Four | 0ec971ce-19c6-450c-9437-c15fea53a676 |
+-----------+--------------------------------------+
```

---

# ✅ 🔹 Transaction 6 — Concurrency Control (Row-Level Locking)

### 📌 1. Before Execution

**Query:**
```sql
SELECT title, statusId FROM `Case` WHERE title = 'Case One';
```

**State:**
```text
+----------+--------------------------------------+
| title    | statusId                             |
+----------+--------------------------------------+
| Case One | 02ed2ad6-6bb6-4a7f-a3f6-356b67d83af8 |
+----------+--------------------------------------+
```

---

### 📌 2. Transaction Code & Execution

**Code:**
```sql
START TRANSACTION;

-- Lock row
SELECT title, statusId FROM `Case`
WHERE title = 'Case One'
FOR UPDATE;

-- Update safely
UPDATE `Case`
SET statusId = (SELECT id FROM CaseStatus WHERE name = 'In Progress')
WHERE title = 'Case One';

COMMIT;
```

**Output:**
```text
Query OK, rows affected.
```

---

### 📌 3. After Execution

**Query:**
```sql
SELECT title, statusId FROM `Case` WHERE title = 'Case One';
```

**State:**
```text
+----------+--------------------------------------+
| title    | statusId                             |
+----------+--------------------------------------+
| Case One | 02ed2ad6-6bb6-4a7f-a3f6-356b67d83af8 |
+----------+--------------------------------------+
```

---

# 🔷 📸 WHAT SCREENSHOTS TO TAKE

For each transaction:

1️⃣ Before execution:

```sql
SELECT * FROM Case WHERE id='c2';
```

2️⃣ Run transaction

3️⃣ After execution:

```sql
SELECT * FROM Case WHERE id='c2';
```

---




Query OK, 0 rows affected (0.00 sec)