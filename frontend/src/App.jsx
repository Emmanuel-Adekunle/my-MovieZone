// Importing necessary modules and components
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navigation from "./pages/Auth/Navigation";

// App component
const App = () => {
  return (
    <>
      {/* ToastContainer to display toast notifications */}
      <ToastContainer />
      {/* Navigation component for the app's navigation bar */}
      <Navigation />
      <main className="py-3">
        {/* Outlet component to render matched child routes */}
        <Outlet />
      </main>
    </>
  );
};

export default App;
