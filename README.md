# Career Compass 🧭

**Career Compass** is a comprehensive, all-in-one platform designed to streamline the career development lifecycle for applicants and the recruitment process for employers. From AI-powered resume building to automated assessment proctoring and a global events hub, Career Compass provides the tools needed to navigate the modern job market.

## 🚀 Key Features

### 👤 For Applicants
- **Unified Profile**: Showcase your skills, experience, and certifications in one place.
- **Smart Job Search**: Filter and browse jobs, internships, hackathons, and webinars from global recruiters.
- **Resume Hub**: 
  - **Resume Builder**: Create professional resumes with curated templates.
  - **ATS Scanner**: Get real-time feedback and scores based on Industry-standard Applicant Tracking Systems.
- **Assessment Engine**: Take proctored assessments directly on the platform with real-time tracking and results.
- **Interview Hub**: Access common interview questions, practice mock interviews, and prepare with AI-driven insights.
- **Community**: Interact with peers, share knowledge, and stay updated with notifications.
- **Social Login**: Seamless authentication via Google, GitHub, and LinkedIn.

### 🏢 For Recruiters & Companies
- **Job & Event Management**: Post and manage jobs, internships, hackathons, webinars, and certifications.
- **Applicant Management**: Track applications, view candidate profiles, and manage status through a streamlined table view.
- **Assessment Proctoring**: 
  - Create custom assessments for specific roles.
  - Anti-cheat measures: Tab-switch detection and strike policy.
- **Interview Hub**: Manage company-specific interview questions and schedule invitations.
- **Analytics**: Gain insights into applicant trends and event engagement.

### 🛡️ For System Administrators
- **Global Dashboard**: Monitor platform activity, user growth, and active postings.
- **User Management**: Oversight of all users, companies, and roles.
- **Content Moderation**: Manage all global events and job listings.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **State Management**: Redux Toolkit & Redux Persist
- **Styling**: Tailwind CSS & Lucide Icons
- **Animations**: Framer Motion
- **UI Components**: Radix UI
- **Deployment**: Netlify

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: Passport.js (Social Auth) & JWT
- **Email Service**: Nodemailer (Gmail SMTP)
- **File Uploads**: Multer & Cloudinary
- **Deployment**: Render

---

## 📦 Installation & Setup

### Prerequisites
- Node.js installed
- MongoDB URI (Atlas or Local)
- Cloudinary Credentials
- OAuth Credentials (Google, GitHub, LinkedIn) - Optional for core functionality

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and fill in your credentials.
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your backend URL:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📄 License
This project is licensed under the ISC License.

---

## 👥 Contributors
Developed with ❤️ by the Career Compass Team.
