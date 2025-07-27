import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import RequestForm from './pages/RequestForm';
import CategoryRequests from './pages/CategoryRequests';
import Requests from './pages/Requests';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import StartProject from './pages/StartProject';
import JoinNetwork from './pages/JoinNetwork';
import RequestView from './pages/RequestView';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/requests" element={<Requests />} />
                <Route path="/request" element={<Requests />} />
                <Route path="/request/:id" element={<RequestView />} />
                <Route path="/category/:category" element={<CategoryRequests />} />
                <Route path="/start-project" element={<StartProject />} />
                <Route path="/join-network" element={<JoinNetwork />} />
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/request-form" element={<ProtectedRoute><RequestForm /></ProtectedRoute>} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
