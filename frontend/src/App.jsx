import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import ForgotPassword from './components/auth/ForgotPassword'
import ResetPassword from './components/auth/ResetPassword'
import VerifyEmail from './components/auth/VerifyEmail'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import DescriptionPage from './components/DescriptionPage'
import Profile from './components/Profile'
import NotificationPage from './components/NotificationPage'
import CreatePost from './components/admin/CreatePost'
import PostJob from './components/admin/PostJob'
import AdminJobs from './components/admin/AdminJobs'
import Companies from './components/admin/Companies'
import SavedEvents from './components/SavedEvents'
import CareerCompassAI from './components/CareerCompassAI'
import ATSScanner from './components/resume/ATSScanner'
import ResumeBuilder from './components/resume/ResumeBuilder'
import MyApplications from './components/MyApplications'
import Applicants from './components/admin/Applicants'
import SysAdminLogin from './components/sys-admin/SysAdminLogin'
import SysAdminLayout from './components/sys-admin/SysAdminLayout'
import SysAdminDashboard from './components/sys-admin/SysAdminDashboard'
import SysAdminUsers from './components/sys-admin/SysAdminUsers'
import SysAdminJobs from './components/sys-admin/SysAdminJobs'
import SysAdminInternships from './components/sys-admin/SysAdminInternships'
import SysAdminHackathons from './components/sys-admin/SysAdminHackathons'
import SysAdminCompetitions from './components/sys-admin/SysAdminCompetitions'
import SysAdminWebinars from './components/sys-admin/SysAdminWebinars'
import SysAdminCertifications from './components/sys-admin/SysAdminCertifications'
import SysAdminAnalytics from './components/sys-admin/SysAdminAnalytics'
import SysAdminSettings from './components/sys-admin/SysAdminSettings'
import SysAdminProfile from './components/sys-admin/SysAdminProfile'
import SysAdminNotifications from './components/sys-admin/SysAdminNotifications'
import Settings from './components/Settings'
import CreateAssessment from './components/admin/CreateAssessment'
import UpdatePost from './components/admin/UpdatePost'
import AssessmentResults from './components/admin/AssessmentResults'
import Community from './components/Community'
import AssessmentTest from './components/AssessmentTest'
import MockInterview from './components/interview/MockInterview'
import PracticeQuestion from './components/interview/PracticeQuestion'
import AdminInterviewHub from './components/admin/interview/AdminInterviewHub'
import AddInterviewQuestion from './components/admin/interview/AddInterviewQuestion'
import ObjectiveQuestions from './components/interview/ObjectiveQuestions'
import SubjectiveQuestions from './components/interview/SubjectiveQuestions'
import CommonInterviewQuestions from './components/interview/CommonInterviewQuestions'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setUser } from './redux/authSlice'
import { USER_API_END_POINT } from './utils/constant'
import axios from 'axios'

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/reset-password/:token',
    element: <ResetPassword />
  },
  {
    path: '/verify-email',
    element: <VerifyEmail />
  },
  {
    path: '/events',
    element: <Jobs />
  },
  {
    path: '/browse',
    element: <Browse />
  },
  {
    path: '/description/:type/:id',
    element: <DescriptionPage />
  },
  {
    path: '/profile',
    element: <Profile />
  },
  {
    path: '/notification',
    element: <NotificationPage />
  },
  {
    path: '/admin/create',
    element: <CreatePost />
  },
  {
    path: '/admin/job/post',
    element: <PostJob />
  },
  {
    path: '/admin/posts',
    element: <AdminJobs />
  },
  {
    path: '/admin/companies',
    element: <Companies />
  },
  {
    path: '/saved-events',
    element: <SavedEvents />
  },
  {
    path: '/resume/builder',
    element: <ResumeBuilder />
  },
  {
    path: '/resume/ats',
    element: <ATSScanner />
  },
  {
    path: '/my-applications',
    element: <MyApplications />
  },
  {
    path: '/settings',
    element: <Settings />
  },
  {
    path: '/community',
    element: <Community />
  },
  {
    path: '/assessment/:id',
    element: <AssessmentTest />
  },
  {
    path: '/interview/mock',
    element: <MockInterview />
  },
  {
    path: '/interview/practice/:id',
    element: <PracticeQuestion />
  },
  {
    path: '/admin/interview/hub',
    element: <AdminInterviewHub />
  },
  {
    path: '/admin/interview/add-question/:companyId',
    element: <AddInterviewQuestion />
  },
  {
    path: '/objective-questions',
    element: <ObjectiveQuestions />
  },
  {
    path: '/subjective-questions',
    element: <SubjectiveQuestions />
  },
  {
    path: '/interview/common',
    element: <CommonInterviewQuestions />
  },
  {
    path: '/admin/posts/:id/applicants',
    element: <Applicants />
  },
  {
    path: '/admin/posts/:id/edit',
    element: <UpdatePost />
  },
  {
    path: '/admin/posts/:id/assessment',
    element: <CreateAssessment />
  },
  {
    path: '/admin/assessment-results',
    element: <AssessmentResults />
  },
  {
    path: '/sys-admin/login',
    element: <SysAdminLogin />
  },
  {
    path: '/sys-admin',
    element: <SysAdminLayout />,
    children: [
      {
        path: 'dashboard',
        element: <SysAdminDashboard />
      },
      {
        path: 'users',
        element: <SysAdminUsers />
      },
      {
        path: 'jobs',
        element: <SysAdminJobs />
      },
      {
        path: 'internships',
        element: <SysAdminInternships />
      },
      {
        path: 'hackathons',
        element: <SysAdminHackathons />
      },
      {
        path: 'competitions',
        element: <SysAdminCompetitions />
      },
      {
        path: 'webinars',
        element: <SysAdminWebinars />
      },
      {
        path: 'certifications',
        element: <SysAdminCertifications />
      },
      {
        path: 'analytics',
        element: <SysAdminAnalytics />
      },
      {
        path: 'settings',
        element: <SysAdminSettings />
      },
      {
        path: 'profile',
        element: <SysAdminProfile />
      },
      {
        path: 'notifications',
        element: <SysAdminNotifications />
      }
    ]
  }
])


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/me`, { withCredentials: true });
        if (res.data.success) {
          dispatch(setUser(res.data.user));
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchUser();
  }, [dispatch]);

  return (
    <div>
      <RouterProvider router={appRouter} />
      <CareerCompassAI />
    </div>
  )
}

export default App
