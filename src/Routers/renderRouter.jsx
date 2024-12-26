import { Route, Routes } from "react-router-dom";
import Home from "../Pages/User/Home/home";
import { ROUTER } from "./router";
import MasterLayout from "../Pages/User/Home/MasterLayout/masterLayout";
import LoginPage from "../Auth/Login/login";
import { Profile } from "../Pages/User/Profile/profile";


const RenderRouter = () => {
    // route user
    const userRoutes = [
        { path: ROUTER.USER.HOME, Component: <Home/> },
        { path: ROUTER.USER.LOGIN, Component: <LoginPage /> },
        // { path: ROUTER.USER.REGISTER, Component: <RegisterPage /> },
        { path: ROUTER.USER.PROFILE, Component: <Profile /> },
        // { path: ROUTER.USER.SHOPCART, Component: <CartPage /> },
        // { path: ROUTER.USER.PRODUCTS, Component: <Products /> },
        // { path: ROUTER.USER.ORDERS, Component: <Orders /> },
        // { path: ROUTER.USER.PRODUCTDETAIL, Component: <BookDetails /> },
        // { path: ROUTER.USER.PAYMENT, Component: <PaymentPage /> },
    ];

    // route admin
    // const adminRoutes = [
    //     { path: ROUTER.ADMIN.HOME, Component: <AdminHome /> },
    //     { path: ROUTER.ADMIN.PRODUCT, Component: <AdminProduct /> },
    //     { path: ROUTER.ADMIN.ORDER, Component: <AdminOrder /> },
    //     { path: ROUTER.ADMIN.ADD_PRODUCT, Component: <AdminAddProduct /> },
    //     { path: ROUTER.ADMIN.PROFILE, Component: <AdminProfile /> },
    //     { path: ROUTER.ADMIN.STATISTICS, Component: <AdminStatistics /> },
    //     { path: ROUTER.ADMIN.USER, Component: <AdminUser/>},
    //     { path: "*", Component: <NotFound /> },
    // ];

    return (
        <Routes>
            {/* Render User Routes */}
            {userRoutes.map((route, index) => (
                <Route
                    key={`user-${index}`}
                    path={route.path}
                    element={
                        // Login và Register không cần MasterLayout
                        route.Component.type === LoginPage 
                        // route.Component.type === RegisterPage
                            ? route.Component:
                            <MasterLayout>{route.Component}</MasterLayout>
                    }
                />
            ))}

            {/* Render Admin Routes
            {adminRoutes.map((route, index) => (
                <Route
                    key={`admin-${index}`}
                    path={route.path}
                    element={<AdminLayout>{route.Component}</AdminLayout>}
                />
            ))} */}
        </Routes>
    );
};

export default RenderRouter;