import { FileText, Users, DollarSign, TestTube2 } from 'lucide-react';
import { ActivityCard } from '../../components/admin/dashboard/ActivityCard';
import { DepartmentChart } from '../../components/admin/dashboard/DepartmentChart';
import { TopDoctors } from '../../components/admin/dashboard/TopDoctors';
import { WelcomeBanner } from '../../components/admin/dashboard/WelcomeBanner';
import { Layout } from '../../components/admin/AdminLayout';

// Update the activityData in DashboardPage.tsx to use these colors:
const activityData = [
  {
    title: 'Appointments',
    value: '100',
    icon: <FileText className="w-6 h-6" />,
    bgColor: 'bg-[#0B8FAC]',
    textColor: 'text-[#0B8FAC]'
  },
  {
    title: 'New Patients',
    value: '50',
    icon: <Users className="w-6 h-6" />,
    bgColor: 'bg-[#F30000]',
    textColor: 'text-[#129820]'
  },
  {
    title: 'Revenue',
    value: '$500',
    icon: <DollarSign className="w-6 h-6" />,
    bgColor: 'bg-[#F89603]',
    textColor: 'text-[#F89603]'
  },
  {
    title: 'Lab Tests',
    value: '100',
    icon: <TestTube2 className="w-6 h-6" />,
    bgColor: 'bg-[#129820]',
    textColor: 'text-[#7BC1B7]'
  },
];

const departmentData = [
  {
    name: 'Cardiology',
    percentage: 40,
    patients: 1200,
    color: '#129820'
  },
  {
    name: 'Neurology',
    percentage: 30,
    patients: 800,
    color: '#7BC1B7'
  },
  {
    name: 'Dermatology',
    percentage: 20,
    patients: 600,
    color: '#F89603'
  },
  {
    name: 'Others',
    percentage: 10,
    patients: 400,
    color: '#0B8FAC'
  },
];

export function DashboardPage() {
  return (
    <Layout>
      <div className="space-y-6 p-6">
        <WelcomeBanner />

        <div className="grid grid-cols-4 gap-4">
          {activityData.map((item) => (
            <ActivityCard key={item.title} {...item} />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          <TopDoctors className="col-span-2" />
          <DepartmentChart data={departmentData} />
        </div>
      </div>
    </Layout>
  );
}