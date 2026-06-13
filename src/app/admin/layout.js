import '../../styles/admin.scss';
import AdminTopbarActions from '@/components/admin/AdminTopbarActions';

export const metadata = {
  title: 'Admin — Marcus Cole Group',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <span className="admin-topbar__brand">
          Marcus Cole <em>Group</em>
        </span>
        <AdminTopbarActions />
      </header>
      <main className="admin-main">{children}</main>
    </div>
  );
}
