# AinoJump

AinoJump is a web-based event and training management platform for sports clubs. It allows users to register, log in, view and book events, and for owners/admins to create, edit, and manage events. The project consists of a React frontend and a PHP backend with a MySQL database.

## Features

- User authentication (login, registration, token-based sessions)
- Role-based access (owner/admin, customer)
- Event calendar with instant updates (no page reloads)
- Event creation, editing, and deletion (owner only)
- Event booking and cancellation (customers)
- Color-coded events and favorites
- Responsive UI

## Project Structure

```
AinoJump/
├── backend/
│   ├── accounts/
│   │   ├── login.php
│   │   ├── user.php
│   │   └── ...
│   ├── events/
│   │   ├── create_event.php
│   │   ├── edit_event.php
│   │   ├── get_events.php
│   │   └── ...
│   ├── database/
│   │   └── token.sql
│   ├── database.php
│   └── validate_token.php
├── frontend/
│   ├── src/
│   │   ├── auth/
│   │   │   └── Authentication.js
│   │   ├── components/
│   │   │   ├── Modal.js
│   │   │   ├── EditModal.js
│   │   │   └── ...
│   │   ├── pages/
│   │   │   └── Calendar.js
│   │   └── ...
│   └── ...
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm
- PHP (v7.4+)
- MySQL/MariaDB

### Backend Setup

1. **Database:**
   - Import the SQL schema from `backend/database/token.sql` and your other schema files into your MySQL database.
   - Make sure your `tokens` table has an `expires_at` column:
     ```sql
     ALTER TABLE tokens ADD COLUMN expires_at DATETIME AFTER created_at;
     ```

2. **Configuration:**
   - Edit `backend/database.php` to set your database credentials.

3. **Run the backend:**
   - Locally:  
     ```sh
     php -S localhost:8000 -t backend
     ```
   - Or deploy to your web server (e.g., cPanel public_html/..).

### Frontend Setup

1. **Install dependencies:**
   ```sh
   cd frontend
   npm install
   ```

2. **Configure API base URL:**
   - Edit `frontend/src/baseURL.js` to point to your backend API (e.g., `http://localhost:8000` or your production URL).

3. **Run the frontend:**
   ```sh
   npm start
   ```
   - The app will be available at `http://localhost:3000`.

### Production Build

To build the frontend for production:
```sh
npm run build
```
Deploy the contents of `frontend/build` to your web server.

## Usage

- Register or log in as a user.
- Owners/admins can create, edit, and delete events.
- Customers can view and book events.
- All changes are reflected instantly in the calendar without page reloads.

## Development Notes

- **Token Expiry:** Tokens expire after 1 hour. Both backend and frontend enforce this.
- **CORS:** CORS headers are set in all backend endpoints for cross-origin requests.
- **Error Handling:** Backend returns JSON error messages and appropriate HTTP status codes.

## Troubleshooting

- **500 Internal Server Error:** Check your PHP error logs and ensure your database schema matches the code (especially the `expires_at` column in `tokens`).
- **Events not updating:** Ensure your frontend calls the event-fetching function after creating/editing events, not `window.location.reload()`.

## License

This project is for educational use. For production use, please review and secure all code and dependencies.

---

**Contact:**  
For questions or support, contact the project maintainer.
