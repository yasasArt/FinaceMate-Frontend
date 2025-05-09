import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';

const LogoutPage = () => {
  const navigate = useNavigate();
  const modalRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.clear();
    navigate('/login');
  };

  // Optional: Trap focus inside modal for accessibility
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
      <div
        ref={modalRef}
        tabIndex={-1}
        className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center outline-none"
      >
        <svg
          className="w-16 h-16 text-blue-500 mb-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
          />
        </svg>
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">You are about to logout</h2>
        <p className="text-gray-600 mb-6 text-center">
          Are you sure you want to log out? You will need to log in again to access your account.
        </p>
        <button
          onClick={handleLogout}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow"
        >
          Yes, Log me out
        </button>
      </div>
    </div>
  );
};

export default LogoutPage;
