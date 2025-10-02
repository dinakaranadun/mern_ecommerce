import { useNavigate } from 'react-router';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { NavLink } from 'react-router';
import { Grid2x2Plus, LayoutDashboard, ShoppingBag, ShoppingBasket } from 'lucide-react';

const adminSideBarItems = [
  { id: 'dashboard', label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', path: '/admin/products', icon: ShoppingBasket },
  { id: 'orders', label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  { id: 'features', label: 'Features', path: '/admin/features', icon: Grid2x2Plus },
];

function MenuItems({ onNavigate }) {
  return (
    <nav className="mt-8 space-y-1" aria-label="Admin navigation">
      {adminSideBarItems.map(item => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.id}
            to={item.path}
            onClick={() => onNavigate?.()}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
              ${isActive
                ? 'bg-white text-black font-medium shadow-sm'
                : 'text-gray-700 hover:bg-white/50 hover:text-black'
              }`
            }
            aria-label={item.label}
          >
            <Icon className="w-5 h-5" aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

const AdminSidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();

  const handleMobileNavigate = () => {
    setOpen(false);
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b pb-4">
              <SheetTitle className="flex gap-2 items-center">
                <LayoutDashboard className="w-5 h-5" />
                <span>Admin Panel</span>
              </SheetTitle>
            </SheetHeader>
            <MenuItems onNavigate={handleMobileNavigate} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-gray-200 p-6 lg:flex">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-2 mb-2 focus:outline-none focus:ring-2 focus:ring-black rounded-lg p-2 -ml-2"
          aria-label="Go to dashboard"
        >
          <LayoutDashboard className="w-5 h-5" />
          <h1 className="font-bold text-lg">Admin Panel</h1>
        </button>
        <MenuItems />
      </aside>
    </>
  );
};

export default AdminSidebar;