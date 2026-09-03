import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  ShieldCheck, 
  User, 
  Wrench, 
  ArrowRight, 
  CheckCircle2, 
  PhoneCall, 
  Eye, 
  EyeOff,
  Sparkles,
  Building2
} from 'lucide-react';
import { UserRole } from '../types';
import heroBg from '../assets/images/autosol_hero_dealership_1788438299099.jpg';
import suvImage from '../assets/images/volkswagen_suv_blue_1788438319208.jpg';

export interface AuthenticatedUser {
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department: string;
  internalPhone: string;
  dealership: string;
}

interface LoginViewProps {
  onLogin: (user: AuthenticatedUser) => void;
}

export const PRESET_USERS: AuthenticatedUser[] = [
  {
    name: 'Calidad & Gerencia Operativa',
    email: 'calidad.salta@autosol-vw.com.ar',
    role: 'gerencia',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Gerencia General & Telefonía IP',
    internalPhone: 'Troncal 9991',
    dealership: 'Autosol Jujuy & Salta · La Luz SRL'
  },
  {
    name: 'Gimena Caram',
    email: 'gimena.caram@autosol-vw.com.ar',
    role: 'asesor',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'Ventas Especiales & Renovación 0km',
    internalPhone: 'Int. 1106',
    dealership: 'Autosol Jujuy · Salón Central'
  },
  {
    name: 'Luciana Fernández',
    email: 'luciana.fernandez@autosol-vw.com.ar',
    role: 'postventa',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    department: 'Taller Oficial & Servicios Postventa',
    internalPhone: 'Int. 1001',
    dealership: 'Autosol Jujuy · Taller Central'
  }
];

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('calidad.salta@autosol-vw.com.ar');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      // Find matching preset or default to preset
      const user = PRESET_USERS.find(u => u.email.toLowerCase() === email.toLowerCase()) || PRESET_USERS[selectedPresetIndex];
      onLogin(user);
      setIsLoading(false);
    }, 400);
  };

  const handleSelectPreset = (index: number) => {
    setSelectedPresetIndex(index);
    setEmail(PRESET_USERS[index].email);
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center bg-slate-950 overflow-hidden font-sans select-none">
      
      {/* Background Dealership Image with Elegant Gradient Lighting */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 transform scale-105 transition-transform duration-1000 ease-out"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      
      {/* Dark modern gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-900/80" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl mx-4 my-8 grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-slate-800/90 bg-slate-900/80 backdrop-blur-xl">
        
        {/* Left Column: Brand, Dealership Prestige & Visual Showcase */}
        <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-blue-950/40 border-b lg:border-b-0 lg:border-r border-slate-800/90">
          <div>
            {/* Header Logos */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full border-2 border-white/90 flex items-center justify-center font-bold text-white bg-blue-700 shadow-lg">
                <span className="text-base font-black tracking-tighter">W</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black tracking-tight text-white uppercase">AUTOSOL</span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-blue-600 text-white uppercase tracking-wider">
                    GRUPO CENOA
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Concesionario Oficial Volkswagen · Jujuy & Salta</p>
              </div>
            </div>

            {/* Title & Tagline */}
            <div className="mt-8 space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                Sistema Integral de Gestión & Fidelización
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                Plataforma Comercial & Telefonía IP
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed">
                Portal unificado para asesores de venta, recepción de taller oficial y supervisión de calidad. Telefonía en tiempo real y fidelización activa de clientes.
              </p>
            </div>

            {/* Vehicle preview card */}
            <div className="mt-6 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 overflow-hidden relative group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-300">Gama SUV & Pick-Ups 0km</span>
                <span className="text-[10px] font-mono text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800">
                  Taos · Amarok · Nivus
                </span>
              </div>
              <img 
                src={suvImage} 
                alt="Volkswagen SUV" 
                className="w-full h-32 object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
          </div>

          {/* Institutional footer line */}
          <div className="pt-6 border-t border-slate-800/80 mt-6 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span>LA LUZ S.R.L.</span>
            </div>
            <span>Jujuy · Salta · Ledesma · Perico</span>
          </div>
        </div>

        {/* Right Column: Modern Login Form with Fast-Demo Profiles */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between bg-slate-900/60">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Iniciar Sesión</h2>
                <p className="text-xs text-slate-400">Seleccioná tu perfil operativo o ingresá tus credenciales</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Servidor Activo
              </span>
            </div>

            {/* Quick Demo Access Buttons (Filtro por Perfiles) */}
            <div className="mt-6 space-y-2">
              <label className="text-[11px] uppercase font-bold tracking-wider text-slate-400 flex items-center justify-between">
                <span>Acceso Rápido por Perfil (Demo):</span>
                <span className="text-[10px] font-normal text-blue-400">1-clic para probar</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {PRESET_USERS.map((user, idx) => {
                  const isSelected = selectedPresetIndex === idx;
                  const Icon = user.role === 'gerencia' ? ShieldCheck : user.role === 'postventa' ? Wrench : User;
                  return (
                    <button
                      key={user.email}
                      type="button"
                      onClick={() => handleSelectPreset(idx)}
                      className={`
                        p-3 rounded-xl border text-left transition-all relative
                        ${isSelected 
                          ? 'bg-blue-600/20 border-blue-500 shadow-md shadow-blue-500/10' 
                          : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 hover:border-slate-600'}
                      `}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                      </div>
                      <div className="text-xs font-bold text-white truncate">{user.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{user.department}</div>
                      <div className="text-[9px] font-mono text-blue-400 mt-1">{user.internalPhone}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Correo Electrónico Corporativo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@autosol-vw.com.ar"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Contraseña
                  </label>
                  <span className="text-[11px] text-slate-400 hover:text-blue-400 cursor-pointer">
                    ¿Olvidaste tu clave?
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Role Permission Preview */}
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-300">
                    Permisos: <strong>{PRESET_USERS[selectedPresetIndex].role === 'gerencia' ? 'Acceso Total (Telefonía, Ventas, Taller)' : PRESET_USERS[selectedPresetIndex].role === 'asesor' ? 'Agenda & Ventas 0km' : 'Taller & Servicios Postventa'}</strong>
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Filtro Activo</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Ingresando al panel...
                  </span>
                ) : (
                  <>
                    <span>Ingresar a la Plataforma</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 text-center flex items-center justify-center gap-2">
            <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
            <span>Soporte Mesa de Ayuda Sistemas: Int. 9991 · Salta & Jujuy</span>
          </div>
        </div>

      </div>

    </div>
  );
};
