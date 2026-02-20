# Student REST API

Spring Boot REST API with CRUD operations for Student entity.

## Prerequisites

- **Java 17+** (JDK installed)
- **MySQL** (running with database `testdb` created)

Maven is not required: the project includes **Maven Wrapper** (`mvnw.cmd` / `mvnw`).

### Setting JAVA_HOME (Windows)

If you see "JAVA_HOME not found in your environment", set it once per PowerShell session:

```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-23"
```

To set it **permanently** for your user:

1. Press Win + R, type `sysdm.cpl`, Enter → **Advanced** → **Environment Variables**.
2. Under "User variables" click **New**: Variable name `JAVA_HOME`, Value `C:\Program Files\Java\jdk-23` (or your JDK path, e.g. `jdk-17`).
3. OK out. Open a **new** PowerShell window and run `.\mvnw.cmd spring-boot:run` again.

## Database Setup

1. Start MySQL.
2. Create the database (if it does not exist):

```sql
CREATE DATABASE IF NOT EXISTS testdb;
```

3. Connection in `application.properties`: database `testdb`, username `root`, password `root`.

## How to Run

### Using Maven Wrapper (recommended)

From the `student-api` folder:

**PowerShell (Windows):** use `.\` so the script in the current directory is run:

```powershell
cd student-api
.\mvnw.cmd spring-boot:run
```

**Command Prompt (Windows):**

```cmd
cd student-api
mvnw.cmd spring-boot:run
```

**Linux / macOS / Git Bash:**

```bash
cd student-api
./mvnw spring-boot:run
```

### Using installed Maven

```bash
cd student-api
mvn spring-boot:run
```

### Using JAR

```powershell
.\mvnw.cmd clean package
java -jar target/student-api-1.0.0.jar
```

The API runs at **http://localhost:8080**.

## API Endpoints

| Method | Endpoint           | Description        |
|--------|--------------------|--------------------|
| POST   | /students          | Create a student   |
| GET    | /students          | Get all students   |
| GET    | /students/{id}     | Get student by id  |
| DELETE | /students/{id}     | Delete student     |

## Sample POST Request (JSON)

Use the file `sample-post-request.json` or send:

```json
{
  "name": "John Doe",
  "city": "Bangalore"
}
```

Example with cURL:

```bash
curl -X POST http://localhost:8080/students \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"John Doe\",\"city\":\"Bangalore\"}"
```

Or with PowerShell:

```powershell
Invoke-RestMethod -Uri "http://localhost:8080/students" -Method Post -ContentType "application/json" -Body '{"name":"John Doe","city":"Bangalore"}'
```

## Package Structure

- `com.example.studentapi` – main application
- `com.example.studentapi.entity` – Student entity
- `com.example.studentapi.repository` – StudentRepository (JPA)
- `com.example.studentapi.service` – StudentService (CRUD)
- `com.example.studentapi.controller` – StudentController (REST)
