import { LocationProvider } from './components/LocationContext.jsx';
import MainPage from './pages/MainPage.jsx';

export default function App() {
  return (
    <LocationProvider>
      <MainPage />
    </LocationProvider>
  );
}
