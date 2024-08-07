import './App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import './assets/fonts/Nohemi-Bold.ttf';
import './assets/fonts/Nohemi-ExtraLight.ttf';
import './assets/fonts/Nohemi-Light.ttf';
import './assets/fonts/Nohemi-Medium.ttf';
import './assets/fonts/Nohemi-Regular.ttf';
import './assets/fonts/Nohemi-SemiBold.ttf';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import Main from './components/Main/Main';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Layout from './Layout';
import Login from './components/AUTH/Login';
import LinkPage from './components/AUTH/LinkPage';
import Unauthorized from './components/AUTH/Unauthorized';
import RequireAuth from './components/Hooks/RequireAuth';
import Dashboard from './components/Dashboard';
import ManagesTAs from './pages/managesTAs/ManagesTAs';
import TAAvailability from './pages/managesTAs/TaAvaialablity';
import ManageCoaches from './pages/ManageCoaches/ManageCoaches';
import CoachMapping from './pages/ManageCoaches/CoachMapping';
import CoachTemplate from './pages/ManageCoaches/CoachingTemplate/CoachTemplate';
import CoachAvialability from './pages/ManageCoaches/CoachAvialability';
import CoachScheduling from './pages/ManageCoaches/CoachScheduling';
import ScheduledCalls from './pages/Coach/ScheduleCalls';

import AllRoutes from './components/AllRoutes/AllRoutes';
import TaMapping from './pages/managesTAs/TaMapping';
import TaScheduling from './pages/managesTAs/TaScheduling';
import Calendar from './components/Calender/indexCalender';
import StudentPage from './pages/students/StudentPage';
import MyProfile from './components/RoleRoute/CommonComponent/MyProfile';
import CallRecords from './pages/MODULE/TaModule/CallRecords';
import Messages from './components/RoleRoute/CommonComponent/Messages';
import CallRequest from './pages/MODULE/TaModule/CallRequest';
import MyCalender from './components/RoleRoute/CommonComponent/MyCalender';
import Mystudents from './components/RoleRoute/CommonComponent/Mystudents';
import AssignedStudent from './pages/managesTAs/AssignedStudent';
// import StudentList from './pages/Student/StudentList';
import AddEditTA from './components/adminModule/tas/manageTAs/AddEditTA';
import AssignCoachBatches from './pages/ManageCoaches/AssignedCoachBatches';
import AssignCoachStudent from './pages/ManageCoaches/AssignedCoachStudent';
import CreateCoachPage from './pages/ManageCoaches/CreateCoachPage';
import CoachCalender from './pages/ManageCoaches/CoachCalender';
import CreateTAPage from './pages/managesTAs/CreateTAPage';
import AssignedBatches from './pages/managesTAs/AssignedBatches';
import TaCalender from './pages/managesTAs/TaCalendar';
import BatchPage from './pages/batches/BatchPage';
import CreateTemplate from './pages/ManageCoaches/CoachingTemplate/CreateTemplate';
import TemplateName from './pages/ManageCoaches/CoachingTemplate/TemplateName';
import WheelOfLife from './pages/coachingTools/wheelOfLife/WheelOfLife';
import WOLCategories from './components/coachingTools/wheelOfLife/WOLCategories';
import WOLInstructions from './components/coachingTools/wheelOfLife/WOLInstructions';
import WOLQuestions from './components/coachingTools/wheelOfLife/WOLQuestions';
import WOLOptionsConfig from './components/coachingTools/wheelOfLife/WOLOptionsConfig';
import WOLTestConfig from './components/coachingTools/wheelOfLife/WOLTestConfig';
import AddEditWOLQuestions from './components/coachingTools/wheelOfLife/AddEditWOLQuestions';
import AddEditTeachingAssistant from './pages/MODULE/TaModule/TeachingAssistant';
import CreateTaMenu from './pages/MODULE/TaModule/CreateTaMenu';

import CoachMenu from './pages/MODULE/coachModule/CoachMenu';

import CoachMenuProfile from './pages/MODULE/coachModule/CoachMenuProfile';
import CoachCallRequest from './pages/MODULE/coachModule/CoachCallRequest';

import CoachMenuCalendar from './pages/MODULE/coachModule/CoachMenuCalendar';
import CoachCallRecord from './pages/MODULE/coachModule/CoachCallRecord';
import WOLTestConfigSelectQuestions from './components/coachingTools/wheelOfLife/WOLTestConfigSelectQuestions';
import TAMenuCalendar from './pages/MODULE/TaModule/TaMenuCalendar';
import CoachMenuScheduledcall from './pages/MODULE/coachModule/CoachMenuScheduledcall';
import CoachMenuStudents from './pages/MODULE/coachModule/CoachMenuStudents';
import CoachMenuMessages from './pages/MODULE/coachModule/CoachMenuMessages';
import CoachMenuAssessments from './pages/MODULE/coachModule/CoachMenuAssessments';
import TaMenuProfile from './pages/MODULE/TaModule/TaMenuProfile';
import TaMenuStudents from './pages/MODULE/TaModule/TaMenuStudents';
import TaMenuScheduledCall from './pages/MODULE/TaModule/TaMenuScheduledCall';
import TaMenuMessage from './pages/MODULE/TaModule/TaMenuMessage';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLogin } from './redux/features/auth/loginSlice';
import StudentDetails from './components/CommonComponent/studentDetails';

const ROLES = {
    Teaching: 2001,
    Coaches: 1984,
    Admin: 5150,
};

function LoginApp() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userData, login, role, accessToken } = useSelector(
        state => state.login
    );

    const access_token = localStorage.getItem('accessToken');
    const userRole = localStorage.getItem('role');

    useEffect(() => {
        if (access_token) {
            dispatch(
                setLogin({
                    login: true,
                    role: userRole,
                    accessToken: access_token,
                })
            );
        }
    }, [access_token]);

    useEffect(() => {
        if (login) {
            console.log('inside user Effect in app.js', role);

            if (role.includes(1984)) {
                // Coach role
                navigate('/coachmenu_profile', { replace: true });
            } else if (role.includes(2001)) {
                // Teaching role
                navigate('/tamenu_profile', { replace: true });
            } else if (role.includes(5150)) {
                // Admin role
                navigate('/', { replace: true });
            } else {
                navigate(from, { replace: true });
            }
        } else {
            navigate('/login', { replace: true });
        }
    }, [login, role, accessToken]);

    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* Public Routes */}
                <Route path="login" element={<Login />} />
                <Route path="linkpage" element={<LinkPage />} />
                <Route path="unauthorized" element={<Unauthorized />} />

                {!login}
                {<Route path="login" element={<Login />} />}

                {/* Protected Routes */}
                {login && role == 5150 && (
                    <Route path="/" element={<Main page="Dashboard" />}>
                        <Route index element={<Dashboard />} />
                        <Route path="dashboard" element={<Dashboard />} />

                        <Route
                            path="ta-manage"
                            element={<ManagesTAs page="Manage TA" />}
                        />

                        <Route
                            path="AddEditTA"
                            element={<AddEditTA page="Edit Ta" />}
                        />

                        <Route
                            path="ta-mapping"
                            element={<TaMapping page="TA Mapping" />}
                        />
                        <Route
                            path="/active-students/:id"
                            element={
                                <AssignedStudent page="Assigned Students" />
                            }
                        />
                        <Route
                            path="/active-batches/:id"
                            element={
                                <AssignedBatches page="Assigned Batches" />
                            }
                        />
                        <Route
                            path="/active-Coach-batches/:id"
                            element={
                                <AssignCoachBatches page="Assigned Coach Batches" />
                            }
                        />
                        <Route
                            path="/active-Coach-students/:id"
                            element={
                                <AssignCoachStudent page="Assigned Coach Student" />
                            }
                        />
                        <Route
                            path="ta-availability"
                            element={<TAAvailability page="TA Availability" />}
                        />
                        <Route
                            path="TaProfile"
                            element={
                                <AddEditTeachingAssistant page="Ta-Profile" />
                            }
                        />
                        <Route
                            path="ta-scheduling"
                            element={<TaScheduling page="TA Scheduling" />}
                        />
                        <Route
                            path="ta-calendar/:name/:id"
                            element={<TaCalender page="Calendar" />}
                        />
                        {/* <Route path='calendar' element={<Calendar page="Calendar" />} /> */}
                        <Route
                            path="coach-manage"
                            element={<ManageCoaches page="Manage Coaches" />}
                        />
                        <Route
                            path="createcoach"
                            element={<CreateCoachPage page="Create Coach" />}
                        />
                        <Route
                            path="coach-mapping"
                            element={<CoachMapping page="Coach Mapping" />}
                        />
                        <Route
                            path="coach-calender/:name/:id"
                            element={<CoachCalender page="Calendar" />}
                        />
                        <Route
                            path="coach-template"
                            element={<CoachTemplate page="Coach Template" />}
                        />

                        <Route
                            path="create-template"
                            element={<CreateTemplate page="Create Template" />}
                        />
                        <Route
                            path="template-name"
                            element={<TemplateName page="Template Name" />}
                        />
                        <Route
                            path="coach-availability"
                            element={
                                <CoachAvialability page="Coach Availability" />
                            }
                        />
                        <Route
                            path="coach-scheduling"
                            element={
                                <CoachScheduling page="Coach Scheduling" />
                            }
                        />
                        <Route path="students" element={<StudentPage />} />
                        <Route path="batches" element={<BatchPage />} />
                        {/* <Route path='/student-list' element={<StudentList page="Student" />} /> */}
                        <Route path="wheel-of-life" element={<WheelOfLife />} />
                        <Route
                            path="wolCategories"
                            element={<WOLCategories />}
                        />
                        <Route
                            path="wolInstructions"
                            element={<WOLInstructions />}
                        />
                        <Route path="wolQuestions" element={<WOLQuestions />} />
                        <Route
                            path="wolQuestions/add-Edit"
                            element={<AddEditWOLQuestions />}
                        />
                        <Route
                            path="wolOptionsConfig"
                            element={<WOLOptionsConfig />}
                        />
                        <Route
                            path="wolTestConfig"
                            element={<WOLTestConfig />}
                        />
                        <Route
                            path="WOLTestConfigSelectQuestions"
                            element={<WOLTestConfigSelectQuestions />}
                        />
                        <Route
                            path="schedule-calls"
                            element={<ScheduledCalls page="Schedule Calls" />}
                        />
                    </Route>
                )}

                {/* Missed */}

                {/* Routes for Coachemenu */}
                {login && role == 1984 && (
                    <Route path="/" element={<Main page="Coach Menu" />}>
                        <Route
                            path="coachmenu"
                            element={<CoachMenu page="Coach Menu" />}
                        />
                        <Route
                            path="coachmenu_profile"
                            element={
                                <CoachMenuProfile page="Coach Menu Profile" />
                            }
                        />
                        <Route
                            path="coachmenu_callrequest"
                            element={
                                <CoachCallRequest page="Coach Call Request" />
                            }
                        />
                        <Route
                            path="coachmenu_callrecords"
                            element={
                                <CoachCallRecord page="Coach Call Records" />
                            }
                        />
                        <Route
                            path="coachmenu_calendar"
                            element={
                                <CoachMenuCalendar page="Coach Menu Calendar" />
                            }
                        />
                        <Route
                            path="coachmenu_scheduledcall"
                            element={
                                <CoachMenuScheduledcall page="Coach Menu ScheduledCall" />
                            }
                        />
                        <Route
                            path="coachmenu_students"
                            element={
                                <CoachMenuStudents page="Coach Menu Students" />
                            }
                        />
                        <Route
                            path="coachmenu_messages"
                            element={
                                <CoachMenuMessages page="Coach Menu Messages" />
                            }
                        />
                        <Route
                            path="coachmenu_assessments"
                            element={
                                <CoachMenuAssessments page="Coach Menu Assessemets" />
                            }
                        />
                        {/* <Route
                            path="student_details/:id"
                            element={
                                <StudentDetails page="Coach Menu StudentDetails" />
                            }
                        /> */}
                    </Route>
                )}

                {/* Routes for Tamenu */}
                {login && role == 2001 && (
                    <Route
                        path="/"
                        element={<Main page="Teaching Assistant Menu" />}
                    >
                        <Route
                            path="tamenu_profile"
                            element={<TaMenuProfile page="My Profile" />}
                        />
                        <Route
                            path="tamenu_students"
                            element={<TaMenuStudents page="My Students" />}
                        />
                        <Route
                            path="tamenu_scheduledcall"
                            element={
                                <TaMenuScheduledCall page="Schedule Calls" />
                            }
                        />
                        <Route
                            path="tamenu_callrequest"
                            element={<CallRequest page="Call Request" />}
                        />
                        <Route
                            path="tamenu_messages"
                            element={<TaMenuMessage page="Messages" />}
                        />
                        <Route
                            path="tamenu_callrecords"
                            element={<CallRecords page="Call Records" />}
                        />
                        <Route
                            path="create_ta"
                            element={<CreateTAPage page="Create TA" />}
                        />
                        <Route
                            path="create_menu"
                            element={<CreateTaMenu page="Create Menu" />}
                        />
                        <Route
                            path="tamenu_calendar"
                            element={<TAMenuCalendar page="TA Menu Calendar" />}
                        />
                    </Route>
                )}

                <Route path="*" element={<AllRoutes />} />
            </Route>
        </Routes>
    );
}

export default LoginApp;

// Previous changes

{
    /* <div className="App">
<Grid container spacing={0.5}>
  <Grid item xs={12}>
    <Header />
  </Grid>
  <Grid item xs={2} sx={{ background: 'linear-gradient(to bottom, #362f9c, #7931a3)', height: '90vh'}}>
      <Sidebar />
  </Grid>
  <Grid item xs={10}>
    <ManagesTAs/>
  </Grid>
</Grid>
</div> */
}
