import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Home from './pages/Home';
import Support from './pages/Support';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCustomers from './pages/admin/ManageCustomers'; // Deprecated for direct use, prefer sub-pages
import CustomersDashboard from './pages/admin/customers/CustomersDashboard';
import ActiveCustomers from './pages/admin/customers/ActiveCustomers';
import InactiveCustomers from './pages/admin/customers/InactiveCustomers';
import AllCustomers from './pages/admin/customers/AllCustomers';
import SearchCustomers from './pages/admin/customers/SearchCustomers';
import CustomerDetails from './pages/admin/customers/CustomerDetails';
import CustomerBookings from './pages/admin/customers/CustomerBookings';
import DriversDashboard from './pages/admin/drivers/DriversDashboard';
import ActiveDrivers from './pages/admin/drivers/ActiveDrivers';
import InactiveDrivers from './pages/admin/drivers/InactiveDrivers';
import TotalDrivers from './pages/admin/drivers/TotalDrivers';
import DriverDetails from './pages/admin/drivers/DriverDetails';
import DriverBookings from './pages/admin/drivers/DriverBookings';
import ManageDrivers from './pages/admin/ManageDrivers'; // Kept for legacy if needed, but updated routes use new comps
import AllBookings from './pages/admin/AllBookings';
import ManageCabs from './pages/admin/ManageCabs';
import AdminCabDetails from './pages/admin/AdminCabDetails';
import BookingDetails from './pages/admin/BookingDetails';
import AdminProfile from './pages/admin/AdminProfile';
import CustomerProfile from './pages/customer/CustomerProfile';
import MyBookings from './pages/customer/MyBookings';
import DriverProfile from './pages/driver/DriverProfile';
import MyTrips from './pages/driver/MyTrips';
import MyCab from './pages/driver/MyCab';
import ChangePassword from './pages/ChangePassword';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import DriverDashboard from './pages/driver/DriverDashboard';
import CreateProfile from './pages/customer/CreateProfile';
import CreateDriverProfile from './pages/driver/CreateDriverProfile';
import BookingWindow from './pages/customer/BookingWindow';
import CabAvailability from './pages/customer/CabAvailability';
import { ROLES } from './utils/constants';
import ScrollToTop from './components/common/ScrollToTop';
import ScrollToTopButton from './components/common/ScrollToTopButton';

function App() {
  return (
    <>
      <ScrollToTop />
      <ScrollToTopButton />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/support" element={<Support />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Protected Routes without Dashboard Layout */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.CUSTOMER]} />}>
          <Route path="/customer/create-profile" element={<CreateProfile />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[ROLES.DRIVER]} />}>
          <Route path="/driver/create-profile" element={<CreateDriverProfile />} />
        </Route>

        {/* Protected Routes with Dashboard Layout */}
        <Route element={<ProtectedRoute />}>
          {/* Layout route */}
          <Route element={<DashboardLayout />}>

            {/* Customer Routes */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.CUSTOMER]} />}>
              <Route path="/customer/dashboard" element={<CustomerDashboard />} />
              <Route path="/customer/profile" element={<CustomerProfile />} />
              <Route path="/customer/change-password" element={<ChangePassword />} />
              <Route path="/customer/bookings" element={<MyBookings />} />
              <Route path="/customer/booking-window" element={<BookingWindow />} />
              <Route path="/customer/cab-availability" element={<CabAvailability />} />
            </Route>

            {/* Driver Routes */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.DRIVER]} />}>
              <Route path="/driver/dashboard" element={<DriverDashboard />} />
              <Route path="/driver/profile" element={<DriverProfile />} />
              <Route path="/driver/change-password" element={<ChangePassword />} />
              <Route path="/driver/trips" element={<MyTrips />} />
              <Route path="/driver/cab" element={<MyCab />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
              {/* Dashboard and Drill-down Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/dashboard/active-customers" element={<ActiveCustomers />} />
              <Route path="/admin/dashboard/active-drivers" element={<ManageDrivers />} />
              <Route path="/admin/dashboard/active-rides" element={<AllBookings />} />
              <Route path="/admin/dashboard/available-cabs" element={<ManageCabs />} />

              {/* Sidebar Management Routes */}
              <Route path="/admin/customers" element={<CustomersDashboard />} />
              <Route path="/admin/customers/active" element={<ActiveCustomers />} />
              <Route path="/admin/customers/inactive" element={<InactiveCustomers />} />
              <Route path="/admin/customers/all" element={<AllCustomers />} />
              <Route path="/admin/customers/search" element={<SearchCustomers />} />
              <Route path="/admin/customers/:customerId" element={<CustomerDetails />} />
              <Route path="/admin/customers/:customerId/bookings" element={<CustomerBookings />} />
              <Route path="/admin/drivers" element={<DriversDashboard />} />
              <Route path="/admin/drivers/active" element={<ActiveDrivers />} />
              <Route path="/admin/drivers/inactive" element={<InactiveDrivers />} />
              <Route path="/admin/drivers/all" element={<TotalDrivers />} />
              <Route path="/admin/drivers/:driverId" element={<DriverDetails />} />
              <Route path="/admin/drivers/:driverId/bookings" element={<DriverBookings />} />
              <Route path="/admin/bookings" element={<AllBookings />} />
              <Route path="/admin/bookings/:bookingId" element={<BookingDetails />} />
              <Route path="/admin/cabs" element={<ManageCabs />} />
              <Route path="/admin/cabs/:cabId" element={<AdminCabDetails />} />

              <Route path="/admin/profile" element={<AdminProfile />} />
              <Route path="/admin/change-password" element={<ChangePassword />} />
            </Route>

          </Route>
        </Route>
      </Routes>
    </>
  );
}


export default App;
