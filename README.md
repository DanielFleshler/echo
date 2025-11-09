<div align="center">

# 🌟 Echo

### Share moments that fade away

**A full-stack ephemeral social media platform built with the MERN stack**

</div>

---

## 📖 Project Overview

Echo is a modern social media platform where authenticity meets ephemerality. Built as a portfolio project to demonstrate full-stack development capabilities, Echo challenges the permanence of traditional social networks by giving users control over when their content disappears—with customizable expiration times ranging from hours to days.

**Why Echo?** In an age where everything online lasts forever, Echo provides a refreshing space for genuine, in-the-moment sharing without the pressure of maintaining a perfect permanent profile.

### 🎯 Key Accomplishments

- 🏗️ **Full-Stack Architecture** - Designed and implemented complete MERN stack application from scratch
- 🔐 **Secure Authentication** - Built comprehensive auth system with JWT, refresh tokens, and email verification
- 📱 **Real-Time Features** - Implemented batch view tracking, polling-based notifications, and optimized data synchronization
- 🎨 **Modern UI/UX** - Created responsive, accessible interface with Tailwind CSS and dark mode
- ☁️ **Cloud Integration** - Integrated Cloudinary for scalable media storage and FFmpeg for video compression
- 🚀 **Performance Optimization** - Implemented pagination, lazy loading, debouncing, and efficient state management
- 🧪 **Production-Ready** - Built with error handling, security best practices, and scalable architecture

---

## ✨ Features Showcase

<table>
<tr>
<td width="50%">

### 🕐 Ephemeral Content System

Users choose custom expiration times for their posts (hours to days), encouraging authentic sharing. Posts can be renewed up to 3 times, with real-time countdown indicators showing remaining time.

**Technical Implementation:**

- MongoDB TTL indexes for automatic cleanup
- Virtual properties for dynamic calculations
- Cron jobs for scheduled tasks

</td>
<td width="50%">

<img width="625" height="233" alt="Image" src="https://github.com/user-attachments/assets/61b1ec38-42f5-40ca-a5d8-2393564e3ba9" />

</td>
</tr>

<tr>
<td width="50%">

<img width="1487" height="833" alt="Image" src="https://github.com/user-attachments/assets/434471a5-ce1b-4833-ac96-d722852eb33c" />

</td>
<td width="50%">

### 👤 Rich User Profiles

Comprehensive profile system with customizable bio, location, occupation, website, and profile pictures.

**Technical Implementation:**

- Cloudinary integration for image hosting
- Sharp for server-side image optimization
- Real-time profile updates with React Context

</td>
</tr>

<tr>
<td width="50%">

### 🎬 Advanced Media Handling

Upload up to 5 images/videos per post with intelligent compression and cloud storage.

**Technical Implementation:**

- Multer for file uploads
- FFmpeg for video compression (100MB+ files)
- Cloudinary CDN for fast delivery
- Automatic cleanup on deletion

</td>
<td width="50%">

<img width="604" height="344" alt="Image" src="https://github.com/user-attachments/assets/cc803602-fff8-4f94-abac-d2a49bb0da35" />

</td>
</tr>

<tr>
<td width="50%">

<img width="599" height="1087" alt="Image" src="https://github.com/user-attachments/assets/079b46c0-f94e-4456-ab61-f2314d07883e" />

</td>
<td width="50%">

### 💬 Nested Comment System

Threaded discussions with comment replies, real-time updates, and author controls.

**Technical Implementation:**

- Nested data structure in MongoDB
- Optimistic UI updates
- Comment deletion cascade

</td>
</tr>

<tr>
<td width="50%">

### 🔒 Secure Authentication Flow

Complete auth system with email verification, password reset, and JWT refresh tokens.

**Technical Implementation:**

- OTP-based email verification via Brevo
- Bcrypt password hashing
- JWT with refresh token rotation
- Custom email templates

</td>
<td width="50%">

<img width="727" height="833" alt="Image" src="https://github.com/user-attachments/assets/96fdef0a-c30e-47db-a801-a2368e626590" />

</td>
</tr>

<tr>
<td width="50%">

<img width="287" height="662" alt="Image" src="https://github.com/user-attachments/assets/6ec6a294-312f-4152-8a77-bde1bd36057b" />

</td>
<td width="50%">

### 📊 Trending Algorithm

Discover popular content with intelligent view tracking and trending calculations.

**Technical Implementation:**

- Batch view tracking (5 views per API call)
- Race condition prevention with useRef
- Author view exclusion
- 48-hour trending window

</td>
</tr>

<tr>
<td width="50%">


</table>
## 🛠️ Technical Stack

<div align="center">

### Frontend

![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-6.20-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.9-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

### Backend

![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.1-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-6.16-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-8.13-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)

### DevOps & Tools

![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![FFmpeg](https://img.shields.io/badge/FFmpeg-Compression-007808?style=for-the-badge&logo=ffmpeg&logoColor=white)
![Brevo](https://img.shields.io/badge/Brevo-Email-0B996E?style=for-the-badge)

</div>

---

## 🏗️ System Architecture


### Key Architectural Decisions

#### **1. Context API for State Management**

Chose React Context over Redux for lightweight, built-in state management across 5 contexts:

- AuthContext - User session and authentication
- PostContext - Feed data and CRUD operations
- ViewTrackingContext - Optimized view counting
- ToastContext - Global notifications
- FollowerContext - Social connections

#### **2. JWT + Refresh Token Pattern**

Implemented secure token refresh mechanism:

```javascript
// Automatic token refresh on 401 errors
// Excludes auth endpoints from refresh loop
// Graceful session expiration handling
```

#### **3. Batch Processing for Performance**

Optimized view tracking with batching:

- Collects 5 views before API call
- 3-second timeout fallback
- Race condition prevention using refs
- Excludes author views for accurate analytics

#### **4. Media Processing Pipeline**

Scalable approach to handling large files:

```
Client Upload → Multer → FFmpeg (>100MB) → Cloudinary → Database
```

#### **5. Polling for Notifications**

Chose polling over WebSockets for notification delivery:

- **Simplicity** - Easier to implement and maintain
- **Reliability** - No connection state management
- **Scalability** - Stateless architecture, easier to scale horizontally
- **Acceptable Latency** - 30-second updates sufficient for notifications
- **Future-Ready** - Easy migration path to WebSockets if needed

```javascript
// Background polling with cleanup
useEffect(() => {
  fetchUnreadCount();
  const interval = setInterval(fetchUnreadCount, 30000);
  return () => clearInterval(interval);
}, []);
```

---

## 💡 Technical Challenges & Solutions

### Challenge 1: Preventing Infinite Loops in View Tracking

**Problem:** Including `pendingViews` in useCallback dependencies caused infinite re-creation loops.

**Solution:**

```javascript
// Used useRef pattern to break circular dependency
const processBatchRef = useRef(null);
const trackView = useCallback(() => {
	processBatchRef.current?.(); // Call through ref
}, [batchSizeThreshold]); // Stable dependencies
```

**Result:** Stable, performant view tracking with proper batching.

---

### Challenge 2: Memory Leaks in Async Operations

**Problem:** State updates after component unmount caused memory leaks.

**Solution:**

```javascript
useEffect(() => {
	let isMounted = true;

	fetchData().then((data) => {
		if (isMounted) setState(data); // Only update if mounted
	});

	return () => {
		isMounted = false;
	}; // Cleanup
}, []);
```

**Result:** Clean component lifecycle management without memory leaks.

---

### Challenge 3: Token Refresh Catching Login Errors

**Problem:** Response interceptor caught ALL 401s, including failed login attempts.

**Solution:**

```javascript
// Exclude auth endpoints from refresh logic
const isAuthEndpoint = url.includes('/login') ||
                       url.includes('/signup') || ...;

if (is401 && !isAuthEndpoint) {
    // Only refresh for protected routes
}
```

**Result:** Proper error handling for auth vs. expired sessions.

---

### Challenge 4: Author Views Inflating Post Metrics

**Problem:** Post creators' views were counted, skewing analytics.

**Solution:**

```javascript
// Frontend: Don't track if user is author
if (!hasTrackedView && !post.expired && !isOwnPost) {
	trackView(post._id);
}

// Backend: Exclude author from batch updates
Post.updateMany(
	{
		_id: { $in: postIds },
		user: { $ne: req.user._id }, // Exclude own posts
	},
	{ $inc: { views: 1 } }
);
```

**Result:** Accurate view counts and trending algorithm.

---

### Challenge 5: Preventing Memory Leaks in Debounced Search

**Problem:** Debouncing with setTimeout created potential for state updates after unmount and redundant API calls.

**Solution:**

```javascript
useEffect(() => {
  if (searchQuery.length < 2) {
    setSearchResults([]);
    return;
  }

  setSearching(true);
  const timer = setTimeout(async () => {
    try {
      const response = await api.get(`/users/search?q=${searchQuery}`);
      setSearchResults(response.data.data.users);
    } finally {
      setSearching(false);
    }
  }, 300);

  return () => clearTimeout(timer); // Cleanup on every re-render
}, [searchQuery]);
```

**Result:** Efficient search-as-you-type with proper cleanup and no memory leaks.

---

### Challenge 6: Notification Creation Timing Bug

**Problem:** Creating notifications before saving comments resulted in attempting to access non-existent comment IDs.

**Solution:**

```javascript
// WRONG: Creating notification before save
await Notification.create({ comment: newComment._id }); // ID doesn't exist yet!
await post.save();

// CORRECT: Create notification AFTER save
await post.save();
const savedComment = post.comments[post.comments.length - 1];
await Notification.create({ comment: savedComment._id }); // ID exists
```

**Result:** Reliable notification creation with proper data integrity.

## 🎨 Design System

### Color Palette

```css
Primary:   #9333ea (Purple-600)
Secondary: #3b82f6 (Blue-500)
Background: #030712 (Gray-950)
Surface:   #111827 (Gray-900)
Text:      #f3f4f6 (Gray-100)
```

### Typography

- **Headings:** System fonts (San Francisco, Segoe UI, Arial)
- **Body:** 16px base, 1.6 line-height
- **Monospace:** Courier New (for OTP codes)

### Components

- Consistent button styles with gradient hover effects
- Card-based layouts with subtle shadows
- Toast notifications for user feedback
- Loading states with skeletons

---

## 🚀 Getting Started

### Prerequisites

- Node.js v16+
- MongoDB database
- Cloudinary account
- Brevo (email service) account

### Environment Variables

Create `server/.env`:

```env
PORT=8000
NODE_ENV=development
DATABASE=mongodb+srv://...
DATABASE_PASSWORD=...
JWT_SECRET=...
JWT_EXPIRES_IN=90d
REFRESH_TOKEN_EXPIRES_IN=7
BREVO_API_KEY=...
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

---

## 📊 Project Statistics

<div align="center">

| Metric            | Value                |
| ----------------- | -------------------- |
| Lines of Code     | ~16,000+             |
| Components        | 35+ React components |
| API Endpoints     | 30+ RESTful routes   |
| Database Models   | 4 main schemas       |
| Context Providers | 5 contexts           |
| Development Time  | 2-3 months           |

</div>

---

## 🔮 Future Enhancements

### Planned Features

- [ ] **Real-time Messaging** - WebSocket-based DM system
- [ ] **Advanced Search** - Full-text search for posts and comments with filters
- [ ] **Browser Push Notifications** - Service worker for background notifications
- [ ] **Anonymous Chat Rooms** - Complete backend integration
- [ ] **WebSocket Notifications** - Upgrade from polling to real-time WebSocket connection

## 📂 Project Structure

```
echo/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── UI/          # PostItem, PostForm, SearchModal, etc.
│   │   │   │   ├── NotificationsDropdown.jsx
│   │   │   │   ├── DeleteAccountModal.jsx
│   │   │   │   └── SearchModal.jsx
│   │   │   ├── layout/      # Header, Layout, ProtectedRoute
│   │   │   └── profile/     # Profile components
│   │   ├── context/         # React Context providers
│   │   │   ├── AuthContext.jsx
│   │   │   ├── PostContext.jsx
│   │   │   ├── ViewTrackingContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── pages/           # Route pages
│   │   ├── services/        # API integration layer
│   │   │   ├── api.js
│   │   │   └── user.service.js
│   │   ├── hooks/           # Custom React hooks
│   │   └── utils/           # Helper functions
│   └── package.json
│
└── server/                   # Backend Express application
    ├── controllers/         # Business logic
    │   ├── authController.js
    │   ├── postController.js
    │   ├── userController.js
    │   ├── followerController.js
    │   ├── notificationController.js
    │   └── searchController.js
    ├── models/             # Mongoose schemas
    │   ├── userModel.js
    │   ├── postModel.js
    │   ├── followerModel.js
    │   └── notificationModel.js
    ├── routes/             # API routes
    │   ├── userRoutes.js
    │   ├── postRoutes.js
    │   ├── followerRoutes.js
    │   └── notificationRoutes.js
    ├── middlewares/        # Custom middleware
    │   ├── auth.js
    │   └── upload.js
    ├── utils/              # Helper functions
    │   ├── email/         # Email templates
    │   └── media/         # Media processing
    └── package.json
```

---

## 🧪 Testing & Quality Assurance

### Manual Testing Performed

- ✅ Authentication flows (signup, login, OTP, password reset)
- ✅ Post CRUD operations (create, edit, delete, renew)
- ✅ Comment system (add, reply, delete, edit)
- ✅ Follow/unfollow functionality
- ✅ Media upload with compression
- ✅ View tracking and trending algorithm
- ✅ User search with debouncing
- ✅ Notification system (follow, comment, reply)
- ✅ Account deletion with password verification
- ✅ Responsive design on multiple devices
- ✅ Error handling and edge cases

### Code Quality

- ESLint configuration for code consistency
- React best practices (hooks, context, memo)
- RESTful API design principles
- Secure password handling (bcrypt)
- Input validation on client and server
- SQL injection prevention (Mongoose)
- XSS protection (sanitization)

---

## 🔒 Security Features

- **Password Security:** Bcrypt hashing with cost factor 12
- **Token Management:** JWT with 90-day expiration + refresh tokens
- **Email Verification:** OTP-based account verification
- **Secure Password Reset:** SHA-256 hashed tokens with expiration
- **CORS Protection:** Restricted to frontend domain
- **HTTP Security:** Helmet.js security headers
- **Rate Limiting:** Protection against brute force attacks
- **Sensitive Data:** Excluded from API responses (`select: false`)
- **HttpOnly Cookies:** XSS protection for tokens

---

## 📸 Additional Screenshots

<details>
<summary>Click to view more screenshots</summary>

### Signup & Verification Flow

![Screenshot Placeholder](https://via.placeholder.com/800x500/1a1a2e/16213e?text=Signup+Page)
![Screenshot Placeholder](https://via.placeholder.com/800x500/1a1a2e/16213e?text=Email+Verification)

### Post Creation & Management

![Screenshot Placeholder](https://via.placeholder.com/800x500/1a1a2e/16213e?text=Create+Post+Modal)
![Screenshot Placeholder](https://via.placeholder.com/800x500/1a1a2e/16213e?text=Edit+Post)

### User Interactions

![Screenshot Placeholder](https://via.placeholder.com/800x500/1a1a2e/16213e?text=Followers+Modal)
![Screenshot Placeholder](https://via.placeholder.com/800x500/1a1a2e/16213e?text=User+Feed)

### Email Templates

![Screenshot Placeholder](https://via.placeholder.com/600x400/1a1a2e/16213e?text=OTP+Email+Template)
![Screenshot Placeholder](https://via.placeholder.com/600x400/1a1a2e/16213e?text=Password+Reset+Email)

</details>

---

## 💼 Skills Demonstrated

### Frontend Development

- React 18 with Hooks (useState, useEffect, useCallback, useMemo, useRef)
- Context API for global state management
- Custom hooks for code reusability
- React Router for navigation
- Axios interceptors for API handling
- Responsive design with Tailwind CSS
- Form validation and error handling
- Optimistic UI updates
- Debouncing and performance optimization
- Polling architecture with cleanup patterns
- Modal components with controlled state

### Backend Development

- RESTful API design
- Express.js server architecture
- MongoDB database design with indexes
- Mongoose ODM with schemas, middleware, and virtual properties
- JWT authentication and authorization
- File upload and processing
- Email service integration
- Cron jobs for scheduled tasks
- MongoDB regex search with optimization
- Conditional schema validation
- Password verification and secure deletion

### System Design

- Client-server architecture
- Database schema design
- API endpoint planning
- Authentication flow design
- Media processing pipeline
- State management strategy
- Error handling patterns

### Best Practices

- Clean code principles
- Component composition
- Separation of concerns
- DRY (Don't Repeat Yourself)
- Security best practices
- Performance optimization
- Git version control

---
