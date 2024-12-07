import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

interface DepartmentData {
  name: string;
  percentage:number;
  patients: number;
  color: string;
}

interface DepartmentChartProps {
  data: DepartmentData[];
  className?: string;
}

export function DepartmentChart({ data, className = '' }: DepartmentChartProps) {
  const total = data.reduce((sum, item) => sum + item.patients, 0);

  const employeeData = [
    { department: 'Emergency', value: 20, percentage: '20%' },
    { department: 'ICU', value: 60, percentage: '60%' },
    { department: 'Cardiology', value: 45, percentage: '45%' },
    { department: 'Neurology', value: 80, percentage: '80%' },
    { department: 'Dermatology', value: 55, percentage: '55%' }
  ];

  return (
    <div className="space-y-4">
      <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
        <div className="flex justify-between items-center mb-2">
          <div>
            <h2 className="text-lg font-semibold">Patient Overview</h2>
            <p className="text-sm text-gray-500">by Departments</p>
          </div>
          <select className="text-sm border-gray-300 rounded-md">
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
        </div>

        <div className="flex items-start justify-between">
          <div className="relative w-[120px] h-[120px]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">

            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="95%"
                  paddingAngle={2}
                  dataKey="patients"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 pl-6 space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}</span>
                </div>
                <span className="text-sm font-medium">
                  {Math.round((item.patients / total) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Doctors</h2>
        </div>

        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={employeeData} barSize={30}>
              <XAxis 
                dataKey="department" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#666', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#666', fontSize: 12 }}
                domain={[0, 2000]}
              />
              <Bar 
                dataKey="value" 
                radius={[4, 4, 0, 0]}
              >
                {employeeData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index % 2 === 0 ? '#129820' : '#7BC1B7'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Calendar</h2>
        </div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar 
            defaultValue={dayjs()}
            sx={{
              width: '320px',
              height: '260px',
              '& .MuiPickersCalendarHeader-root': {
                paddingTop: '4px',
                paddingBottom: '4px',
                minHeight: '32px',
              },
              '& .MuiDayCalendar-header': {
                paddingTop: '4px',
              },
              '& .MuiDayCalendar-monthContainer': {
                minHeight: '180px',
              },
              '& .MuiPickersDay-root': {
                width: '32px',
                height: '32px',
                fontSize: '0.875rem',
                margin: '2px',
                '&.Mui-selected': {
                  backgroundColor: '#129820',
                  '&:hover': {
                    backgroundColor: '#7BC1B7',
                  },
                },
                '&:hover': {
                  backgroundColor: '#7BC1B7',
                },
              },
              '& .MuiDayCalendar-weekDayLabel': {
                color: '#666',
                width: '32px',
                height: '32px',
                fontSize: '0.875rem',
              },
              '& .MuiPickersDay-dayOutsideMonth': {
                color: '#666',
              },
            }}
          />
        </LocalizationProvider>
      </div>
    </div>
  );
}