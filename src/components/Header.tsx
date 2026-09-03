import React from 'react';
import { 
  Home,
  Users, 
  Calendar, 
  Search, 
  Layers, 
  Wrench, 
  Cake, 
  BarChart3, 
  UserCheck, 
  FileCode2, 
  Menu, 
  X,
  Phone,
  MessageSquare,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { Advisor } from '../types';

interface HeaderProps {
  activeModule: 'ventas' | 'postventa';
  setActiveModule: (mod: 'ventas' | 'postventa') => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedAdvisorId: string;
  setSelectedAdvisorId: (id: string) => void;
  advisors: Advisor[];
  onOpenGuideModal: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  pendingTasksCount: number;
  birthdaysCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeModule,
  setActiveModule,
  currentView,
  setCurrentView,
  selectedAdvisorId,
  setSelectedAdvisorId,
  advisors,
  onOpenGuideModal,
  searchQuery,
  setSearchQuery,
  pendingTasksCount,
  birthdaysCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const selectedAdvisor = advisors.find(a => a.id === selectedAdvisorId);

  const navItems = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'agenda', label: 'Agenda Diaria', icon: Calendar, badge: pendingTasksCount },
    { id: 'clientes', label: 'Base Clientes', icon: Users },
    { id: 'campanas', label: 'Campañas', icon: Layers },
    { id: 'cumpleanos', label: 'Cumpleaños & Aniv.', icon: Cake, badge: birthdaysCount },
    { id: 'postventa', label: 'Postventa', icon: Wrench },
    { id: 'asignacion', label: 'Asignación Cartera', icon: UserCheck },
    { id: 'supervision', label: 'Supervisión Jefatura', icon: Sparkles },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-lg">
      {/* Top utility notification / brand bar */}
      <div className="bg-slate-950/80 px-4 py-1.5 border-b border-slate-800/80 text-xs flex flex-wrap items-center justify-between gap-2 text-slate-400">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-medium border border-blue-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
            Autosol S.R.L. · Red Oficial Volkswagen
          </span>
          <span className="hidden md:inline text-slate-400 font-light">
            “La relación con el cliente no termina con la entrega.”
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenGuideModal}
            className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors bg-slate-800/80 hover:bg-slate-800 px-2 py-0.5 rounded border border-slate-700"
            title="Ver documentación técnica de exportación a VS Code y conexión Google Sheets"
          >
            <FileCode2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Guía VS Code & Sheets</span>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Asesor Activo:</span>
            <div className="relative">
              <select 
                value={selectedAdvisorId}
                onChange={(e) => setSelectedAdvisorId(e.target.value)}
                className="bg-slate-900 text-blue-300 text-xs font-semibold py-0.5 pl-2 pr-6 rounded border border-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="todos">Todos los Asesores</option>
                {advisors.map(adv => (
                  <option key={adv.id} value={adv.id}>{adv.name}</option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo Brand matching Autosol Transparente aesthetic */}
          <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => setCurrentView('inicio')}>
            <div className="w-9 h-9 rounded-full border-2 border-white/90 flex items-center justify-center font-bold tracking-tight text-white bg-blue-700 shadow-md">
              <span className="text-sm font-black tracking-tighter">W</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">Autosol</span>
              <span className="text-xs font-extrabold px-2 py-0.5 rounded tracking-wide uppercase bg-blue-600 text-white shadow-sm">
                Fideliza
              </span>
            </div>
          </div>

          {/* Macro-Module Switcher (Ventas / Fidelización vs Postventa / Seguimiento) */}
          <div className="hidden lg:flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/80">
            <button
              onClick={() => {
                setActiveModule('ventas');
                if (currentView === 'postventa') setCurrentView('dashboard');
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeModule === 'ventas'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Ventas / Fidelización</span>
            </button>
            <button
              onClick={() => {
                setActiveModule('postventa');
                setCurrentView('postventa');
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeModule === 'postventa'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Wrench className="w-3.5 h-3.5 text-blue-300" />
              <span>Postventa / Seguimiento</span>
            </button>
          </div>

          {/* Quick Search bar */}
          <div className="flex-1 max-w-xs relative hidden md:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar cliente, patente, chasis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 text-sm text-slate-100 pl-9 pr-3 py-1.5 rounded-lg border border-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Advisor Profile Pill & Mobile Menu Toggle */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 pl-2 pr-3 py-1 rounded-full border border-slate-700/60">
              <img 
                src={selectedAdvisor?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
                alt="Avatar" 
                className="w-6 h-6 rounded-full object-cover border border-blue-400"
              />
              <span className="text-xs font-medium text-slate-200 truncate max-w-[140px]">
                {selectedAdvisor ? selectedAdvisor.name.replace('Direccion - ', '') : 'Vista General'}
              </span>
            </div>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Desktop navigation tabs bar */}
      <div className="hidden lg:block bg-slate-900 border-t border-slate-800/80 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <nav className="flex space-x-1 py-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-600/20 text-blue-400 border-b-2 border-blue-500 font-semibold' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full ml-0.5 animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="text-xs text-slate-400 font-medium">
            Jujuy · Salta · Perico · Ledesma
          </div>
        </div>
      </div>

      {/* Mobile drawer / dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-t border-slate-800 px-4 pt-3 pb-5 space-y-3">
          {/* Mobile search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar cliente, patente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 text-sm text-slate-100 pl-9 pr-3 py-2 rounded-lg border border-slate-700"
            />
          </div>

          {/* Module Switcher Mobile */}
          <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setActiveModule('ventas');
                if (currentView === 'postventa') setCurrentView('dashboard');
              }}
              className={`px-3 py-2 rounded-lg text-xs font-semibold ${
                activeModule === 'ventas' ? 'bg-blue-600 text-white' : 'text-slate-400'
              }`}
            >
              Ventas / Fidelización
            </button>
            <button
              onClick={() => {
                setActiveModule('postventa');
                setCurrentView('postventa');
              }}
              className={`px-3 py-2 rounded-lg text-xs font-semibold ${
                activeModule === 'postventa' ? 'bg-blue-600 text-white' : 'text-slate-400'
              }`}
            >
              Postventa / Taller
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm ${
                    isActive ? 'bg-blue-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                onOpenGuideModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 text-blue-300 py-2 rounded-lg text-xs font-semibold"
            >
              <FileCode2 className="w-4 h-4 text-emerald-400" />
              Ver Guía Técnica VS Code & Sheets
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
