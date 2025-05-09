import React from 'react';
import { FaUser, FaCog, FaBell, FaLock, FaChevronRight } from 'react-icons/fa';

const MenuItem = ({ icon, title, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`
      flex items-center justify-between w-full px-4 py-3 mb-2 rounded-md transition-colors
      ${active ? 'bg-gray-100 font-semibold' : ''}
      text-gray-900 hover:bg-gray-200
    `}
  >
    <div className="flex items-center gap-3">
      <span className={active ? 'text-blue-600' : 'text-gray-500'}>
        {icon}
      </span>
      <span>{title}</span>
    </div>
    <FaChevronRight className="text-xs opacity-70" />
  </button>
);

export const Sidebar = ({ selected, setSelected }) => (
  <div className="w-72 p-6 shadow-md border-r bg-white border-gray-200">
    <h2 className="text-2xl font-semibold mb-8 pb-4 border-b border-gray-200">
      Settings
    </h2>
    <nav>
      <MenuItem 
        icon={<FaUser />} 
        title="Profile" 
        active={selected === 'profile'} 
        onClick={() => setSelected('profile')}
      />
      <MenuItem 
        icon={<FaCog />} 
        title="Account" 
        active={selected === 'account'} 
        onClick={() => setSelected('account')}
      />
      <MenuItem 
        icon={<FaLock />} 
        title="Security" 
        active={selected === 'security'} 
        onClick={() => setSelected('security')}
      />
    </nav>
  </div>
);