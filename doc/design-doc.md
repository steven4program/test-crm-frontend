# Simple CRM App Design Document

## Overview

This document outlines the design for a **simple CRM application** with a React/TypeScript front-end and a NestJS/Node.js back-end. The app’s purpose is to demonstrate best practices in unit, integration, and end-to-end (E2E) testing, using a minimal feature set so the code remains easy to follow. It will implement a basic Customer Relationship Management (CRM) system for an e-commerce context, including **customer management** and **user role-based access control (RBAC)**. Both frontend and backend will be containerized with Docker for consistency, with the frontend deployed on Vercel and the backend on Zeabur.

**Key Features and Requirements:**

* **Customer Management (CRUD):** Authorized users can **Create, Read, Update, Delete** customer records.
* **User Management & RBAC:** The system has **two roles** – **Admin** and **Viewer**. There will be a default Admin user account on first launch. Admins can manage users (create other users and assign roles) and have full CRUD access; Viewers can only read data (no modifications).
* **Authentication:** Users must **login** with username/password to obtain a JWT token. Subsequent requests use this token for authentication. **Logout** will invalidate the session on the client side.
* **RESTful API:** The backend exposes REST endpoints for all features. A clear API contract is defined so frontend and backend developers can work in parallel.
* **Testing Coverage:** The project includes **unit tests** (isolated logic tests), **integration tests** (testing modules/components together, including database or API interactions), and **E2E tests** (simulating user flows on the deployed app). This ensures reliability at all levels of the stack.

*Example Use Case:* Upon deployment, a default Admin logs in (using preset credentials) to register some customers and to create additional user accounts (Admin or Viewer). A Viewer-level user can then log in to see the customer list but will be **prevented from making any edits or deletions** (both via UI and API enforcement). If the Viewer attempts a forbidden action, the UI will hide or disable those controls, and the backend will return a **HTTP 403 Forbidden** response (due to role checks) to reinforce the restriction.

---

## Backend (NestJS) Design

### Tech Stack & Architecture

The backend is built with **NestJS** (Node.js/TypeScript framework) organized in a modular architecture. We will use **MySQL** as the database, and perform data access with **raw SQL queries** (using a Node MySQL client library) for simplicity and transparency. NestJS’s structure (controllers, services, modules) will be used to clearly separate concerns:

* **Controllers:** Define REST API endpoints for auth, users, and customers. Controllers handle HTTP requests and responses.
* **Services:** Contain business logic and interact with the database (executing SQL queries). For example, a `UserService` for user CRUD and a `CustomerService` for customer CRUD.
* **Modules:** Group related controllers and providers. We will have modules such as `AuthModule`, `UserModule`, and `CustomerModule`, all imported into the root `AppModule`.

**Database Connection:** The app will use a MySQL connection (configured via environment variables for host, port, credentials, etc.). Using raw SQL means we might utilize the official `mysql2` or `mysql` Node package to execute queries in service methods. Each service will prepare parameterized SQL statements to query or mutate the data. (Alternatively, a lightweight query builder or ORM could be used in raw SQL mode, but that’s optional.)

**Deployment Context:** The backend will run in a Docker container. It will listen on the port provided by the environment (e.g. `process.env.PORT`) so that hosting on Zeabur works seamlessly. Zeabur can deploy the service directly from the Git repository and **automatically detect** the NestJS project configuration, simplifying deployment. Basic configuration (like the database URL and JWT secret) will be provided via environment variables in Zeabur’s dashboard.

### Data Model

The system manages two core entities in the database: **User** and **Customer**. The schema can be kept minimal:

* **User Table:** Stores application user accounts. Fields might include:

  * `id` (INT, primary key)
  * `username` (VARCHAR, unique) – login identifier (could be email or a simple name).
  * `password` (VARCHAR) – hashed password (see note on security below).
  * `role` (ENUM or VARCHAR) – user role, e.g. `'admin'` or `'viewer'`.

  A **default Admin user** will be pre-created in this table when the app first runs. For example, a user with username **“admin”** (or a configured email) and a known default password. This seeding can be done via an SQL seed file or by a service on app startup. The default Admin ensures there is always at least one administrative account to manage the system. (In production, the default password should be changed immediately for security.)

* **Customer Table:** Stores customer records for the e-commerce CRM context. Fields could include:

  * `id` (INT, primary key)
  * `name` (VARCHAR) – Customer’s name or identifier.
  * `email` (VARCHAR) – Contact email of the customer.
  * `phone` (VARCHAR) – Contact phone number (optional).
  * (Additional fields like address, etc., are optional; we keep it minimal for simplicity.)

  Customers have no direct relationship to users in this simple app (i.e. any admin can manage any customer). We assume all customers are global records to be managed.

**Note on Password Storage:** In this design, user passwords will be stored securely by hashing them (e.g. using bcrypt) before storing in the database. *In a real application, plain-text passwords must never be stored.* Instead, one should store only hashed passwords and compare hash values on login. For simplicity in a demo, one might be tempted to store plain passwords or use a hardcoded list (as in many NestJS examples), but we will follow best practices by hashing passwords even in this simple app.

### Authentication & Authorization

**Authentication:** The app uses JWT (JSON Web Token) for authentication. Users will call a login API with their credentials, which the server verifies against the Users table. On successful login, the server responds with a signed JWT token. We will use Nest’s `@nestjs/jwt` package to generate this token. The JWT **payload** will include the user’s identifier and role (for example, `{ sub: user.id, username: user.username, role: user.role }`). NestJS will sign the token with a secret key and return it as a JSON response, e.g. `{ "access_token": "<JWT_TOKEN>" }`. (We may also return basic user info like username and role for convenience.) The client will store this token for subsequent requests.

All protected endpoints will require a valid JWT. We will implement an **Auth Guard** in NestJS that checks for the `Authorization` header on incoming requests. The header should be in the format **`Authorization: Bearer <token>`**. The guard will **verify** the token’s signature and extract the payload. If the token is missing or invalid, the request is rejected with 401 Unauthorized. If valid, the guard attaches the decoded token payload (user info) to the request object for use in controllers.

**Authorization (RBAC):** With the user’s role known (either from the token payload or by looking up the user), the backend enforces role-based access. Only **Admin** users can create, update, or delete resources, while **Viewer** users can only read. We will create a simple **Roles Guard** (or use metadata/decorators) to apply on endpoints that require admin rights. For example, the Customers **POST/PUT/DELETE** endpoints and all User management endpoints will check that `request.user.role === 'admin'` before proceeding. If a Viewer token is used on an admin-only endpoint, the server will respond with 403 Forbidden, similar to how NestJS’s RolesGuard denies access when roles don’t match. Conversely, admin tokens will be allowed to access all endpoints (Admins have universal access by design).

**Default Admin:** The first admin account (seeded in the DB) will be used to log in and bootstrap the system. Its credentials (e.g. username `"admin"`, password `"Admin@123"`) will be provided to the team. The login process for this account is the same as any user: call the login API, get a token, then use that token for subsequent calls. The default Admin can create additional users (either admins or viewers) via the user management API, which helps demonstrate the role management feature.

### REST API Endpoints

The backend exposes a RESTful API. Below is the API specification detailing each endpoint, request/response format, and access control. This acts as the contract between frontend and backend developers:

**Auth & Session:**

* **POST** `/auth/login` – **Login a user and retrieve JWT.**

  * *Request:* JSON body `{ "username": "<string>", "password": "<string>" }`.
  * *Response:* **200 OK** with JSON `{ "access_token": "<JWT>", "user": { "id": \<number>, "username": "<string>", "role": "<admin|viewer>" } }`. The `access_token` is a JWT to be used in subsequent requests. (Including the user object here helps the frontend know the role immediately after login.)
  * *Errors:* **401 Unauthorized** if credentials are invalid.
  * *Auth:* Public (no token required).

* **POST** `/auth/logout` – **Logout endpoint (optional):** Since the frontend can handle logout by discarding the token, this could be just a dummy endpoint or omitted. (If implemented, it might blacklist the token server-side or simply be a no-op that the client calls for logging purposes.)

  * *Auth:* Requires a valid JWT (though it will simply invalidate it client-side).
  * *Response:* 200 OK (no body).

**User Management:** (All **Admin-only** – these endpoints require an Admin JWT)

* **GET** `/users` – **List all users.**

  * *Auth:* Admin only.
  * *Response:* 200 OK with JSON array of users. Each user object might include `id, username, role`. (Password hashes are **not** returned.)
* **POST** `/users` – **Create a new user.**

  * *Auth:* Admin only.
  * *Request:* JSON `{ "username": "<string>", "password": "<string>", "role": "<admin|viewer>" }`.
  * *Response:* 201 Created with JSON of the created user `{ "id": ..., "username": "...", "role": "..." }`. The password is stored internally (hashed) but not returned.
  * *Errors:* 400 Bad Request if username already exists or data invalid.
* **PUT** `/users/{id}` – **Update an existing user.**

  * *Auth:* Admin only.
  * *Request:* JSON can include fields to update. Typically, admins might update a user’s role or reset a password. E.g. `{ "password": "<newPassword>", "role": "<admin|viewer>" }`. If updating password, it will be hashed before storing.
  * *Response:* 200 OK with updated user JSON (or 204 No Content).
  * *Errors:* 404 if user not found.
* **DELETE** `/users/{id}` – **Delete a user.**

  * *Auth:* Admin only (an admin cannot delete themselves via API as a safety measure, that can be handled separately).
  * *Response:* 204 No Content on success.
  * *Errors:* 404 if user not found.

**Customer Management:** (Admin can write; Viewer can only read)

* **GET** `/customers` – **List all customers.**

  * *Auth:* **Requires JWT** (Admin or Viewer). Both roles can fetch the list.
  * *Response:* 200 OK with JSON array of customer records. (E.g. `[ { "id": 1, "name": "...", "email": "...", "phone": "..." }, {...} ]`).
* **GET** `/customers/{id}` – **Get details of a specific customer.**

  * *Auth:* Requires JWT (any role).
  * *Response:* 200 OK with JSON of the customer record. 404 if not found.
* **POST** `/customers` – **Create a new customer.**

  * *Auth:* **Admin only.**
  * *Request:* JSON `{ "name": "<string>", "email": "<string>", "phone": "<string>" }` (all fields for the new customer).
  * *Response:* 201 Created with JSON of new customer (including generated `id`).
  * *Errors:* 400 if data invalid (e.g. missing required fields).
* **PUT** `/customers/{id}` – **Update an existing customer.**

  * *Auth:* **Admin only.**
  * *Request:* JSON with any customer fields to update (name, email, phone).
  * *Response:* 200 OK with updated customer JSON, or 204 No Content. 404 if not found.
* **DELETE** `/customers/{id}` – **Delete a customer.**

  * *Auth:* **Admin only.**
  * *Response:* 204 No Content on success. 404 if customer not found.

**General Notes:** All requests and responses use JSON format. The backend will enforce **CORS** to allow the Vercel frontend domain to call these APIs (NestJS can enable CORS globally, so the browser can make cross-origin requests to the API). The Authorization token (JWT) must be included on **every** protected request as a `Bearer` token header. If a user without proper role tries to perform an admin action, the response will be **403 Forbidden** – the frontend should handle this gracefully (e.g. by showing an error or redirecting if appropriate).

## Frontend (React) Design

### Tech Stack & Architecture

The frontend is a **React** application written in **TypeScript**. We will use a standard single-page application (SPA) architecture with client-side routing (using **React Router** for navigation between views). The app will be bootstrapped with a Vite, and will be structured into reusable components.

Key aspects of the frontend tech stack:

* **React 18 with Hooks:** The app will utilize function components and React Hooks (e.g. `useState`, `useEffect`, `useContext`) for state management and lifecycle. This keeps the code simple and modern.
* **React Router:** Routing will handle public vs. private routes. For example, the login page is public, while all CRM pages (customer list, etc.) are protected routes requiring authentication.
* **State Management:** For a small app, we can rely on React Context and hook-based state. We will create an **Auth Context** to hold the current user’s authentication state (token and user info) globally. This avoids the need for a complex state library. The context provider will wrap the app, allowing any component to access `auth` info (e.g. to check role or login status).
* **UI Library & Styling:** We can use Tailwind CSS to speed up UI development. The emphasis is on clarity of structure for demonstration.

The app will be built and optimized for production (yielding static assets). Deployment to **Vercel** will leverage its zero-config support for React apps – we can connect the Git repo to Vercel and have it build the app. (Vercel doesn’t run a Docker container for the frontend in production, but we use Docker in development for parity. The static build output will be served by Vercel’s CDN.)

### User Interface & Components

We will implement a few simple pages and components to cover the required functionality:

1. **Login Page:** A standalone page (route like `/login`) with a login form (username and password fields and a submit button). On submit, it calls the backend `/auth/login` API. If login is successful, the app stores the token (and user info) and redirects to the main app (e.g. customer list page). If failed, it shows an error message. This page is accessible to all (no auth required) and will likely be the default landing if user is not yet authenticated.

2. **Customer List Page:** The main page of the app (e.g. route `/customers`). It displays a list of customers in a table format. On component load, it will call the GET `/customers` API to fetch data (including the JWT in the header). We’ll display basic fields like Name, Email, Phone in the table.

   * If the current user is an **Admin**, this page will additionally show action buttons for each customer (e.g. **Edit** and **Delete**), and perhaps a **“Add Customer”** button at the top. Clicking “Add” goes to the Customer Form page for a new entry. Edit will navigate to the form for the selected customer. Delete will prompt for confirmation then call the DELETE API.
   * If the current user is a **Viewer**, all modification controls will be hidden or disabled. The Viewer will see the list but with no option to add or edit. This conditional rendering implements the RBAC on the UI side (in addition to the backend enforcement). For example, we will only render the “Add” button if `authContext.role === 'admin'`, etc.

3. **Customer Form Page:** This page (route `/customers/new` for create, and `/customers/:id/edit` for edit) contains a form to add a new customer or update an existing one. Fields correspond to the customer data (name, email, phone).

   * For **Admin users**, this form is fully interactive. On submit, it will send a POST (for new) or PUT (for edit) request to the API. After a successful save, it may redirect back to the list page or show a success message.
   * For **Viewer users**, direct navigation to this page will be prevented (we’ll have route guards). Even if a Viewer somehow reaches the form route, the form can be rendered in read-only mode or simply show an “Unauthorized” message. (Typically, the route guard would redirect them away immediately.)

   We may reuse the same component for creating and editing (differentiating based on route or presence of an `id` param), to keep things simple.

4. **User Management Page:** This page (route `/users`) is **visible only to Admins**. It lists all user accounts and allows Admin to manage users. The list will show each user’s username and role. Admin can have controls to **add a new user** (bringing up a form to enter username, password, and role) and possibly to edit or delete existing users.

   * For adding a user, a small form can be included on this page (or a modal) that takes the new user’s info and calls POST `/users`.
   * To change a user’s role or password, we could either implement an inline edit or a separate edit screen. Given our simplicity goal, we might allow editing role directly in the list (e.g. a dropdown for role) or just remove the user and re-add. But a cleaner approach: a separate **Edit User** page or modal, where Admin can update the password or role via PUT `/users/{id}`.
   * Deleting a user (except the self-admin) can be done with a delete button calling DELETE `/users/{id}`. We will ensure not to allow self-deletion via UI as well (or at least warn against it) to avoid the scenario of no admins left.

   This page will be protected both in UI (only rendered for admins) and via backend (the API calls will return 403 if attempted with a non-admin token).

5. **Navigation & Layout:** The app will have a simple navigation bar or header that appears on authenticated pages. For example, a top bar with the app name (“Simple E-Commerce CRM”) and a menu/link to “Customers” and (if admin) “Users”. It may also show the current user’s username/role, and a **Logout** button. Clicking “Logout” will clear the auth state and redirect to the Login page. The presence of this navbar on internal pages provides a consistent way to navigate. The router will handle showing it only when a user is logged in.

All components will be implemented with testing in mind: e.g., functions for data fetching will be isolated to allow mocking, and components will be kept small and focused (list display, form, etc.). We will also handle loading states (show a loading indicator when data is being fetched) and error states (show an error message if an API call fails, such as network error or 403 Forbidden). This ensures a good UX and also provides points to verify in tests.

### State Management and Auth Handling

We will use a React Context (`AuthContext`) to track authentication state. This context will hold: the current user info (id, username, role) and the JWT token. When the user logs in successfully, we will set the context state with the user data and token. This context provides an `AuthProvider` component wrapping the app, and a hook `useAuth()` for child components to access auth state and actions.

**Token Storage:** The JWT token, once received, will be stored in the browser for reuse. A simple and effective approach is to store it in **localStorage** (e.g. under the key `"token"`). This allows the app to persist login between page refreshes. We are aware of security considerations (XSS risks with localStorage), but for this demo app, we prioritize simplicity. In a production scenario, one might use HTTP-only cookies or other storage for the token. We will document that localStorage is used for now to keep the implementation straightforward. On logout, this token is removed from localStorage.

**Private Routes:** Using React Router, we will create a component or use a pattern to protect certain routes. For example, a `<PrivateRoute>` component can check `authContext` – if no user is logged in (no token), it redirects to `/login`. Similarly, we may have an `<AdminRoute>` wrapper to ensure the user is admin for admin-only pages (e.g. user management). This check prevents unauthorized access to pages on the client side. Even if a malicious user bypasses this (e.g. by modifying client code), the backend still has final authority (JWT role check), but it’s good to provide proper UI/UX by not showing pages the user shouldn’t access.

**Role-Based UI Logic:** Throughout the UI, we’ll use the user’s role from context to conditionally render components. For instance:

* In the Customers list, if `authContext.user.role === 'admin'` we show the “Add Customer” button and edit/delete actions; if not, we omit them.
* In the navigation menu, we include the “User Management” link only if the user is admin.
* We might also display a label like “(Admin)” or “(Viewer)” next to the username in the header, so it’s clear what role is active.

This ensures the viewer experience is read-only. It aligns with the backend’s enforcement, providing a seamless restriction. (We will test that, for example, a Viewer doesn’t see admin controls, and an Admin does – these can be checked via unit/integration tests on components.)

### API Integration

The frontend communicates with the backend via the defined REST API. We will create a small API helper layer to centralize calls (for example, a module with functions like `api.login()`, `api.getCustomers()`, `api.createCustomer()` etc., which internally use `fetch` or an HTTP client library like **Axios** to make requests). This abstraction makes it easier to mock in tests and to handle concerns like headers in one place.

Important implementation points for API calls:

* **Base URL & Environment:** The API base URL (e.g. `http://localhost:3000` for dev, or the Zeabur app domain for production) will be configurable. We can use an environment variable (for example, in a CRA app, `REACT_APP_API_URL`) to set the base URL. When deployed to Vercel, we’ll set this env variable to the production API endpoint. In development, it might be `http://localhost:3000` if running backend locally.
* **Auth Header:** For any request after login, we must include the JWT. The API helper will retrieve the token (from `AuthContext` or localStorage) and add an `Authorization: Bearer <token>` header to the request. This ensures the backend can authenticate the user. We will also set `Content-Type: application/json` on requests with a body.
* **Error Handling:** We will globally handle certain HTTP responses. For example, a **401 Unauthorized** or **403 Forbidden** from any API call can trigger a function that logs the user out or at least displays a message. If the token expired or is invalid, the backend would return 401, so the frontend should remove the bad token and force a fresh login. For simplicity, we might treat 401/403 similarly – e.g., show an alert “Access denied or session expired, please log in” and redirect to login page. This keeps the app robust if a Viewer somehow attempts an admin action (the result is a graceful redirect or message).
* **Data Handling:** On successful API calls, the data (e.g. list of customers or users) will be stored in component state to render in the UI. For example, the Customer List page will have a state `customers` that gets filled by `api.getCustomers()`. We might use React’s `useEffect` to call this on component mount. Similarly, form submissions will call the appropriate `api` method and then on success, navigate or update state.

We will also ensure to handle loading states (e.g. a loading spinner while waiting for data) and display any error messages from the API (for instance, if creating a user fails due to duplicate username, the backend might return 400 with a message – we’ll show that message to the Admin user in the form).

**CORS & Security:** Since the backend is on a different domain (Zeabur) than the frontend (Vercel), we’ll rely on the backend’s CORS configuration to allow requests. We also ensure that the token is always sent over **HTTPS** (Vercel and Zeabur both provide HTTPS by default). The JWT contains the user role, but since it’s signed and base64-encoded, the client can decode it if needed to check role (though we avoid relying on that alone; we already have the role in context from login).

### Deployment (Frontend)

The React app will be deployed on **Vercel** for hosting. Vercel excels at hosting React/Next.js applications and provides CDN-backed static serving. Our deployment strategy is:

* Connect the Git repository to Vercel. On push to main (or a specific branch), Vercel will build the app (running `npm run build` or equivalent) and deploy the static files.
* We will configure environment variables in Vercel (such as `REACT_APP_API_URL` pointing to the backend API URL in production). The build will embed these so that the frontend knows where to send API requests.
* After build, Vercel will provide a deployment URL (and we can set up a custom domain if needed). We will ensure the backend’s CORS allows this domain.

While the frontend is primarily static (HTML/CSS/JS), if we needed any server-side rendering or API routes, Vercel could handle those too. In our case, it’s not necessary. We also provide a Dockerfile for the frontend (for local development or if we wanted to containerize the build step), but Vercel doesn’t run that container in production – it’s used only for ensuring consistent local builds. The end result is a fast, globally distributed front-end app.

**Post-Deployment Testing:** Once deployed, we can run our E2E test suite against the deployed URLs to verify everything works on the live environment. This ensures that our Docker-based dev environment and the cloud environment behave the same.