[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19852021&assignment_repo_type=AssignmentRepo)
# MERN Blog Application

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) blog application with user authentication, CRUD operations, image uploads, comments, and advanced features.

## 🚀 Features

### Core Features
- **User Authentication**: Registration, login, logout with JWT
- **Blog Posts**: Create, read, update, delete posts with rich content
- **Categories**: Organize posts by categories
- **Comments**: Add comments to posts (authenticated users only)
- **Image Upload**: Featured images for blog posts
- **Search & Filter**: Search posts by title/content, filter by category
- **Pagination**: Navigate through posts with pagination
- **Responsive Design**: Modern UI that works on all devices

### Advanced Features
- **Protected Routes**: Secure access to create/edit posts and profile
- **Form Validation**: Client and server-side validation
- **Error Handling**: Comprehensive error handling with user feedback
- **Optimistic Updates**: Smooth UI updates for better UX
- **Loading States**: Visual feedback during API calls

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **multer** - File uploads
- **cors** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **React Hook Form** - Form management
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

## 📁 Project Structure

```
week-4-mern-integration-assignment-gabrielmussafiri/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── main.jsx        # App entry point
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express backend
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   ├── uploads/            # Uploaded images
│   ├── package.json
│   └── server.js
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB installed and running
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd week-4-mern-integration-assignment-gabrielmussafiri
   ```

2. **Set up environment variables**
   ```bash
   # Server environment
   cd server
   cp env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   
   # Client environment
   cd ../client
   cp env.example .env
   # Edit .env with your API URL
   ```

3. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

4. **Start the development servers**
   ```bash
   # Start server (from server directory)
   npm run dev
   
   # Start client (from client directory, in new terminal)
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST /api/auth/login
Login user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET /api/auth/me
Get current user (requires authentication)

### Posts Endpoints

#### GET /api/posts
Get all posts with pagination and filtering
- Query parameters:
  - `page`: Page number (default: 1)
  - `limit`: Posts per page (default: 10)
  - `category`: Filter by category ID
  - `search`: Search in title and content

#### GET /api/posts/:id
Get a specific post by ID

#### POST /api/posts
Create a new post (requires authentication)
```json
{
  "title": "Post Title",
  "content": "Post content...",
  "category": "categoryId",
  "featuredImage": "file"
}
```

#### PUT /api/posts/:id
Update a post (requires authentication, author or admin only)

#### DELETE /api/posts/:id
Delete a post (requires authentication, author or admin only)

#### POST /api/posts/:id/comments
Add a comment to a post (requires authentication)
```json
{
  "content": "Comment text"
}
```

### Categories Endpoints

#### GET /api/categories
Get all categories

#### POST /api/categories
Create a new category (requires admin authentication)
```json
{
  "name": "Category Name",
  "description": "Category description"
}
```

## 🎯 Features Implemented

### ✅ Task 1: Project Setup
- [x] Clear directory structure for client and server
- [x] MongoDB connection with Mongoose
- [x] Express.js server with middleware
- [x] React frontend with Vite and proxy
- [x] Environment variables configuration

### ✅ Task 2: Backend Development
- [x] RESTful API with all required endpoints
- [x] Mongoose models for Post and Category
- [x] Input validation with express-validator
- [x] Error handling middleware

### ✅ Task 3: Frontend Development
- [x] React components for all views
- [x] React Router navigation
- [x] React hooks for state management
- [x] Custom API service

### ✅ Task 4: Integration and Data Flow
- [x] API service implementation
- [x] State management with contexts
- [x] Form validation
- [x] Optimistic UI updates
- [x] Loading and error states

### ✅ Task 5: Advanced Features
- [x] User authentication
- [x] Image uploads
- [x] Pagination
- [x] Search and filtering
- [x] Comments feature

## 🖼️ Screenshots

*[Screenshots would be added here showing the application in action]*

## 🔧 Development

### Available Scripts

**Server:**
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

**Client:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Environment Variables

**Server (.env):**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern-blog
JWT_SECRET=your-secret-key
JWT_EXPIRE=30d
NODE_ENV=development
```

**Client (.env):**
```
VITE_API_URL=http://localhost:5000/api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of a MERN stack integration assignment.

## 👨‍💻 Author

Gabriel Mussafiri - MERN Stack Developer 