import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import TripsPage from './features/trips/TripsPage';
import VehiclesPage from './features/vehicles/VehiclesPage';

export default function App(): React.ReactElement {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path='/' element={<Navigate to='/trips' replace />} />
          <Route path='/trips' element={<TripsPage />} />
          <Route path='/vehicles' element={<VehiclesPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
