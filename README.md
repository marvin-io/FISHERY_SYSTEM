# Digital Fishery Records Management System

React.js + Bootstrap (frontend) -> Java Spring Boot (backend) -> MySQL (database), with login.
Coastal design inspired by Bantayan Island, Cebu, built around your field photos.

```
fishery-system/
  database/schema.sql      MySQL schema (optional, Spring Boot also creates the tables)
  backend/                 Spring Boot 3 (Java 17+, Maven)
  frontend/                React 18 + Vite + Bootstrap 5
```

## 1. Install (one time)
JDK 21, Maven, Node.js LTS, and MySQL (XAMPP is fine). Check with `java -version`, `mvn -v`, `node -v`.

## 2. Database
1. Start MySQL (XAMPP Control Panel, Start next to MySQL).
2. Open `backend/src/main/resources/application.properties`, line `spring.datasource.password=`:
   - XAMPP: leave it empty (nothing after the `=`).
   - MySQL Server: type the root password you chose.

The database and tables are created automatically on first start.

## 3. Run the backend (port 8080)
```
cd backend
mvn spring-boot:run
```
Wait for `Started FisheryApplication`. Demo accounts:
- `admin` / `admin123` (Fishery Personnel, can delete records)
- `staff` / `staff123` (Authorized Staff, cannot delete)

Change both under My account after your first login.

## 4. Run the frontend (port 5173)
In a second terminal:
```
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

## Change the design
- Names and place shown on every page: `frontend/src/config.js`
- Colours and fonts: the variables at the top of `frontend/src/index.css`
- Photos: replace `boat.jpg`, `castnet.jpg`, `harvest.jpg` in `frontend/src/assets/` (keep the file names)

## API
| Method | URL | Notes |
|--------|-----|-------|
| POST | `/api/auth/login` | returns a token |
| PUT | `/api/account` | change own username and/or password |
| GET | `/api/records?q=&sort=asc` | search and sort by surname |
| GET | `/api/records/{id}` | one record |
| POST | `/api/records` | add |
| PUT | `/api/records/{id}` | update |
| DELETE | `/api/records/{id}` | ADMIN only |
| GET | `/api/records/stats` | dashboard numbers |

## Troubleshooting
- `Access denied for user 'root'`: wrong MySQL password in `application.properties`.
- `Communications link failure`: MySQL is not started.
- Login says it cannot reach the server: the backend is not running.
- Port 8080 busy: change `server.port` in `application.properties` and `baseURL` in `frontend/src/api.js`.
