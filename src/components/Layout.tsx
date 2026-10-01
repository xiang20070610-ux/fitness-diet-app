import type { ReactNode } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { DiceIcon, GearIcon, HomeIcon, UserIcon } from './icons'

function NavItem({ to, icon, label, end }: { to: string; icon: ReactNode; label: string; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors ${
          isActive ? 'text-accent' : 'text-dim hover:text-ink'
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  )
}

export default function Layout() {
  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/5 bg-canvas/80 px-5 py-4 backdrop-blur">
        <NavLink to="/" className="flex items-center gap-2">
          <span className="text-xl">🥗</span>
          <span className="text-base font-bold text-ink">每日食谱</span>
        </NavLink>
        <NavLink to="/settings" className="text-dim transition-colors hover:text-ink">
          <GearIcon size={20} />
        </NavLink>
      </header>

      <main className="flex-1 px-5 pb-28 pt-5">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-1/2 z-20 w-full max-w-md -translate-x-1/2 border-t border-white/5 bg-panel/90 backdrop-blur">
        <div className="grid grid-cols-4">
          <NavItem to="/" icon={<HomeIcon size={20} />} label="今日" end />
          <NavItem to="/result" icon={<DiceIcon size={20} />} label="抽取" />
          <NavItem to="/mine" icon={<UserIcon size={20} />} label="我的" />
          <NavItem to="/settings" icon={<GearIcon size={20} />} label="设置" />
        </div>
      </nav>
    </div>
  )
}
