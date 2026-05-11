import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  { path: "/", icon: "", label: "Activity Log", section: "Core" },
  { path: "/history", icon: "", label: "History", section: "Core" },
  { path: "/analytics", icon: "", label: "Analytics", section: "Core" },
  { path: "/skills", icon: "", label: "Skill Store", section: "Growth" },
  { path: "/projects", icon: "", label: "Projects", section: "Growth" },
  { path: "/jobs", icon: "", label: "Job Tracker", section: "Growth" },
];

const settingsItem = { path: "/settings", icon: "⚙️", label: "Settings" };

export default function Sidebar() {
  const location = useLocation();
  let currentSection = "";

  return (
    <nav className="hidden md:flex w-[220px] min-w-[220px] bg-bg-2 border-r border-white/5 flex-col py-5">
      <div className="px-5 pb-6 text-lg font-bold tracking-tight">
        Life<span className="text-accent-2">OS</span>
      </div>

      {navItems.map((item) => {
        const showSection = item.section !== currentSection;
        if (showSection) currentSection = item.section;

        return (
          <div key={item.path}>
            {showSection && (
              <div className="px-3 pb-2 pt-3 first:pt-0 text-[10px] font-semibold tracking-[1.5px] text-text-3 uppercase">
                {item.section}
              </div>
            )}
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-5 py-2.5 text-[13.5px] border-l-2 transition-all duration-150 my-0.5 ${
                  isActive
                    ? "bg-accent/10 text-accent-2 border-l-accent"
                    : "text-text-2 border-l-transparent hover:bg-bg-3 hover:text-text"
                }`
              }
            >
              <span className="w-4 text-center text-[15px]">{item.icon}</span>
              {item.label}
            </NavLink>
          </div>
        );
      })}

      <div className="flex-1" />

      <NavLink
        to={settingsItem.path}
        className={({ isActive }) =>
          `flex items-center gap-2.5 px-5 py-2.5 text-[13.5px] border-l-2 transition-all duration-150 ${
            isActive
              ? "bg-accent/10 text-accent-2 border-l-accent"
              : "text-text-2 border-l-transparent hover:bg-bg-3 hover:text-text"
          }`
        }
      >
        <span className="w-4 text-center text-[15px]">{settingsItem.icon}</span>
        {settingsItem.label}
      </NavLink>
    </nav>
  );
}
