import { useNavigate } from 'react-router-dom';

const LogoutPage = () => {
  const navigate = useNavigate();  // React Router hook for navigation

  const handleLogout = () => {
    // Clear session data
    localStorage.removeItem('authToken'); // Example: Remove token from localStorage
    sessionStorage.clear(); // Clear session storage if needed
    // Navigate to the login page
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Logout</h1>
      <button
        onClick={handleLogout}
        className="text-blue-500 hover:underline"
      >
        Go to Login
      </button>
    </div>
  );
}

export default LogoutPage;
