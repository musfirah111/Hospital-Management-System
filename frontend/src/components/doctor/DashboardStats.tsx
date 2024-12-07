import { Users, Calendar, Clock, CheckCircle } from 'lucide-react';

const stats = [
  {
    label: 'Total Patients',
    value: '1,284',
    icon: Users,
    trend: '+12.5%',
    trendUp: true
  },
  {
    label: 'Appointments Today',
    value: '42',
    icon: Calendar,
    trend: '+5.2%',
    trendUp: true
  },
  {
    label: 'Pending Reviews',
    value: '8',
    icon: Clock,
    trend: '-2.4%',
    trendUp: false
  },
  {
    label: 'Completed Today',
    value: '18',
    icon: CheckCircle,
    trend: '+8.1%',
    trendUp: true
  }
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <stat.icon className="w-6 h-6 text-blue-500" />
            </div>
            <span className={`text-sm font-medium ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}>
              {stat.trend}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
          <p className="text-sm text-gray-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}