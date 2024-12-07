import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  ClipboardList,
  TestTube2,
  MessageSquare,
  Clock
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/doctor/dashboard' },
  { icon: Calendar, label: 'Appointments', path: '/doctor/appointments' },
  { icon: Clock, label: 'Schedule', path: '/doctor/schedule' },
  { icon: FileText, label: 'Prescriptions', path: '/doctor/prescriptions' },
  { icon: ClipboardList, label: 'Medical Records', path: '/doctor/records' },
  { icon: TestTube2, label: 'Lab Reports', path: '/doctor/lab-reports' },
  { icon: MessageSquare, label: 'Chat', path: '/doctor/chat' },
];

export default function DoctorSidebar() {
  const location = useLocation();

  return (
    <div className="bg-white h-screen w-64 fixed left-0 top-0 border-r">
      <div className="p-4 flex items-center space-x-2">
        <img src="/logo.svg" alt="Oasis" className="h-8 w-8" />
        <span className="text-xl font-semibold text-[#0B8FAC]">Oasis</span>
      </div>

      <nav className="px-0">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-6 py-2.5 transition-colors w-full ${isActive
                    ? 'bg-[#D2EBE7] text-[#0B8FAC]'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <Icon size={20} strokeWidth={1.5} />
                  <span className="text-sm">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}