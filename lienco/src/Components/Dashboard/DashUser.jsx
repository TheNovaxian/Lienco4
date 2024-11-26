import React, { useState, useEffect } from 'react';
import './DashUser.css'
import Header from './Header.jsx'
import Sidebar from './SideBar.jsx'
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';  // Import useNavigate to handle routing
import BudgetTracker from '../Resources/budgettracker.jsx';
import MeetingScheduler from './PMDashboard/meetingscheduler.jsx';
import Chart from './PMDashboard/chart.jsx'
import Rchart from './PMDashboard/rchart.jsx';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import ChatBubble from './ChatBubble.jsx';


const DashUser = ({ onLogout, userRole, spentAmount, totalAmount,resourceData, events }) => {

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();  // Initialize useNavigate for navigation
  const [meetings, setMeetings] = useState([]);
  const totalBudget = 50000; // Example total budget
  const usedBudget = 25000;  // Example used budget
  const percentageUsed = (usedBudget / totalBudget) * 100;

  const percentageSpent = (spentAmount / totalAmount) * 100;

  const today = new Date();
  const todayMeetings = meetings.filter((meeting) => {
    const meetingDate = meeting.start; // `start` is already converted to a Date
    return meetingDate.toDateString() === today.toDateString();
  });
  

  const db = getFirestore();

  function fetchMeetings(setMeetings) {
    const meetingsRef = collection(db, "meetings");
    getDocs(meetingsRef)
      .then((querySnapshot) => {
        const meetings = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            ...data,
            start: new Date(data.start.seconds * 1000), // Convert Firestore Timestamp to Date
          };
        });
        setMeetings(meetings);
      })
      .catch((error) => {
        console.error("Error fetching meetings: ", error);
      });
  }
  


  // Handle notification click to navigate to the ticket
  const handleNotificationClick = (ticketId) => {
    navigate(`/pdash`);  // Navigate to the ticket page with ticketId in URL
  };

  useEffect(() => {

    fetchMeetings(setMeetings);

    if (user) {
      const userEmail = user.email;
      if (userEmail) {
        const encodeEmail = (email) => {
          return email.replace(/\./g, '_dot_').replace(/@/g, '_at_');
        };
        const encodedUserId = encodeEmail(userEmail);
        const db = getDatabase();
        const notificationsRef = ref(db, `notifications/${encodedUserId}`);
        
        const unsubscribe = onValue(
          notificationsRef,
          (snapshot) => {
            const data = snapshot.val();
            if (data) {
              const notificationsArray = Object.keys(data).map((key) => ({
                id: key,
                ...data[key],
              }));
              setNotifications(notificationsArray);
              const unread = notificationsArray.filter((notification) => !notification.read).length;
              setUnreadCount(unread);
            } else {
              setNotifications([]);
              setUnreadCount(0);
            }
          },
          (error) => {
            console.error('Error fetching notifications:', error);
          }
        );

        return () => unsubscribe();
      }
    }
  }, [user]);

  return (
    <div className='dashuser'>
      <Header onLogout={onLogout} />
      <Sidebar userRole={userRole} />
        
      <div className='dashcontent'>
        <div className='topbox'>
          <div className='topbox1'>


          </div>
          <div className='topbox2'>
            <h4>Scheduled Meetings</h4>
            <p className='counting'>{todayMeetings.length} meetings today</p>
          </div>
          <div className='topbox3'>
            <Rchart   title="Resource Usage"
          percentage={percentageSpent.toFixed(2)} />
          </div>
          <div className='topbox4'>
            <Chart   title="Budget Usage"
          percentage={percentageUsed.toFixed(2)} />
          </div>
        </div>
        <div className='leftside'>

        <div className='dashtainer1'>
          <h4>Notifications</h4>
          <ul>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <li
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.ticketId)}  // Click handler to navigate
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}  // Style to make it clickable
                >
                  <p>{notification.message}</p>
                  <small>{new Date(notification.timestamp).toLocaleString()}</small>
                </li>
              ))
            ) : (
              <p>No new notifications</p>
            )}
          </ul>
        </div>

        <div className='dashtainer2'>
            <div className='budgettracker'>
              <MeetingScheduler />
            {/* <BudgetTracker /> */}
            </div>
          </div>

        </div>
       

       
      </div>
      <ChatBubble />

    </div>
  );
};

export default DashUser
