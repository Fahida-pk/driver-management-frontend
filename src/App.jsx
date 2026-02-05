import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/login";
import Dashboard from "./pages/dashboard/Dashboard";
import Drivers from "./pages/driver/Drivers";
import  Vehicles from "./pages/vehicles/Vehicles";
import TripMaster from "./pages/trip/TripMaster";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* NO SIDEBAR */}
        <Route path="/" element={<Login />} />

        {/* WITH SIDEBAR */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/trips" element={<TripMaster />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
