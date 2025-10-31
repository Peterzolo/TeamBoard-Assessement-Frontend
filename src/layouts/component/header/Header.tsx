import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  currentUserDataSelector,
  isAuthenticatedSelector,
} from "../../../app/redux/reducers/auth/selectors/signupSelector";
import { setLogoutRequestStart } from "../../../app/redux/reducers/auth/signUpReducer";

// import { NotificationBell } from "@/app/Components/NotificationBell/NotificationBell";

interface HeaderProps {
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isSidebarOpen,
  onSidebarToggle,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isAuthenticated = useSelector(isAuthenticatedSelector);
  const currentUser = useSelector(currentUserDataSelector);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      // Don't close if clicking on the dropdown menu or its children
      if (showUserMenu && !target.closest(".user-dropdown")) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = () => {
    console.log("Logging out... TRIGGERED");
    dispatch(setLogoutRequestStart());
    setShowUserMenu(false);
  }; // Fixed logout functionality

  const handleProfile = () => {
    navigate("/screens/dashboard/setting");
    setShowUserMenu(false);
  };

  const toggleUserMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowUserMenu(!showUserMenu);
  };

  return (
    <div className="h-[70px] bg-white border-b border-gray-200 px-3 sm:px-4 md:px-6 shadow-sm flex items-center justify-between gap-2 sm:gap-4">
      {/* Left side - Hamburger/Close icon for mobile */}
      <div className="flex items-center min-w-0 flex-1">
        <button
          className="lg:hidden text-gray-600 hover:text-gray-800 focus:outline-none p-2 rounded-md hover:bg-gray-100 transition-colors duration-200 flex-shrink-0"
          onClick={onSidebarToggle}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? (
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>

        {/* Logo and Dashboard Title */}
        <div className="ml-2 sm:ml-4 lg:ml-0 flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
          <img
            src="/images/team-project.png"
            alt="Team Project"
            className="h-8 w-8 sm:h-10 sm:w-auto rounded-md flex-shrink-0 object-cover"
          />
          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-800 truncate">
            Project Management Dashboard
          </h1>
        </div>
      </div>

      {/* Right side - Notifications and User menu */}
      <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-shrink-0">
        {/* Notification Bell */}
        {/* {isAuthenticated && <NotificationBell />} */}

        {/* User Info - Only show on larger screens */}
        {isAuthenticated && currentUser && (
          <div className="hidden lg:flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">
                {currentUser.firstName} {currentUser.lastName}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {currentUser.role || "User"}
              </p>
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white text-sm font-medium">
                {currentUser.firstName?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
          </div>
        )}

        {/* User Menu Button */}
        <div className="relative">
          <button
            onClick={toggleUserMenu}
            className="flex items-center space-x-1 sm:space-x-2 p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="User menu"
          >
            {/* Account Icon for dropdown button */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <span className="hidden md:inline text-sm font-medium text-gray-700">
              Account
            </span>

            {/* Dropdown Arrow */}
            <svg
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 transition-transform duration-200 ${
                showUserMenu ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Enhanced Dropdown Menu - Much wider for mobile */}
          {showUserMenu && (
            <div className="user-dropdown absolute right-0 mt-2 w-[calc(100vw-1rem)] sm:w-80 md:w-96 lg:w-[400px] bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200 animate-in slide-in-from-top-2 duration-200 max-w-[calc(100vw-1rem)] sm:max-w-none">
              {/* User Info Header */}
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {currentUser?.firstName?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {currentUser?.firstName} {currentUser?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 capitalize truncate">
                      {currentUser?.role || "User"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Options */}
              <div className="py-1">
                {/* Profile Option */}
                <button
                  onClick={handleProfile}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 flex items-center space-x-3 transition-colors duration-150"
                >
                  <svg
                    className="w-4 h-4 text-gray-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="flex-1">Profile Settings</span>
                </button>

                {/* Divider */}
                <div className="border-t border-gray-100 my-1"></div>

                {/* Logout Option */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors duration-150"
                >
                  <svg
                    className="w-4 h-4 text-red-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="flex-1">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
