import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useStore } from "../../store";

const links = [
  { to: "/", label: "Activity" },
  { to: "/history", label: "History" },
  { to: "/analytics", label: "Analytics" },
  { to: "/skills", label: "Skills" },
  { to: "/projects", label: "Projects" },
  { to: "/jobs", label: "Jobs" },
  { to: "/settings", label: "Settings" },
];

export default function Shell() {
  const navigate = useNavigate();
  const setToken = useStore((s) => s.setToken);
  const isAuthenticated = useStore((s) => s.isAuthenticated);

  const handleLogout = () => {
    setToken(null);
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-full bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.12),_transparent_35%),linear-gradient(180deg,_#050507_0%,_#0a0a0f_100%)] text-slate-100">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-300/70">
              LifeOS
            </p>
            <h2 className="text-lg font-semibold text-white">
              Personal operating system
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 sm:inline-flex">
              {isAuthenticated ? "Authenticated" : "Guest"}
            </span>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Logout
              </button>
            ) : null}
          </div>
        </div>

        <nav className="mx-auto flex w-full max-w-6xl gap-2 overflow-x-auto px-4 pb-4 sm:px-6 lg:px-8">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                [
                  "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition",
                  isActive
                    ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-100"
                    : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white",
                ].join(" ")
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
