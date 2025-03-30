import React, { useState } from "react";
import {
  User,
  Settings,
  Bell,
  Lock,
  Palette,
  HelpCircle,
  Mail,
  Phone,
  Edit2,
  Save,
  LogOut,
  CreditCard,
  Shield,
} from "lucide-react";

const SettingsPage = () => {
    const [activeSection, setActiveSection] = useState("profile");
      const [profile, setProfile] = useState({
        name: "Adaline Lively",
        email: "adaline.lively@example.com",
        phone: "+1 (555) 123-4567",
        profileImage: null,
      });
    
      const [editMode, setEditMode] = useState(false);
      const [tempProfile, setTempProfile] = useState({ ...profile });
    
      const sidebarSections = [
        {
          icon: <User className="mr-3" />,
          label: "Profile",
          key: "profile",
        },
        {
          icon: <Settings className="mr-3" />,
          label: "Account Settings",
          key: "account",
        },
        {
          icon: <Bell className="mr-3" />,
          label: "Notifications",
          key: "notifications",
        },
        {
          icon: <Palette className="mr-3" />,
          label: "Appearance",
          key: "appearance",
        },
        {
          icon: <Lock className="mr-3" />,
          label: "Security",
          key: "security",
        },
      ];
    
      const handleProfileUpdate = () => {
        setProfile(tempProfile);
        setEditMode(false);
      };
    
      const renderProfileSection = () => (
        <div className="bg-white rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Profile</h2>
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="text-purple-500 flex items-center"
              >
                <Edit2 className="mr-2" size={18} /> Edit
              </button>
            ) : (
              <button
                onClick={handleProfileUpdate}
                className="text-green-500 flex items-center"
              >
                <Save className="mr-2" size={18} /> Save
              </button>
            )}
          </div>
    
          <div className="flex items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center mr-6">
              <User className="text-purple-500" size={48} />
            </div>
            {!editMode ? (
              <div>
                <h3 className="text-lg font-semibold">{profile.name}</h3>
                <p className="text-gray-500">{profile.email}</p>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  value={tempProfile.name}
                  onChange={(e) =>
                    setTempProfile({ ...tempProfile, name: e.target.value })
                  }
                  className="border rounded-lg p-2 w-full"
                  placeholder="Full Name"
                />
                <input
                  value={tempProfile.email}
                  onChange={(e) =>
                    setTempProfile({ ...tempProfile, email: e.target.value })
                  }
                  className="border rounded-lg p-2 w-full"
                  placeholder="Email Address"
                />
              </div>
            )}
          </div>
    
          {!editMode && (
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="mr-3 text-gray-500" size={20} />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="mr-3 text-gray-500" size={20} />
                <span>{profile.phone}</span>
              </div>
            </div>
          )}
        </div>
      );
    
      const renderHelpSection = () => (
        <div className="bg-white rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold mb-4">Help & Support</h2>
    
          <div className="bg-purple-50 rounded-lg p-4 flex items-center">
            <HelpCircle className="text-purple-500 mr-4" size={32} />
            <div>
              <h3 className="font-semibold">Frequently Asked Questions</h3>
              <p className="text-gray-600 text-sm">
                Find answers to common questions
              </p>
            </div>
          </div>
    
          <div className="bg-green-50 rounded-lg p-4 flex items-center">
            <Mail className="text-green-500 mr-4" size={32} />
            <div>
              <h3 className="font-semibold">Contact Support</h3>
              <p className="text-gray-600 text-sm">
                Get help from our support team
              </p>
            </div>
          </div>
    
          <div className="bg-blue-50 rounded-lg p-4 flex items-center">
            <Shield className="text-blue-500 mr-4" size={32} />
            <div>
              <h3 className="font-semibold">Privacy & Security</h3>
              <p className="text-gray-600 text-sm">
                Learn about our data protection
              </p>
            </div>
          </div>
    
          <div className="bg-orange-50 rounded-lg p-4 flex items-center">
            <CreditCard className="text-orange-500 mr-4" size={32} />
            <div>
              <h3 className="font-semibold">Billing Information</h3>
              <p className="text-gray-600 text-sm">Manage your subscription</p>
            </div>
          </div>
    
          <div className="mt-6 text-center">
            <button className="text-red-500 flex items-center justify-center w-full">
              <LogOut className="mr-2" /> Logout
            </button>
          </div>
        </div>
      );
    
      return (
        <div className="flex bg-gray-50 min-h-screen p-6">
          <div className="w-64 mr-6 space-y-2">
            {sidebarSections.map((section) => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={`w-full text-left p-3 rounded-lg flex items-center ${
                  activeSection === section.key
                    ? "bg-purple-500 text-white"
                    : "hover:bg-purple-100 text-gray-700"
                }`}
              >
                {section.icon}
                {section.label}
              </button>
            ))}
          </div>
    
          <div className="flex-grow">
            {activeSection === "profile" && renderProfileSection()}
            {activeSection === "help" && renderHelpSection()}
          </div>
        </div>
      );
    }

export default SettingsPage;