import { createRoot } from 'react-dom/client'
import "./style/global.css";
import { AuthProvider } from './contexts/auth.jsx';
import AppRoutes from './routes/app-routes.jsx';

createRoot(document.getElementById('root')).render(
   <AuthProvider>
      <AppRoutes />
   </AuthProvider>
)
