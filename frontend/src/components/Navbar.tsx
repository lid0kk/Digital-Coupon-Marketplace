import { Link, useLocation } from 'react-router-dom';
import { Tag, ShieldAlert } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex items-center space-x-2">
                            <Tag className="h-6 w-6 text-primary-600" />
                            <span className="font-bold text-xl text-gray-900 tracking-tight">CouponMart</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/"
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${!isAdmin ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                        >
                            Store
                        </Link>
                        <Link
                            to="/admin"
                            className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isAdmin ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                        >
                            <ShieldAlert className="w-4 h-4" />
                            <span>Admin</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
