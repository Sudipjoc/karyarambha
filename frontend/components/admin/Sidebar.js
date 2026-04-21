import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  StarIcon,
  WrenchScrewdriverIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { logout, getUser } from '../../lib/auth';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: HomeIcon, roles: ['admin', 'project_manager', 'employee'] },
  { href: '/admin/tasks', label: 'Tasks', icon: ClipboardDocumentListIcon, roles: ['admin', 'project_manager', 'employee'] },
  { href: '/admin/users', label: 'Users', icon: UsersIcon, roles: ['admin'] },
  { href: '/admin/content', label: 'Page Builder', icon: PencilSquareIcon, roles: ['admin', 'project_manager'] },
  { href: '/admin/blogs', label: 'Blogs', icon: DocumentTextIcon, roles: ['admin', 'project_manager'] },
  { href: '/admin/team', label: 'Team Members', icon: UserGroupIcon, roles: ['admin', 'project_manager'] },
  { href: '/admin/testimonials', label: 'Testimonials', icon: StarIcon, roles: ['admin', 'project_manager'] },
  { href: '/admin/services', label: 'Services', icon: WrenchScrewdriverIcon, roles: ['admin', 'project_manager'] },
  { href: '/admin/audit', label: 'Audit Trail', icon: ChartBarIcon, roles: ['admin'] },
];

export default function AdminSidebar() {
  const router = useRouter();
  const user = getUser();

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const visibleItems = navItems.filter(
    (item) => !user || item.roles.includes(user.role)
  );

  return (
    <div className="w-64 min-h-screen bg-primary-900 text-white flex flex-col">
      <div className="p-6 border-b border-primary-700">
        <h1 className="text-xl font-bold">Karyarambha</h1>
        <p className="text-primary-300 text-xs mt-1">Admin Portal</p>
      </div>

      {user && (
        <div className="p-4 border-b border-primary-700">
          <p className="text-sm font-medium">{user.name}</p>
          <span className="text-xs bg-primary-700 text-primary-200 px-2 py-0.5 rounded-full capitalize">
            {user.role.replace('_', ' ')}
          </span>
        </div>
      )}

      <nav className="flex-1 p-4 space-y-1">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = router.pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                active
                  ? 'bg-primary-600 text-white'
                  : 'text-primary-200 hover:bg-primary-800 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-primary-700">
        <Link href="/" className="flex items-center gap-2 text-primary-300 hover:text-white text-sm mb-2">
          ← View Website
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-primary-300 hover:text-red-400 text-sm w-full"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
