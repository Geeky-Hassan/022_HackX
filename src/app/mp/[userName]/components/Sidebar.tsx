import Link from "next/link";
import { User, LogOut, Bolt } from "lucide-react";

const SIDEBAR_ITEMS = [
  {
    icon: User,
    label: "My Profile",
    href: null,
    isActive: true,
  },
  {
    icon: Bolt,
    label: "Settings",
    href: "/mp/settings",
    isActive: false,
  },
] as const;

interface SidebarProps {
  userName: string;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const Sidebar = ({ userName, isOpen, onClose, onLogout }: SidebarProps) => {
  const sidebarClasses = `
    fixed md:relative
    md:w-[20vw] w-[260px]
    bg-gradient-to-b from-logo-primary-gradient to-logo-primary
    bg-dark-text-hover text-white p-5
    h-full
    flex flex-col justify-between
    rounded-xl
    transition-transform duration-300
    md:translate-x-0 overflow-hidden
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    z-40
    top-0
    left-0
  `
    .replace(/\s+/g, " ")
    .trim();

  const renderSidebarItem = (item: (typeof SIDEBAR_ITEMS)[number], index: number) => {
    const itemClasses = `
      flex items-center gap-2 relative px-2 py-2 rounded-lg transition-colors duration-200
      ${item.isActive ? "bg-white/10" : "hover:bg-white/5"}
    `
      .replace(/\s+/g, " ")
      .trim();

    const content = (
      <>
        <item.icon className="size-5 flex-shrink-0" />
        <span className="text-base">{item.label}</span>
      </>
    );

    return (
      <li key={index} className={itemClasses}>
        <Link href={item.label === "My Profile" ? `/mp/${userName}` : item.href} className="flex items-center gap-2 w-full" onClick={onClose}>
          {content}
        </Link>
      </li>
    );
  };

  return (
    <aside className="md:p-2 h-screen overflow-hidden">
      <div className={sidebarClasses}>
        {/* Header Section */}
        <div className="mt-[3.5rem] space-y-8">
          <header>
            <h2 className="text-xl font-medium mb-1">Welcome, {userName}</h2>
            <p className="text-sm text-white/70">Manage your MyPath account</p>
          </header>

          {/* Navigation */}
          <nav>
            <ul className="space-y-2">{SIDEBAR_ITEMS.map(renderSidebarItem)}</ul>
          </nav>
        </div>

        {/* Logout Section */}
        <div className="mb-6">
          <button
            onClick={onLogout}
            className="group flex w-full items-center gap-2 rounded-lg bg-white/10 px-2 py-2 
                     hover:bg-white transition-colors duration-200"
            role="menuitem"
            aria-label="Log out of account"
          >
            <LogOut className="size-5 flex-shrink-0 group-hover:text-logo-primary transition-colors duration-200" />
            <span className="text-base group-hover:text-logo-primary transition-colors duration-200">
              Log Out
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
