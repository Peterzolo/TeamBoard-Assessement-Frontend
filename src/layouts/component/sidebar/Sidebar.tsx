import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  ChevronDown,
  FolderKanban,
  UsersRound,
  Plus,
  CheckSquare,
} from "lucide-react";

interface SidebarItem {
  name: string;
  icon?: React.ReactNode;
  path?: string;
  children?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    path: "/dashboard",
  },
  {
    name: "Team Members",
    icon: <Users size={18} />,
    children: [
      {
        name: "All Members",
        path: "/dashboard/team/list",
        icon: <Users size={16} />,
      },
      {
        name: "Add Member",
        path: "/dashboard/add/member",
        icon: <UserPlus size={16} />,
      },
    ],
  },
  {
    name: "Teams",
    icon: <UsersRound size={18} />,
    children: [
      {
        name: "All Teams",
        path: "/dashboard/teams",
        icon: <UsersRound size={16} />,
      },
      {
        name: "Create Team",
        path: "/dashboard/team/create",
        icon: <UserPlus size={16} />,
      },
    ],
  },
  {
    name: "Projects",
    icon: <FolderKanban size={18} />,
    children: [
      {
        name: "All Projects",
        path: "/dashboard/project/list",
        icon: <FolderKanban size={16} />,
      },
      {
        name: "Create Project",
        path: "/dashboard/project/create",
        icon: <Plus size={16} />,
      },
    ],
  },
  {
    name: "Tasks",
    icon: <CheckSquare size={18} />,
    children: [
      {
        name: "All Tasks",
        path: "/dashboard/task/list",
        icon: <CheckSquare size={16} />,
      },
      {
        name: "Create Task",
        path: "/dashboard/task/create",
        icon: <Plus size={16} />,
      },
    ],
  },
];

interface SidebarProps {
  isSidebarOpen: boolean;
  onSidebarClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  onSidebarClose,
}) => {
  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {}
  );
  const [showTopIndicator, setShowTopIndicator] = useState(false);
  const [showBottomIndicator, setShowBottomIndicator] = useState(false);

  const toggleDropdown = (name: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // Handle scroll events to show/hide indicators
  const handleScroll = (event: React.UIEvent<HTMLElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    setShowTopIndicator(scrollTop > 10);
    setShowBottomIndicator(scrollTop + clientHeight < scrollHeight - 10);
  };

  // Check if path is active
  const isActive = (path?: string) => {
    if (!path) return false;
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  // Check if any child of an item is active
  const hasActiveChild = (item: SidebarItem) => {
    if (!item.children) return false;
    return item.children.some((child) => isActive(child.path));
  };

  return (
    <>
      <div
        className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-gray-50 to-white border-r border-gray-100 z-30 flex flex-col
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0`}
        aria-label="Sidebar"
      >
        {/* Fixed Header */}
        <div className="flex-shrink-0 px-5 py-6 border-b border-gray-100"></div>

        {/* Scrollable Navigation */}
        <div className="flex-1 relative overflow-hidden">
          <nav
            className="h-full overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
            onScroll={handleScroll}
          >
            <div className="space-y-2">
              {sidebarItems.map((item) =>
                item.children ? (
                  <div key={item.name} className="relative group">
                    {/* Parent Button */}
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className={`
                        w-full relative flex items-center justify-between px-3 py-2.5 rounded-md
                        text-sm font-medium transition-all duration-300 ease-out
                        group-hover:translate-x-1
                        ${
                          openDropdowns[item.name] || hasActiveChild(item)
                            ? "text-blue-700 bg-blue-50/50"
                            : "text-gray-700 hover:text-gray-900 hover:bg-gray-50/50"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`
                            flex-shrink-0 transition-all duration-300
                            ${
                              openDropdowns[item.name] || hasActiveChild(item)
                                ? "text-blue-600 scale-110"
                                : "text-gray-500 group-hover:text-gray-700"
                            }
                          `}
                        >
                          {item.icon}
                        </span>
                        <span className="truncate">{item.name}</span>
                      </div>
                      <span
                        className={`
                          flex-shrink-0 transition-all duration-300 ml-2
                          ${
                            openDropdowns[item.name]
                              ? "rotate-180 text-blue-600"
                              : "text-gray-400 group-hover:text-gray-600"
                          }
                        `}
                      >
                        <ChevronDown size={14} />
                      </span>
                    </button>

                    {/* Dropdown Children */}
                    <div
                      className={`
                        overflow-hidden transition-all duration-300 ease-out
                        ${
                          openDropdowns[item.name]
                            ? "max-h-96 opacity-100 mt-1"
                            : "max-h-0 opacity-0"
                        }
                      `}
                    >
                      <div className="ml-9 pl-3 border-l-2 border-gray-200 space-y-0.5 py-1">
                        {item.children.map((child, index) => (
                          <Link
                            key={child.name}
                            to={child.path || "#"}
                            onClick={() => onSidebarClose()}
                            className={`
                              block relative px-3 py-2 rounded-md
                              text-sm transition-all duration-300 ease-out
                              transform hover:translate-x-1
                              ${
                                isActive(child.path)
                                  ? "text-blue-700 font-medium bg-blue-50/70"
                                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/50"
                              }
                            `}
                            style={{
                              animationDelay: `${index * 30}ms`,
                            }}
                          >
                            <div className="flex items-center gap-2.5">
                              <span
                                className={`
                                  flex-shrink-0 transition-all duration-300
                                  ${
                                    isActive(child.path)
                                      ? "text-blue-600"
                                      : "text-gray-400"
                                  }
                                `}
                              >
                                {child.icon}
                              </span>
                              <span className="truncate">{child.name}</span>
                            </div>
                            {/* Active Indicator */}
                            {isActive(child.path) && (
                              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-600 rounded-r-full"></span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    to={item.path || "#"}
                    onClick={() => onSidebarClose()}
                    className={`
                      block relative px-3 py-2.5 rounded-md
                      text-sm font-medium transition-all duration-300 ease-out
                      transform hover:translate-x-1
                      group
                      ${
                        isActive(item.path)
                          ? "text-blue-700 bg-blue-50/50"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-50/50"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`
                          flex-shrink-0 transition-all duration-300
                          ${
                            isActive(item.path)
                              ? "text-blue-600 scale-110"
                              : "text-gray-500 group-hover:text-gray-700"
                          }
                        `}
                      >
                        {item.icon}
                      </span>
                      <span className="truncate">{item.name}</span>
                    </div>
                    {/* Active Indicator Line */}
                    {isActive(item.path) && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full"></span>
                    )}
                  </Link>
                )
              )}
            </div>
          </nav>

          {/* Top Scroll Indicator */}
          {showTopIndicator && (
            <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-gray-50 via-gray-50/80 to-transparent pointer-events-none"></div>
          )}

          {/* Bottom Scroll Indicator */}
          {showBottomIndicator && (
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white via-gray-50/80 to-transparent pointer-events-none"></div>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={onSidebarClose}
          aria-label="Close sidebar overlay"
        />
      )}
    </>
  );
};
