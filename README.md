# SwiftRide Full Stack App

SwiftRide is a beginner-friendly ride-hailing semester project built in one folder with:

- `frontend/` React, React Router, Axios, Leaflet, Chart.js
- `backend/` Java 17 Spring Boot REST API, JPA, MySQL
- `database/` MySQL Workbench schema, seed data, view, stored procedure, trigger

## Login Credentials

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@swiftride.com` | `admin123` |
| Rider | `ahmed@gmail.com` | `rider123` |
| Driver | `bilal@gmail.com` | `driver123` |

## Database Setup

1. Open MySQL Workbench.
2. Run `database/01_schema.sql`.
3. Run `database/02_seed.sql`.
4. Run `database/03_views_procedures_triggers.sql`.

The Spring Boot app can also create/update tables automatically through JPA if the `swiftride` database exists.

## Run Full App With One Command

From the main SwiftRide folder:

```bash
npm install
npm run dev
```

This starts both:

- Backend: `http://localhost:8080`
- Frontend: `http://localhost:3000`

Java 17 and Maven must be installed for the backend command to work.
The root `npm install` also installs the frontend dependencies automatically.

## Backend Setup

Create a local `.env` file from the example:

```bash
cp .env.example .env
```

Then edit `.env` with your MySQL username/password:

```env
DB_URL=jdbc:mysql://localhost:3306/swiftride?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=your_mysql_password_here
```

The real `.env` file is ignored by Git so your password is not pushed to GitHub.

```bash
cd backend
mvn spring-boot:run
```

Backend runs at `http://localhost:8080`.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`.

## Main API Endpoints

- `POST /api/auth/login`
- `GET /api/drivers`
- `GET /api/drivers/available`
- `GET /api/fares`
- `PUT /api/fares/{id}`
- `POST /api/trips`
- `GET /api/trips/rider/{riderId}`
- `GET /api/trips/driver/{driverId}`
- `GET /api/trips/requested`
- `PUT /api/trips/{tripId}/accept/{driverId}`
- `PUT /api/trips/{tripId}/complete`
- `POST /api/trips/rate`
- `GET /api/reports/summary`

## Viva Explanation

The app uses six required tables: `users`, `drivers`, `vehicles`, `fare_rates`, `trips`, and `ratings`.

Flow:

1. Rider logs in and books a trip.
2. Trip is saved with `REQUESTED` status and fare is calculated from `fare_rates`.
3. Driver sees requested trips and accepts one.
4. Trip changes to `ACCEPTED`, and the driver becomes unavailable.
5. Driver completes the trip, changing status to `COMPLETED`.
6. Rider rates the driver, and the driver's average rating is updated.
7. Admin dashboard reads reports, manages drivers, and edits fare rates.
