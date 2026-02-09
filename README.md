# Plumbing App - Role-Based Access Control System

A full-stack job management application for plumbing businesses with role-based access control (RBAC), built with React, Redux Toolkit, Node.js, Express, and MongoDB.

## Features

- **Role-Based Access Control**: Three user roles with distinct permissions
- **Job Management**: Create, assign, track, and manage plumbing jobs
- **Real-Time Notifications**: Contractors receive instant notifications for job assignments
- **Messaging System**: Job-specific communication between contractors and receptionists
- **Analytics Dashboard**: Comprehensive analytics for admins
- **Calendar View**: Visual calendar with job scheduling for receptionists
- **Responsive Design**: Mobile-friendly interface

## User Roles & Permissions

### 👤 Admin
- **Full System Access**
- Create, edit, and delete employees (including receptionists and contractors)
- View all jobs across the organization
- Access analytics dashboard with:
  - Job status breakdown
  - Assignment status breakdown
  - Contractor workload analysis
- Edit and delete any job
- View all system features

### 📋 Receptionist
- **Job Management & Scheduling**
- Create new plumbing jobs
- Assign jobs to contractors from dropdown list
- View ALL jobs in the system (not just their own)
- Access calendar view with job scheduling
- See job assignment status (pending/accepted/rejected)
- View rejection reasons from contractors
- Reassign rejected jobs to different contractors
- Receive and view messages from contractors
- Edit and delete ANY job in the system
- Cannot access employee management or analytics

### 🔧 Contractor
- **Job Acceptance & Communication**
- View pending job assignments via notifications
- Accept or reject assigned jobs (with optional rejection reason)
- View all accepted jobs in personal dashboard
- Send messages to receptionist about specific jobs
- Update status of jobs they're working on
- Cannot create jobs or access other users' information

## Tech Stack

### Frontend
- React 19.2.3
- Redux Toolkit (state management)
- React Router 6.30.3
- styled-components 6.3.8
- react-calendar 5.1.0
- react-toastify (notifications)
- axios (HTTP requests)
- moment (date formatting)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- bcrypt (password hashing)

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn package manager

### 1. Clone the Repository
```bash
cd plumbingapp
```

### 2. Install Dependencies

#### Root (Frontend)
```bash
npm install
```

#### Server (Backend)
```bash
cd server
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `server` directory:

```env
# MongoDB Connection
MONGO_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_LIFETIME=30d

# Server Port (optional)
PORT=5000
```

**Important**: Replace `your_mongodb_connection_string` with your actual MongoDB connection string and `your_jwt_secret_key_here` with a secure random string.

### 4. Start the Application

#### Start Backend Server (from server directory)
```bash
cd server
npm start
```
Server runs on `http://localhost:5000`

#### Start Frontend (from root directory)
```bash
npm start
```
Frontend runs on `http://localhost:3000`

## Creating Your First Admin User

Since only admins can create employees, you need to manually create the first admin user via MongoDB.

### Method 1: Register Normal User, Then Upgrade to Admin

1. **Register a new user** through the application UI at `/register`
   - This creates a user with `role: 'receptionist'` by default

2. **Connect to your MongoDB database** using MongoDB Compass, mongosh, or any MongoDB client

3. **Update the user's role** to admin:

```javascript
// Using mongosh
use plumbingapp  // or your database name

db.users.updateOne(
  { email: "admin@example.com" },  // Replace with your user's email
  { $set: { role: "admin" } }
)
```

4. **Log out and log back in** - the user now has full admin access

### Method 2: Direct Admin Creation via MongoDB

```javascript
// Insert admin user directly
db.users.insertOne({
  firstName: "Admin",
  email: "admin@example.com",
  password: "$2a$10$hashedPasswordHere",  // Use bcrypt to hash a password first
  lastName: "User",
  location: "Main Office",
  role: "admin"
})
```

**Note**: For Method 2, you'll need to hash the password using bcrypt before inserting.

## Creating Test Users

Once you have an admin account, you can create additional users through the **Manage Employees** page:

### Create a Receptionist
1. Log in as admin
2. Go to "Manage Employees" (admin only)
3. Click "Add New Employee"
4. Fill in:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `receptionist@example.com`
   - Password: `password123`
   - Role: `receptionist`
   - Location: `Main Office`
5. Click "Create Employee"

### Create a Contractor
1. Same process as receptionist
2. Set Role to `contractor`
3. Example:
   - First Name: `Mike`
   - Last Name: `Smith`
   - Email: `contractor@example.com`
   - Password: `password123`
   - Role: `contractor`

## Application Workflow

### 1. Receptionist Creates a Job
1. Log in as receptionist
2. Navigate to "Add Job"
3. Fill in job details:
   - Customer Name
   - Location
   - Date
   - Description
   - Assign to Contractor (from dropdown)
   - Job Type
   - Status
4. Click "Add Job"
5. Contractor receives notification

### 2. Contractor Receives & Responds
1. Log in as contractor
2. View pending assignments on "Contractor Dashboard"
3. See notification badge in navbar
4. Review job details
5. Options:
   - **Accept Job**: Job moves to "My Accepted Jobs"
   - **Reject Job**: Optionally provide rejection reason

### 3. Receptionist Tracks Jobs
1. View all jobs in "All Jobs" page
2. See assignment status badges:
   - 🟦 **Unassigned**: Not assigned to anyone
   - 🟧 **Pending**: Awaiting contractor response
   - 🟩 **Accepted**: Contractor accepted
   - 🟥 **Rejected**: Contractor rejected (with reason)
3. Use calendar view to see jobs by date
4. Check "Messages" for contractor communications

### 4. Admin Oversight
1. View all jobs system-wide
2. Access "Analytics" for:
   - Job completion rates
   - Contractor workload distribution
   - Assignment acceptance rates
3. Manage employees (create/edit/delete)
4. Edit or delete any job if needed

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `PATCH /api/v1/auth/updateUser` - Update user profile

### Jobs
- `GET /api/v1/jobs` - Get jobs (role-filtered)
- `POST /api/v1/jobs` - Create job (receptionist/admin)
- `GET /api/v1/jobs/stats` - Get job statistics
- `PATCH /api/v1/jobs/:id` - Update job
- `DELETE /api/v1/jobs/:id` - Delete job
- `GET /api/v1/jobs/contractors` - Get list of contractors
- `PATCH /api/v1/jobs/:id/accept` - Accept job (contractor)
- `PATCH /api/v1/jobs/:id/reject` - Reject job (contractor)

### Employees (Admin Only)
- `GET /api/v1/employees` - Get all employees
- `POST /api/v1/employees` - Create employee
- `PATCH /api/v1/employees/:id` - Update employee
- `DELETE /api/v1/employees/:id` - Delete employee

### Messages
- `GET /api/v1/messages/job/:jobId` - Get messages for a job
- `GET /api/v1/messages/receptionist` - Get all receptionist messages
- `POST /api/v1/messages` - Send message
- `DELETE /api/v1/messages/:id` - Delete message

### Notifications
- `GET /api/v1/notifications` - Get user notifications
- `GET /api/v1/notifications/unread-count` - Get unread count
- `PATCH /api/v1/notifications/:id/read` - Mark as read
- `PATCH /api/v1/notifications/mark-all-read` - Mark all as read
- `DELETE /api/v1/notifications/:id` - Delete notification

### Analytics (Admin Only)
- `GET /api/v1/analytics/job-status` - Job status breakdown
- `GET /api/v1/analytics/contractor-workload` - Contractor workload stats
- `GET /api/v1/analytics/jobs-by-date` - Jobs grouped by date
- `GET /api/v1/analytics/assignment-status` - Assignment status breakdown

## Project Structure

```
plumbingapp/
├── public/              # Static assets
├── server/              # Backend
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth & role middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   └── server.js        # Server entry point
├── src/                 # Frontend
│   ├── assets/          # Styles and images
│   ├── components/      # React components
│   ├── features/        # Redux slices
│   ├── pages/           # Page components
│   │   └── dashboard/   # Dashboard pages
│   ├── utils/           # Utilities
│   ├── App.js           # Main app component
│   └── store.js         # Redux store
└── package.json
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based route protection
- Protected API endpoints
- CORS configuration
- HTTP-only cookies (if configured)

## Troubleshooting

### Can't Login After Creating Admin
- Clear browser localStorage
- Ensure MongoDB connection is active
- Verify user role was updated correctly

### Contractors Not Seeing Notifications
- Check that job has `assignmentStatus: 'pending'`
- Verify notification was created in database
- Refresh the page or wait for auto-refresh (30 seconds)

### Routes Not Working
- Ensure both frontend and backend servers are running
- Check CORS settings in `server.js`
- Verify API base URL in `src/utils/axios.js`

### Calendar Not Showing Jobs
- Verify jobs have valid `date` field
- Check that user role has calendar access
- Ensure jobs are created by the logged-in receptionist

## Future Enhancements

- Real-time notifications with WebSockets
- File uploads for job photos
- Customer portal for job status tracking
- Mobile app with React Native
- Email notifications
- Automated job reminders
- Payment processing integration
- Multi-language support

## License

MIT License

## Support

For issues or questions, please open an issue in the repository or contact the development team.

---

**Note**: This application is designed for single-organization use. All users belong to the same plumbing business. For multi-tenant support, additional organization modeling would be required.
