# Echo

> Share moments that fade away

**Echo** is a modern ephemeral social media platform where content automatically expires after 24 hours. Unlike traditional social networks with permanent posts, Echo encourages authentic, in-the-moment sharing without the pressure of a permanent digital footprint.

## Features

### Core Social Features
- **Ephemeral Posts** - Posts automatically expire after 24 hours
- **Post Renewal** - Extend post lifetime up to 3 times (24 hours each)
- **Rich Media Support** - Upload up to 5 images/videos per post with automatic compression
- **Comments & Replies** - Nested comment system with threaded discussions
- **Follow System** - Follow users and curate your personalized feed
- **Trending Posts** - Discover popular content based on view counts
- **User Profiles** - Customizable profiles with bio, location, website, occupation

### Authentication & Security
- **Email Verification** - OTP-based email verification for new accounts
- **Secure Password Reset** - Token-based password recovery via email
- **JWT Authentication** - Secure token-based authentication
- **Profile Management** - Update profile information, profile pictures, and passwords
- **Account Deletion** - Complete account removal capability

### Anonymous Chat Rooms
- Browse and join anonymous public rooms across 7 categories
- Create temporary rooms with auto-expiration
- Category-based room filtering
- Real-time participant tracking

### Advanced Functionality
- **Batch View Tracking** - Optimized view counting for trending calculations
- **Media Processing** - Automatic compression for large files using FFmpeg
- **Cloud Storage** - Cloudinary integration for scalable media hosting
- **Real-time Notifications** - Toast notifications for all user actions
- **Responsive Design** - Optimized for desktop and mobile devices
- **Dark Mode UI** - Modern dark theme using Tailwind CSS

## Tech Stack

### Frontend
- **React 18.2** - UI library
- **Vite 6.3** - Fast build tool and dev server
- **React Router 6.20** - Client-side routing
- **Axios 1.9** - HTTP client with interceptors
- **Tailwind CSS 3.3** - Utility-first CSS framework
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notification system
- **date-fns** - Date manipulation and formatting

### Backend
- **Express 5.1** - Web framework
- **MongoDB 6.16** - NoSQL database
- **Mongoose 8.13** - MongoDB ODM with schema validation
- **JWT (jsonwebtoken)** - Token-based authentication
- **Bcrypt 5.1** - Password hashing
- **Cloudinary** - Cloud media storage and processing
- **Sharp 0.34** - Image processing
- **FFmpeg 2.1** - Video compression
- **Brevo (getbrevo)** - Email service provider
- **Multer** - File upload middleware
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Express Rate Limit** - API rate limiting
- **Morgan** - HTTP request logging
- **Node Cron** - Scheduled tasks

## Project Structure

```
echo/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── UI/          # General components (PostForm, PostItem, etc.)
│   │   │   ├── chat/        # Chat-related components
│   │   │   ├── layout/      # Layout components (Header, Layout)
│   │   │   ├── profile/     # Profile components
│   │   │   └── rooms/       # Anonymous room components
│   │   ├── context/         # React Context providers
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utility functions
│   │   ├── data/            # Mock/static data
│   │   └── App.jsx          # Root component
│   └── package.json
│
├── server/                    # Backend Express application
│   ├── controllers/          # Request handlers
│   ├── models/              # Database schemas
│   ├── routes/              # API routes
│   ├── middlewares/         # Express middleware
│   ├── utils/               # Helper functions
│   │   ├── email/          # Email templates and sending
│   │   ├── media/          # Media processing utilities
│   │   ├── http/           # Response formatting
│   │   └── post/           # Post-specific utilities
│   ├── app.js               # Express app configuration
│   ├── server.js            # Server entry point
│   └── package.json
│
└── README.md
```

## Prerequisites

- **Node.js** v16 or higher
- **MongoDB** database (local or MongoDB Atlas)
- **Cloudinary** account for media storage
- **Brevo** (formerly Sendinblue) account for email service

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/DanielFleshler/social-netwrok.git
cd echo
```

### 2. Install dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Configure environment variables

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Database (MongoDB)
DATABASE=mongodb+srv://username:<PASSWORD>@cluster.mongodb.net/?retryWrites=true
DATABASE_PASSWORD=your_mongodb_password

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

# Email Service (Brevo)
BREVO_API_KEY=your_brevo_api_key

# Frontend URL (for CORS and email links)
FRONTEND_URL=http://localhost:5173

# Media Service (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### 4. Get API Keys

**MongoDB Atlas:**
1. Create account at [mongodb.com](https://www.mongodb.com/cloud/atlas)
2. Create cluster and get connection string
3. Replace `<PASSWORD>` with your database password

**Cloudinary:**
1. Sign up at [cloudinary.com](https://cloudinary.com/)
2. Get Cloud Name, API Key, and API Secret from dashboard

**Brevo (Email Service):**
1. Sign up at [brevo.com](https://www.brevo.com/)
2. Generate API key in account settings

## Running the Application

### Development Mode

**Terminal 1 - Start the backend:**
```bash
cd server
npm start
```
Server runs on `http://localhost:8000`

**Terminal 2 - Start the frontend:**
```bash
cd client
npm run dev
```
Client runs on `http://localhost:5173`

### Production Build

```bash
# Build the frontend
cd client
npm run build

# The built files will be in client/dist/
# Serve with your preferred static file server
```

## API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication

All authenticated endpoints require:
- Bearer token in `Authorization` header: `Authorization: Bearer <token>`
- OR JWT cookie (set automatically on login)

Most endpoints also require email verification (`isVerified: true`)

### User Routes (`/users`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/signup` | No | Register new user |
| POST | `/login` | No | Login user |
| GET | `/logout` | No | Clear authentication cookie |
| POST | `/forgot-password` | No | Request password reset email |
| PATCH | `/reset-password/:token` | No | Reset password with token |
| POST | `/verify-otp/:userId` | No | Verify email with OTP code |
| POST | `/generate-otp/:userId` | No | Generate new OTP |
| POST | `/resend-otp/:userId` | No | Resend OTP email |
| GET | `/me` | Yes | Get current user profile |
| GET | `/:id` | Yes | Get user by ID |
| PATCH | `/me` | Yes | Update user profile |
| PATCH | `/update-password` | Yes | Change password |
| PATCH | `/update-profile-picture` | Yes | Upload profile picture |
| DELETE | `/delete-profile-picture` | Yes | Remove profile picture |

### Post Routes (`/posts`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Yes | Get all posts (paginated) |
| POST | `/` | Yes | Create new post |
| GET | `/trending` | Yes | Get trending posts |
| GET | `/user/:userId` | Yes | Get user's posts |
| GET | `/:id` | Yes | Get single post by ID |
| PATCH | `/:id` | Yes | Update post content/media |
| DELETE | `/:id` | Yes | Delete post |
| PATCH | `/:id/view` | Yes | Increment post view count |
| POST | `/batch-view` | Yes | Batch increment views |
| PATCH | `/:id/renew` | Yes | Renew post expiration (+24h) |
| POST | `/:id/comments` | Yes | Add comment to post |
| DELETE | `/:id/comments/:commentId` | Yes | Delete comment |
| POST | `/:id/comments/:commentId/replies` | Yes | Reply to comment |
| DELETE | `/:id/comments/:commentId/replies/:replyId` | Yes | Delete reply |

### Follower Routes (`/followers`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/feed` | Yes | Get feed from followed users |
| GET | `/:userId/stats` | Yes | Get follower statistics |
| GET | `/:userId` | Yes | Get user's followers |
| GET | `/:userId/following` | Yes | Get following list |
| POST | `/:userId` | Yes | Follow user |
| DELETE | `/:userId` | Yes | Unfollow user |

### Response Format

All API responses follow this structure:

**Success:**
```json
{
  "status": "success",
  "message": "Human-readable success message",
  "data": {
    // Response data
  }
}
```

**Error:**
```json
{
  "status": "error",
  "message": "Human-readable error message"
}
```

## Database Models

### User Schema
- `username` - Unique username (3-30 chars, alphanumeric + underscore/period)
- `email` - Unique email address
- `password` - Hashed password (bcrypt)
- `fullName` - User's full name (2-100 chars)
- `profilePicture` - Cloudinary URL
- `bio` - User biography (max 500 chars)
- `location` - Location string (max 100 chars)
- `website` - Personal website URL
- `birthday` - Date of birth
- `occupation` - Job title/occupation (max 100 chars)
- `isVerified` - Email verification status
- `otpCode` - Hashed OTP for verification (not returned in queries)
- `otpExpires` - OTP expiration timestamp
- `passwordResetToken` - Hashed reset token
- `passwordResetExpires` - Reset token expiration

### Post Schema
- `user` - Reference to User (author)
- `content` - Post text content (required)
- `media` - Array of media objects:
  - `url` - Cloudinary URL
  - `type` - "image" or "video"
  - `publicId` - Cloudinary public ID
- `views` - View count (default: 0)
- `comments` - Array of comment objects with nested replies
- `expiresAt` - Post expiration timestamp (default: +24h)
- `renewalCount` - Number of renewals (max: 3)
- `renewedAt` - Last renewal timestamp

**Virtual Properties:**
- `commentCount` - Total number of comments
- `isExpired` - Boolean expiration status
- `remainingTime` - Milliseconds until expiration
- `expirationProgress` - Percentage elapsed (0-100)

### Follower Schema
- `follower` - User who is following
- `following` - User being followed
- Composite unique index prevents duplicate follows
- Pre-save validation prevents self-following

## Architecture Overview

### Authentication Flow

1. **Registration**
   - User submits registration form
   - Server creates user with `isVerified: false`
   - Generate 6-digit OTP, hash and store
   - Send OTP via email using Brevo
   - Redirect to OTP verification page

2. **Email Verification**
   - User enters OTP code
   - Server validates OTP and expiration
   - Set `isVerified: true`
   - Generate JWT token
   - Login user

3. **Login**
   - Verify credentials (email/password)
   - Check `isVerified === true`
   - Generate JWT token (90-day expiration)
   - Set httpOnly cookie + return token
   - Client stores token in localStorage

4. **Protected Routes**
   - Extract JWT from Authorization header or cookie
   - Verify signature and expiration
   - Fetch current user from database
   - Check if password changed after token issued
   - Attach user to `req.user`

### Media Upload Pipeline

1. Client selects images/videos (max 5, max 200MB each)
2. Multer middleware receives files
3. Files >100MB automatically compressed with FFmpeg
4. Upload to Cloudinary cloud storage
5. Store Cloudinary URLs + public IDs in database
6. Delete temporary local files
7. On post deletion, purge media from Cloudinary

### Post Expiration System

- **Default Expiration:** 24 hours from creation
- **Automatic Filtering:** Database query middleware excludes expired posts
- **Renewal System:** Users can renew up to 3 times (adds 24h each)
- **Virtual Properties:** Real-time calculation of time remaining and progress
- **Manual Override:** Optional `includeExpired` flag to show expired content

### State Management

The application uses React Context API for global state:

- **AuthContext** - User authentication state and methods
- **PostContext** - Post operations and feed data
- **ToastContext** - Notification system
- **FollowerContext** - Follow/follower relationships
- **ViewTrackingContext** - Optimized view tracking
- **AppProviders** - Combines all contexts

## Key Features in Detail

### Ephemeral Posts with Renewal

Posts automatically expire 24 hours after creation. The expiration system includes:
- Database-level filtering (expired posts excluded from queries)
- Virtual properties for real-time calculations
- Renewal capability (up to 3 times per post)
- Visual progress bars showing time remaining
- Graceful handling of expired content

### Media Processing

Echo handles large media files efficiently:
- Client-side validation (file type, size, count)
- Server-side compression for videos >100MB
- FFmpeg integration for high-quality compression
- Cloudinary CDN for fast delivery
- Automatic cleanup of temporary files
- Deletion cascade (removing post deletes media)

### Anonymous Chat Rooms

Infrastructure for anonymous discussions:
- 7 predefined categories (Support, Professional, Creative, etc.)
- Official rooms vs. user-created rooms
- Automatic expiration and reset intervals
- Participant tracking
- Mock data implemented (backend integration ready)

### Email System

Brevo integration for transactional emails:
- OTP verification emails with custom templates
- Password reset emails with secure links
- HTML email templates with branding
- Graceful fallback on email failure
- Resend capability for OTPs

### Security Features

- Password hashing with bcrypt (cost factor: 12)
- JWT with 90-day expiration
- Sensitive fields excluded from queries
- HTTP-only cookies prevent XSS
- Password reset tokens hashed with SHA-256
- OTP codes hashed before storage
- CORS restricted to frontend URL
- Helmet.js security headers
- Rate limiting on authentication endpoints
- Email verification requirement for actions
---

**Echo** - Share moments that fade away
