import { useNavigate } from 'react-router-dom';

const LogoutPage = () => {
  const navigate = useNavigate();  // React Router hook for navigation

  const handleLogout = () => {
    // Perform any logout logic, like clearing tokens, user data, etc.
    navigate('/login');  // Redirect to the login page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Logout</h1>
      <p className="text-gray-600 mb-6">You have been logged out successfully.</p>
      <button
        onClick={handleLogout}
        className="text-blue-500 hover:underline mb-4"
      >
        Go to Login
      </button>
      <div className="mt-4">
        <button
          onClick={handleLogout}
          className="text-blue-500 hover:underline"
        >
          Login Again
        </button>
      </div>
    </div>
  );
}

export default LogoutPage;
