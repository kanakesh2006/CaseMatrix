The outputs shown are **representative outputs** assuming the data inserted below.

---

# Additional Data to Insert into Tables

Insert this data **after your existing sample data**.

```sql
-- Additional Users
INSERT INTO `User` (`id`,`email`,`passwordHash`,`role`,`specialization`) VALUES
('u2','client2@example.com','password','user',NULL),
('u3','client3@example.com','password','user',NULL),
('l2','lawyer2@example.com','password','lawyer','criminal'),
('l3','lawyer3@example.com','password','lawyer','corporate');

-- Additional Cases
INSERT INTO `Case` (`id`,`title`,`status`,`date`,`description`,`userId`,`lawyerId`) VALUES
('c3','Adams vs Metro Corp','Closed',NOW(),'Corporate fraud investigation','u2','l3'),
('c4','Miller vs State','Open',NOW(),'Public disturbance case','u3','l2'),
('c5','Jackson vs Adams','In Progress',NOW(),'Property dispute','u2','l1');

-- Additional Evidence
INSERT INTO `Evidence` (`id`,`caseId`,`name`,`type`,`uploaded`) VALUES
('e4','c3','Financial Report','Document',NOW()),
('e5','c4','Police Camera','Video',NOW()),
('e6','c5','Land Ownership Papers','Document',NOW());

-- Additional Witness
INSERT INTO `Witness` (`id`,`caseId`,`name`,`statement`) VALUES
('w3','c3','Michael Brown','Saw financial document exchange'),
('w4','c4','Emma Wilson','Witnessed the incident near park'),
('w5','c5','David Lee','Present during property dispute');
```

---

# CHAPTER 3

Complex Queries

---

# 3.1 Adding Constraints and Queries Based on Constraints

### Question 1

Ensure that the `role` column in the User table only accepts `user`, `lawyer`, or `judge`.

SQL Statement

```sql
ALTER TABLE User
ADD CONSTRAINT chk_role
CHECK (role IN ('user','lawyer','judge'));
```

Output

```text
Query executed successfully.
```

---

### Question 2

Ensure that the `status` of a case can only be `Open`, `In Progress`, or `Closed`.

SQL Statement

```sql
ALTER TABLE `Case`
ADD CONSTRAINT chk_status
CHECK (status IN ('Open','In Progress','Closed'));
```

Output

```text
Query executed successfully.
```

---

### Question 3

Ensure every evidence entry must belong to a valid case.

SQL Statement

```sql
ALTER TABLE Evidence
ADD CONSTRAINT fk_case_evidence
FOREIGN KEY (caseId) REFERENCES `Case`(id);
```

Output

```text
Query executed successfully.
```

---

# 3.2 Queries Based on Aggregate Functions

### Question 1

Find the total number of cases in the system.

SQL Statement

```sql
SELECT COUNT(*) AS TotalCases
FROM `Case`;
```

Output

```text
+------------+
| TotalCases |
+------------+
|          5 |
+------------+
```

---

### Question 2

Find the number of cases handled by each lawyer.

SQL Statement

```sql
SELECT lawyerId, COUNT(*) AS CaseCount
FROM `Case`
WHERE lawyerId IS NOT NULL
GROUP BY lawyerId;
```

Output

```text
+----------+-----------+
| lawyerId | CaseCount |
+----------+-----------+
| l1       |         2 |
| l2       |         1 |
| l3       |         1 |
+----------+-----------+
```

---

### Question 3

Find number of evidence records per case.

SQL Statement

```sql
SELECT caseId, COUNT(*) AS EvidenceCount
FROM Evidence
GROUP BY caseId;
```

Output

```text
+--------+---------------+
| caseId | EvidenceCount |
+--------+---------------+
| c1     |             2 |
| c2     |             1 |
| c3     |             1 |
| c4     |             1 |
| c5     |             1 |
+--------+---------------+
```

---

# 3.3 Complex Queries Based on Sets

### Question 1

Find users who are both lawyers and assigned to cases.

SQL Statement

```sql
SELECT id FROM User WHERE role='lawyer'
AND id IN (SELECT lawyerId FROM `Case`);
```

Output

```text
+----+
| id |
+----+
| l1 |
| l2 |
| l3 |
+----+
```

---

### Question 2

Find users who created cases but are not lawyers.

SQL Statement

```sql
SELECT id FROM User WHERE role='user'
AND id NOT IN (SELECT lawyerId FROM `Case`);
```

Output

```text
+----+
| id |
+----+
| u1 |
| u2 |
| u3 |
+----+
```

---

### Question 3

List all unique case identifiers appearing in Case or Evidence tables.

SQL Statement

```sql
SELECT id FROM `Case`
UNION
SELECT caseId FROM Evidence;
```

Output

```text
+----+
| id |
+----+
| c1 |
| c2 |
| c3 |
| c5 |
| c4 |
+----+
```

---

# 3.4 Complex Queries Based on Subqueries

### Question 1

Find cases that have more evidence than the average number of evidence entries.

SQL Statement

```sql
SELECT caseId
FROM Evidence
GROUP BY caseId
HAVING COUNT(*) >
(
SELECT AVG(cnt)
FROM
(
SELECT COUNT(*) AS cnt
FROM Evidence
GROUP BY caseId
) AS evidence_avg
);
```

Output

```text
+--------+
| caseId |
+--------+
| c1     |
+--------+
```

---

### Question 2

Find users who have created at least one case.

SQL Statement

```sql
SELECT email
FROM User
WHERE id IN
(
SELECT userId
FROM `Case`
);
```

Output

```text
+---------------------+
| email               |
+---------------------+
| user@example.com    |
| client2@example.com |
| client3@example.com |
+---------------------+
```

---

### Question 3

Find cases that currently have no lawyer assigned.

SQL Statement

```sql
SELECT title
FROM `Case`
WHERE lawyerId IS NULL;
```

Output

```text
+----------------+
| title          |
+----------------+
| State vs Brown |
+----------------+
```

---

# 3.5 Complex Queries Based on Joins

### Question 1

Display case title with client email.

SQL Statement

```sql
SELECT Case.title, User.email
FROM `Case`
JOIN User
ON Case.userId = User.id;
```

Output

```text
+---------------------+---------------------+
| title               | email               |
+---------------------+---------------------+
| Smith vs Johnson    | user@example.com    |
| State vs Brown      | user@example.com    |
| Adams vs Metro Corp | client2@example.com |
| Miller vs State     | client3@example.com |
| Jackson vs Adams    | client2@example.com |
+---------------------+---------------------+
```

---

### Question 2

Show cases along with assigned lawyer specialization.

SQL Statement

```sql
SELECT Case.title, User.specialization
FROM `Case`
JOIN User
ON Case.lawyerId = User.id;
```

Output

```text
+---------------------+----------------+
| title               | specialization |
+---------------------+----------------+
| Smith vs Johnson    | civil          |
| Adams vs Metro Corp | corporate      |
| Miller vs State     | criminal       |
| Jackson vs Adams    | civil          |
+---------------------+----------------+
```

---

### Question 3

List witnesses along with case titles.

SQL Statement

```sql
SELECT Witness.name, Case.title
FROM Witness
JOIN `Case`
ON Witness.caseId = Case.id;
```

Output

```text
+---------------+---------------------+
| name          | title               |
+---------------+---------------------+
| Alice Green   | Smith vs Johnson    |
| Bob White     | State vs Brown      |
| Michael Brown | Adams vs Metro Corp |
| Emma Wilson   | Miller vs State     |
| David Lee     | Jackson vs Adams    |
+---------------+---------------------+
```

---

# 3.6 Complex Queries Based on Views

---

### Question 1

Create a view to display case title along with the assigned lawyer’s email.

SQL Statement

```sql
CREATE VIEW CaseLawyerView AS
SELECT Case.title, User.email AS LawyerEmail
FROM `Case`
JOIN User
ON Case.lawyerId = User.id;
```

Output

```text
Query executed successfully.
```

---

### Question 2

Display the data stored in the created view.

SQL Statement

```sql
SELECT * FROM CaseLawyerView;
```

Output

```text
+---------------------+---------------------+
| title               | LawyerEmail         |
+---------------------+---------------------+
| Smith vs Johnson    | lawyer@example.com  |
| Adams vs Metro Corp | lawyer3@example.com |
| Miller vs State     | lawyer2@example.com |
| Jackson vs Adams    | lawyer@example.com  |
+---------------------+---------------------+
```

---

### Question 3

Drop the created view from the database.

SQL Statement

```sql
DROP VIEW CaseLawyerView;
```

Output

```text
Query executed successfully.
```

---

# 3.7 Complex Queries Based on Triggers

---

### Question 1

Create a trigger to automatically update the case status to "In Progress" when new evidence is inserted.

SQL Statement

```sql
DELIMITER $$

CREATE TRIGGER update_case_status
AFTER INSERT ON Evidence
FOR EACH ROW
BEGIN
    UPDATE `Case`
    SET status = 'In Progress'
    WHERE id = NEW.caseId;
END$$

DELIMITER ;
```

Output

```text
Query executed successfully.
```

---

### Question 2

Insert a new evidence record to demonstrate the working of the trigger.

SQL Statement

```sql
INSERT INTO Evidence VALUES
('e8','c2','Audio Recording','Audio',NOW());

SELECT title, status
FROM `Case`
WHERE id = 'c2';
```

Output

```text
+----------------+-------------+
| title          | status      |
+----------------+-------------+
| State vs Brown | In Progress |
+----------------+-------------+
```

---

### Question 3

Drop the created trigger from the database.

SQL Statement

```sql
DROP TRIGGER update_case_status;
```

Output

```text
Query executed successfully.
```

---

# 3.8 Complex Queries Based on Cursors

### Question 1

Create cursor to iterate through cases.

SQL Statement

```sql
DELIMITER $$
CREATE PROCEDURE list_cases()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE caseTitle VARCHAR(191);

    DECLARE case_cursor CURSOR FOR
    SELECT title FROM `Case`;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN case_cursor;

    read_loop: LOOP
    FETCH case_cursor INTO caseTitle;
    IF done THEN
    LEAVE read_loop;
    END IF;
    SELECT caseTitle;
    END LOOP;

    CLOSE case_cursor;
END$$
DELIMITER ;

CALL list_cases();
```

Output

```text
+------------------+
| caseTitle        |
+------------------+
| Smith vs Johnson |
+------------------+
+----------------+
| caseTitle      |
+----------------+
| State vs Brown |
+----------------+
+---------------------+
| caseTitle           |
+---------------------+
| Adams vs Metro Corp |
+---------------------+
+-----------------+
| caseTitle       |
+-----------------+
| Miller vs State |
+-----------------+
+------------------+
| caseTitle        |
+------------------+
| Jackson vs Adams |
+------------------+
```

---

### Question 2

Cursor to list all witnesses.

SQL Statement

```sql
DELIMITER $$
CREATE PROCEDURE declare_witness_cursor()
BEGIN
    DECLARE witnessName VARCHAR(191);

    DECLARE witness_cursor CURSOR FOR
    SELECT name FROM Witness;
END$$
DELIMITER ;

CALL declare_witness_cursor();
```

Output

```text
Query executed successfully.
```

---

### Question 3

Cursor for iterating evidence names.

SQL Statement

```sql
DELIMITER $$
CREATE PROCEDURE declare_evidence_cursor()
BEGIN
    DECLARE evidence_cursor CURSOR FOR
    SELECT name FROM Evidence;
END$$
DELIMITER ;

CALL declare_evidence_cursor();
```

Output

```text
Query executed successfully.
```

---



# 3.9 Functions and Exception Handling

### Question 1

Create a function to calculate total cases created by a given user.

SQL Statement

```sql
DELIMITER $$

CREATE FUNCTION get_case_count(u_id VARCHAR(191))
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE total INT;
    SELECT COUNT(*) INTO total
    FROM `Case`
    WHERE userId = u_id COLLATE utf8mb4_unicode_ci;
    RETURN total;
END$$

DELIMITER ;

SELECT User.email, get_case_count(User.id) AS TotalCases FROM User;
```

Output

```text
+---------------------+------------+
| email               | TotalCases |
+---------------------+------------+
| client2@example.com |          2 |
| client3@example.com |          1 |
| judge@example.com   |          0 |
| lawyer@example.com  |          0 |
| lawyer2@example.com |          0 |
| lawyer3@example.com |          0 |
| user@example.com    |          2 |
+---------------------+------------+
```

---

### Question 2

Demonstrate exception handling when attempting a bad insert.

SQL Statement

```sql
DELIMITER $$

CREATE PROCEDURE safe_insert_case()
BEGIN
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
        SELECT 'Error occurred while inserting case (Foreign Key constraint failed)' AS message;
    END;

    -- Attempting to insert a case with a non-existent userId 'invalid_user'
    INSERT INTO `Case` (`id`, `title`, `status`, `date`, `userId`) 
    VALUES ('c99', 'Test Case', 'Open', NOW(), 'invalid_user');
END$$

DELIMITER ;

CALL safe_insert_case();
```

Output

```text
+---------------------------------------------------------------------+
| message                                                             |
+---------------------------------------------------------------------+
| Error occurred while inserting case (Foreign Key constraint failed) |
+---------------------------------------------------------------------+
```

---

### Question 3

Create a function to return the total number of evidence records for a given case.

SQL Statement

```sql
DELIMITER $$

CREATE FUNCTION get_evidence_count(c_id VARCHAR(191))
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE total INT;

    SELECT COUNT(*) INTO total
    FROM Evidence
    WHERE caseId = c_id COLLATE utf8mb4_unicode_ci;

    RETURN total;
END$$

DELIMITER ;

SELECT id AS CaseID, get_evidence_count(id) AS EvidenceCount
FROM `Case`;
```

Output

```text
+--------+---------------+
| CaseID | EvidenceCount |
+--------+---------------+
| c1     |             2 |
| c2     |             2 |
| c3     |             1 |
| c5     |             1 |
| c4     |             1 |
+--------+---------------+
```

---
