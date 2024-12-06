import { formatDate } from '../utils/date';
import { Layout } from '../components/Layout';

// Mock notifications data
const notifications = [
  {
    id: '1',
    title: 'Appointment Reminder',
    message: 'Your appointment with Dr. Smith is tomorrow at 10:00 AM',
    date: '2024-03-20',
    read: false,
  },
];

export default function NotificationsPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-[#D2EBE7] pb-6">
        <div className="max-w-6xl mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h1>

          <div className="space-y-4">
            {notifications.length === 0 ? (
              <p>No notifications available.</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-xl shadow-lg p-6 ${!notification.read ? 'border-l-4 border-[#0B8FAC]' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{notification.title}</h3>
                      <p className="text-gray-600 mt-1">{notification.message}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(notification.date)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
} 