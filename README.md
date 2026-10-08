# Linea — Real-Time Messaging Application

**Linea** is a full-stack real-time messaging web application developed using the MERN stack and Socket.IO. The platform enables users to communicate through private conversations and group channels, manage their profiles, and share files through a responsive and interactive interface.

The application demonstrates real-time communication, secure authentication, database management, RESTful API development, and full-stack deployment.

### Live Application

**[Live Demo](https://linea-dep.onrender.com)** | **[GitHub Repository](https://github.com/SadikRahman14/Linea_Dep)**

> **Note:** The application is hosted on Render's free tier. The server may take approximately 50 seconds or more to respond after a period of inactivity.

---

## Features

### User Authentication
- User registration and login.
- JWT-based authentication using access and refresh tokens.
- HTTP-only cookies for authentication.
- Password hashing using bcrypt.
- Persistent login sessions.
- User logout functionality.

### Real-Time Messaging
- Instant one-to-one messaging using Socket.IO.
- Real-time communication between connected users.
- Persistent message history stored in MongoDB.
- Group conversations through dedicated channels.
- Message timestamps and conversation history.

### Channel Management
- Create group channels.
- Add multiple users to channels.
- View channel members.
- Communicate with channel participants in real time.
- Maintain separate conversation histories.

### User Management
- User profile creation and customization.
- Profile image uploads.
- Search for registered users.
- Manage personal information.
- Discover users and initiate conversations.

### File Sharing
- Upload and share images.
- Send file attachments in conversations.
- Preview supported image formats.
- Download shared files.

### User Interface
- Responsive design for different screen sizes.
- Modern interface built with React and Tailwind CSS.
- Interactive UI components.
- Client-side state management using Zustand.
- Notifications and animations.

---

## Technology Stack

| Category | Technologies |
|----------|-------------|
| Frontend | React 19, JavaScript, Vite |
| Styling | Tailwind CSS, Radix UI |
| State Management | Zustand |
| HTTP Client | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Real-Time Communication | Socket.IO |
| Authentication | JWT, bcryptjs, HTTP-only Cookies |
| File Handling | Multer |
| Deployment | Render |
| Version Control | Git, GitHub |

---

## System Architecture

Linea follows a client-server architecture that combines RESTful APIs for standard application operations with Socket.IO for real-time communication.

```text
                    CLIENT
              React + Vite Frontend
                       |
           +-----------+-----------+
           |                       |
       REST API                 Socket.IO
           |                       |
           +-----------+-----------+
                       |
                  BACKEND
               Node.js + Express
                       |
                    Mongoose
                       |
                 MongoDB Atlas
                       |
               Persistent Storage
```

### Frontend
The React application handles user interactions, authentication flows, messaging interfaces, state management, and real-time updates.

### Backend
The Express server provides RESTful APIs for authentication, profiles, contacts, messages, and channels. It also manages Socket.IO connections for real-time message delivery.

### Database
MongoDB Atlas stores user information, conversations, messages, channels, and related application data.

### Real-Time Communication
Socket.IO establishes bidirectional connections between clients and the backend, allowing messages to be delivered without refreshing the page.

---

## Project Structure

```text
Linea/
|
|-- client/
|   |-- src/
|   |   |-- assets/
|   |   |-- components/
|   |   |-- context/
|   |   |-- lib/
|   |   |-- pages/
|   |   |-- store/
|   |   |-- utils/
|   |
|   |-- .env.example
|   |-- package.json
|   |-- vite.config.js
|
|-- server/
|   |-- db/
|   |-- src/
|   |   |-- controllers/
|   |   |-- middlewares/
|   |   |-- models/
|   |   |-- routes/
|   |   |-- utils/
|   |
|   |-- index.js
|   |-- socket.js
|   |-- .env.example
|   |-- package.json
|
|-- .gitignore
|-- .node-version
|-- README.md
```

---

## Getting Started

Follow these instructions to run Linea locally.

### Prerequisites

Make sure the following are installed:

- Node.js 22.x
- npm
- Git
- MongoDB Atlas account or a compatible MongoDB instance

### 1. Clone the Repository

```bash
git clone https://github.com/SadikRahman14/Linea_Dep.git
cd Linea_Dep
```

### 2. Install Dependencies

Install the frontend dependencies:

```bash
npm ci --prefix client
```

Install the backend dependencies:

```bash
npm ci --prefix server
```

### 3. Configure Environment Variables

Create a `.env` file inside the `client` directory.

**client/.env**

```env
VITE_SERVER_URL=http://localhost:3001
```

Create another `.env` file inside the `server` directory.

**server/.env**

```env
PORT=3001
NODE_ENV=development
ORIGIN=http://localhost:5173

DATABASE_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=15m

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d
```

Replace the placeholders with your own configuration.

**Important:** Never commit `.env` files, database credentials, or JWT secrets to a public repository.

### 4. Start the Backend

From the project root:

```bash
npm run dev --prefix server
```

The backend will run at:

```text
http://localhost:3001
```

### 5. Start the Frontend

Open another terminal and run:

```bash
npm run dev --prefix client
```

The frontend will be available at:

```text
http://localhost:5173
```

### 6. Verify the Backend

Open the following URL:

```text
http://localhost:3001/health
```

Expected response:

```json
{
  "status": "ok"
}
```

---

## Deployment

Linea is deployed on **Render**, while MongoDB Atlas provides the managed database.

The production application uses a single-origin deployment where Express serves the compiled React frontend alongside the backend APIs and Socket.IO server.

### Hosting Configuration

| Configuration | Value |
|---------------|-------|
| Platform | Render |
| Service Type | Web Service |
| Runtime | Node.js |
| Node Version | 22.22.0 |
| Branch | main |
| Root Directory | Repository Root |
| Hosting Plan | Free |

### Build Command

```bash
npm ci --include=dev --prefix client && npm run build --prefix client && npm ci --omit=dev --prefix server
```

### Start Command

```bash
npm start --prefix server
```

### Production Environment Variables

The following variables are configured through the Render dashboard:

```env
DATABASE_URI=your_mongodb_connection_string
NODE_ENV=production

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=15m

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d
```

Render automatically provides the server port through the `PORT` environment variable.

**Live Application:** https://linea-dep.onrender.com

---

## Security Considerations

The application incorporates several security practices:

- Password hashing using bcrypt.
- JWT-based user authentication.
- HTTP-only authentication cookies.
- Secure cookie configuration in production.
- Access and refresh token handling.
- Authentication checks for Socket.IO connections.
- Environment-based configuration for sensitive credentials.
- Dependency security auditing and updates.

The frontend and backend production dependency audits reported zero known vulnerabilities at the time of the latest security update.

Security improvements remain an ongoing part of development.

---

## Known Limitations

### Free-Tier Hosting

Linea is hosted on Render's free tier.

The backend automatically spins down after inactivity, which can cause a delay when the application receives its next request.

### Temporary File Storage

Uploaded profile images and message attachments are currently stored in the server's local filesystem.

Because Render's free hosting environment uses ephemeral storage, uploaded files may be lost when the service restarts or redeploys.

Persistent cloud storage is planned as a future enhancement.

### File Privacy

Uploaded files are currently served without file-level access restrictions. Users should avoid uploading private or sensitive attachments.

### Performance

The application is designed as a portfolio project and is not configured for large-scale production traffic.

---

## Technical Highlights

### Real-Time Communication

Implemented event-driven communication using Socket.IO to support instant message exchange between connected clients.

### Authentication and Session Management

Implemented JWT-based authentication with access and refresh tokens, HTTP-only cookies, and protected backend endpoints.

### Database Modeling

Used MongoDB and Mongoose to manage user accounts, messages, channels, and relationships between application entities.

### RESTful API Development

Developed Express-based API endpoints for authentication, user profiles, contacts, messaging, and channel operations.

### State Management

Used Zustand to manage shared application state and coordinate updates across frontend components.

### Full-Stack Deployment

Deployed the React frontend and Express backend together on Render, using MongoDB Atlas for persistent database storage.

### Dependency Maintenance

Reviewed package vulnerabilities, updated affected dependencies, and verified the production build after the updates.

---

## Future Improvements

The following enhancements may be considered in future versions:

- [ ] Persistent cloud storage for file attachments.
- [ ] Authenticated access to private attachments.
- [ ] Message delivery and read receipts.
- [ ] Typing indicators.
- [ ] Online/offline presence indicators.
- [ ] Message editing and deletion.
- [ ] Message reactions.
- [ ] Improved conversation search.
- [ ] Automated unit and integration testing.
- [ ] End-to-end testing.
- [ ] Performance optimization and code splitting.
- [ ] Improved mobile responsiveness.

---

## Project Motivation

Linea was developed as a personal full-stack project to gain practical experience in building real-time web applications.

The primary goal was to explore how modern frontend technologies, backend APIs, WebSocket communication, and NoSQL databases can work together to support interactive, multi-user applications.

The project provided experience in:

- Designing and developing full-stack applications.
- Implementing real-time communication.
- Managing authentication and user sessions.
- Structuring RESTful APIs.
- Working with MongoDB and Mongoose.
- Managing frontend application state.
- Debugging and resolving integration issues.
- Maintaining dependency security.
- Deploying applications to cloud hosting platforms.

---

## License

This project is intended for educational and portfolio purposes. No open-source license has been specified.

---

## Project Links

- **Live Demo:** https://linea-dep.onrender.com
- **Source Code:** https://github.com/SadikRahman14/Linea_Dep

---

**Linea — A MERN Stack Real-Time Messaging Application**

Built to demonstrate full-stack development, real-time communication, and modern web application deployment.