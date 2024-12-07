import { Link } from 'react-router-dom';

interface User {
  name: string;
  role: string;
  avatar?: string;
}

interface HeaderProps {
  user: User;
}

export function DoctorHeader({ user }: HeaderProps) {
  return (
    <header className="bg-[#D2EBE7] px-6 py-4">
      <div className="flex justify-end items-center">
        <Link to="/profile" className="flex items-center gap-2 hover:bg-[#C1E0DC] p-2 rounded-lg transition-colors">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-8 w-8 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user.name}</span>
            <span className="text-xs text-gray-500">{user.role}</span>
          </div>
        </Link>
      </div>
    </header>
  );
}