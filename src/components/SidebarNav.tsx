import React, { useState } from 'react';
import { BarChart3, Calendar, History, Home, LogOut, Menu, Megaphone, UserCog, UserRoundCheck, Users, Wrench, X } from 'lucide-react';
import { Advisor, UserRole } from '../types';
import { AuthenticatedUser } from './LoginView';

export const ROLE_PERMISSIONS: Record<UserRole, { label: string; allowedViews: string[] }> = {
  admin: { label: 'Administrador', allowedViews: ['dashboard', 'clientes', 'agenda', 'historial', 'campanas', 'postventa', 'asignacion', 'supervision', 'usuarios', 'inicio'] },
  jefe_ventas: { label: 'Jefe de Ventas', allowedViews: ['dashboard', 'clientes', 'agenda', 'historial', 'asignacion', 'supervision', 'usuarios', 'inicio'] },
  asesor: { label: 'Operario de Ventas', allowedViews: ['agenda', 'historial', 'inicio'] },
  jefe_postventa: { label: 'Jefe de Postventa', allowedViews: ['postventa', 'clientes', 'agenda', 'historial', 'campanas', 'usuarios', 'inicio'] },
  postventa: { label: 'Operario de Postventa', allowedViews: ['postventa', 'agenda', 'historial', 'clientes', 'inicio'] },
  calidad: { label: 'Calidad', allowedViews: ['postventa', 'clientes', 'agenda', 'supervision', 'usuarios', 'inicio'] },
  gerencia: { label: 'Gerencia', allowedViews: ['dashboard', 'clientes', 'agenda', 'historial', 'campanas', 'postventa', 'asignacion', 'supervision', 'usuarios', 'inicio'] },
};

interface SidebarNavProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  selectedAdvisorId: string;
  setSelectedAdvisorId: (id: string) => void;
  advisors: Advisor[];
  onOpenGuideModal: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  pendingTasksCount: number;
  birthdaysCount: number;
  isPinned: boolean;
  setIsPinned: (pinned: boolean | ((prev: boolean) => boolean)) => void;
  currentUser: AuthenticatedUser | null;
  onLogout: () => void;
  activeModule: 'ventas' | 'postventa';
  setActiveModule: (module: 'ventas' | 'postventa') => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  currentView,
  setCurrentView,
  userRole,
  pendingTasksCount,
  currentUser,
  onLogout,
  activeModule,
  setActiveModule,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = userRole === 'admin' || userRole === 'gerencia';
  const isSalesChief = userRole === 'jefe_ventas';
  const isPostSalesChief = userRole === 'jefe_postventa';

  const salesItems = userRole === 'asesor'
    ? [
        { id: 'agenda', label: 'Agenda', icon: Calendar, badge: pendingTasksCount },
        { id: 'historial', label: 'Historial', icon: History },
      ]
    : [
        { id: 'dashboard', label: 'Inicio', icon: Home },
        { id: 'agenda', label: 'Agenda', icon: Calendar, badge: pendingTasksCount },
        { id: 'historial', label: 'Historial', icon: History },
        { id: 'clientes', label: 'Clientes', icon: Users },
        ...((isAdmin || isSalesChief) ? [{ id: 'asignacion', label: 'Asignar clientes', icon: UserRoundCheck }] : []),
        ...((isAdmin || isSalesChief) ? [{ id: 'supervision', label: 'Indicadores', icon: BarChart3 }] : []),
        ...((isAdmin || isSalesChief) ? [{ id: 'usuarios', label: 'Usuarios', icon: UserCog }] : []),
      ];

  const postSalesItems = [
    { id: 'postventa', label: 'Inicio', icon: Wrench },
    { id: 'agenda', label: 'Agenda', icon: Calendar, badge: pendingTasksCount },
    { id: 'clientes', label: 'Clientes', icon: Users },
    ...((isAdmin || isPostSalesChief) ? [{ id: 'campanas', label: 'Campañas', icon: Megaphone }] : []),
    ...((isAdmin || isPostSalesChief) ? [{ id: 'usuarios', label: 'Usuarios', icon: UserCog }] : []),
  ];

  const items = activeModule === 'postventa' ? postSalesItems : salesItems;
  const navigate = (view: string) => { setCurrentView(view); setMobileOpen(false); };
  const changeModule = (module: 'ventas' | 'postventa') => {
    setActiveModule(module);
    navigate(module === 'ventas' ? 'dashboard' : 'postventa');
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between bg-slate-950 px-4 text-white md:hidden">
        <span className="text-sm font-bold">Autosol Fideliza</span>
        <button onClick={() => setMobileOpen(true)} className="rounded-lg p-2 hover:bg-slate-800" aria-label="Abrir menú"><Menu className="h-5 w-5" /></button>
      </header>
      {mobileOpen && <button aria-label="Cerrar menú" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-40 bg-slate-950/45 md:hidden" />}
      <aside className={['staff-sidebar fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-800 bg-slate-950 text-white transition-transform duration-200 md:translate-x-0', mobileOpen ? 'translate-x-0' : '-translate-x-full'].join(' ')}>
        <div className="flex h-16 items-center gap-2 border-b border-slate-800 px-4">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-blue-600 text-xs font-black">W</div>
          <span className="text-sm font-bold">Autosol Fideliza</span>
          <button onClick={() => setMobileOpen(false)} className="ml-auto rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 md:hidden" aria-label="Cerrar menú"><X className="h-4 w-4" /></button>
        </div>

        {isAdmin && (
          <div className="sidebar-modules">
            <button className={activeModule === 'ventas' ? 'is-active' : ''} onClick={() => changeModule('ventas')}>Ventas</button>
            <button className={activeModule === 'postventa' ? 'is-active' : ''} onClick={() => changeModule('postventa')}>Postventa</button>
          </div>
        )}

        <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
          {items.map(item => {
            const Icon = item.icon;
            const active = currentView === item.id;
            return <button key={item.id} onClick={() => navigate(item.id)} className={['flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition', active ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'].join(' ')}>
              <Icon className="h-4 w-4" /><span className="flex-1">{item.label}</span>
              {'badge' in item && item.badge ? <span className={active ? 'rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]' : 'rounded-full bg-slate-800 px-1.5 py-0.5 text-[10px] text-blue-300'}>{item.badge}</span> : null}
            </button>;
          })}
        </nav>
        <div className="border-t border-slate-800 p-3">
          <div className="flex items-center gap-2 px-2 py-2">
            {currentUser?.avatar ? <img src={currentUser.avatar} alt="" className="h-7 w-7 rounded-full object-cover" /> : <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-600 text-[10px] font-black">{currentUser?.name.slice(0, 1)}</span>}
            <span className="min-w-0 flex-1 truncate text-[11px] font-semibold">{currentUser?.name}</span>
            <button onClick={onLogout} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-rose-300" title="Cerrar sesión"><LogOut className="h-4 w-4" /></button>
          </div>
        </div>
      </aside>
    </>
  );
};
