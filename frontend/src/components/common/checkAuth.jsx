import { useLocation, Navigate } from "react-router";

function CheckAuth({ isAuthenticated, user, children }) {
    const location = useLocation();
    const currentPath = location.pathname;

    console.log('CheckAuth Debug:', {
        currentPath,
        isAuthenticated,
        user,
        userType: typeof user
    });

    // Helper functions for route checking
    const isAuthRoute = () => {
        return currentPath.startsWith('/auth');
    };

    const isAdminRoute = () => {
        return currentPath.startsWith('/admin');
    };

    const isShopRoute = () => {
        return currentPath.startsWith('/shop');
    };

    const isPublicRoute = () => {
        const publicRoutes = ['/unauthorized'];
        return publicRoutes.includes(currentPath);
    };

 

   if (!isAuthenticated || isAuthenticated === undefined) {
         if (currentPath === '/auth/login' || currentPath === '/auth/register' || isPublicRoute()) {
            return <>{children}</>;
        }
        console.log('Redirecting unauthenticated user to login');
        return (
            <Navigate 
                to="/auth/login" 
                state={{ from: location }} 
                replace 
            />
        );
    }

    // Handle authenticated users with valid user object
    if (isAuthenticated && user) {
        const isAdmin = user?.role === "admin";
        console.log('Authenticated user, role:', user.role);
        
        // Handle root path redirect for authenticated users
        if (currentPath === '/' || isAuthRoute()) {
            const redirectTo = isAdmin ? '/admin/dashboard' : '/shop/home';
            console.log('Redirecting from root to:', redirectTo);
            return <Navigate to={redirectTo} replace />;
        }
        
        // Role-based access control
        if (isAdminRoute() && !isAdmin) {
            console.log('Non-admin trying to access admin route');
            return (
                <Navigate 
                    to="/unauthorized" 
                    state={{ 
                        from: location, 
                        reason: 'admin_required',
                        userRole: user?.role 
                    }} 
                    replace 
                />
            );
        }
        
        // Redirect admin users away from shop routes
        if (isAdmin && isShopRoute()) {
            console.log('Admin user redirected from shop to dashboard');
            return <Navigate to="/admin/dashboard" replace />;
        }
    }

    console.log('Rendering children for path:', currentPath);
    return <>{children}</>;
}

export default CheckAuth;