import React, { useState } from 'react';
import { 
  Car, 
  Sparkles, 
  Calendar, 
  Wrench, 
  ShieldCheck, 
  Key, 
  Award, 
  Phone, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  LogOut, 
  FileText,
  CreditCard,
  Gift,
  BadgeCheck,
  AlertCircle
} from 'lucide-react';
import { Customer } from '../types';
import taosBlue from '../assets/images/volkswagen_suv_blue_1788438319208.jpg';

interface CustomerPortalViewProps {
  customer: Customer;
  onLogout: () => void;
  onBackToHome: () => void;
}

export const CustomerPortalView: React.FC<CustomerPortalViewProps> = ({
  customer,
  onLogout,
  onBackToHome,
}) => {
  const [activeTab, setActiveTab] = useState<'resumen' | 'fidelizacion' | 'renovacion' | 'postventa'>('resumen');
  const [isAppointmentRequested, setIsAppointmentRequested] = useState(false);
  const [isTradeInRequested, setIsTradeInRequested] = useState(false);

  // Derive months since delivery
  const estimatedMonths = 24; // Representative standard for Autosol recambio
  const estimatedUsedValue = '$ 28.500.000';

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-900 pb-16 font-sans">
      
      {/* Top Client Bar */}
      <header className="sticky top-0 z-30 bg-slate-950 text-white border-b border-slate-800 shadow-lg px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-black text-white text-xs ring-2 ring-blue-400/40">
            W
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-wider text-blue-400 uppercase">
                Autosol Jujuy & Salta
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                Cliente Verificado
              </span>
            </div>
            <div className="text-sm font-bold text-white leading-tight">
              Espacio Personal · {customer.fullName}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
          >
            Ver Sitio Web
          </button>
          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors flex items-center gap-1.5"
            title="Cerrar sesión de cliente"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        
        {/* Welcome & Vehicle Hero Card */}
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 shadow-2xl border border-slate-800 overflow-hidden">
          
          {/* Subtle light effects */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Col: Customer & Vehicle Info */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Programa de Fidelización Autosol Club</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                ¡Hola, {customer.firstName || customer.fullName.split(' ')[0]}!
              </h1>
              
              <div className="space-y-1">
                <div className="text-xl sm:text-2xl font-black text-sky-400">
                  {customer.vehicleModel}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                  <span className="font-mono bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700 font-bold text-white">
                    Patente: {customer.licensePlate}
                  </span>
                  <span>Chasis: {customer.chassisNumber || '3VVJP6B22TM009948'}</span>
                  <span>Entrega: {customer.deliveryDate || '2024'}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-3">
                <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
                  <div className="text-[11px] text-slate-400">Garantía Oficial</div>
                  <div className="text-sm sm:text-base font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Activa</span>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
                  <div className="text-[11px] text-slate-400">Ciclo Fidelización</div>
                  <div className="text-sm sm:text-base font-bold text-amber-400 flex items-center gap-1 mt-0.5">
                    <Clock className="w-4 h-4" />
                    <span>Mes 24</span>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
                  <div className="text-[11px] text-slate-400">Asesor/a Asignada</div>
                  <div className="text-sm sm:text-base font-bold text-white truncate mt-0.5">
                    {customer.advisor || 'Gimena Caram'}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Car Visual & Floating Badge */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700 aspect-[16/10] w-full max-w-md bg-slate-900">
                <img 
                  src={taosBlue} 
                  alt={customer.vehicleModel} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-blue-300 border border-blue-500/30">
                  Autosol Oficial Jujuy
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* 3 Interactive Pillars: Fidelización · Ventas 0km · Postventa */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* PILLAR 1: FIDELIZACIÓN AUTOSOL */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
                  Pilar 1 · Fidelización
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  Beneficios Exclusivos
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Por ser titular de un Volkswagen en Autosol, tenés acceso a ventajas acumulativas por tu lealtad.
              </p>

              <div className="space-y-2 pt-1 text-xs">
                <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/60 flex items-center gap-2 font-medium text-amber-900">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>15% off en mano de obra oficial</span>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/60 flex items-center gap-2 font-medium text-amber-900">
                  <Gift className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Lavado y revisión en tu mes de aniversario</span>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/60 flex items-center gap-2 font-medium text-amber-900">
                  <BadgeCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Atención prioritaria en taller</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => alert('¡Beneficios activos en tu cuenta! Presentá tu DNI o Patente en nuestra sucursal.')}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow transition-colors flex items-center justify-center gap-2"
              >
                <span>Usar mis beneficios</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* PILLAR 2: VENTAS & RENOVACIÓN 0KM */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                  Pilar 2 · Ventas 0km
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  Plan Llave contra Llave
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Estás en el período óptimo para renovar tu vehículo manteniendo el máximo valor de reventa.
              </p>

              <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-200/80 space-y-1">
                <div className="text-[11px] font-bold text-blue-900">Tasación Estimada de tu Usado:</div>
                <div className="text-xl font-black text-blue-700">{estimatedUsedValue}</div>
                <div className="text-[10px] text-blue-800">
                  Tomamos tu {customer.modelFamily || 'Volkswagen'} y entregás la llave recién el día que retirás tu nuevo 0km.
                </div>
              </div>
            </div>

            <div className="pt-2">
              {isTradeInRequested ? (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs text-center">
                  ✓ Solicitud enviada a tu asesora {customer.advisor}
                </div>
              ) : (
                <button
                  onClick={() => setIsTradeInRequested(true)}
                  className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Pedir Cotización de Renovación</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* PILLAR 3: POSTVENTA & TALLER OFICIAL */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                  Pilar 3 · Postventa Oficial
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  Mantenimiento Programado
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Repuestos 100% legítimos y técnicos certificados por Volkswagen Alemania para cuidar tu inversión.
              </p>

              <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200/70 space-y-1.5 text-xs text-emerald-950">
                <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Próximo Service: 20.000 km / 2do Año</span>
                </div>
                <div className="text-[11px] text-emerald-800">
                  Incluye cambio de aceite sintético oficial, filtros de habitáculo y diagnóstico computarizado.
                </div>
              </div>
            </div>

            <div className="pt-2">
              {isAppointmentRequested ? (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs text-center">
                  ✓ Turno solicitado. Te contactaremos en breve para confirmar el horario.
                </div>
              ) : (
                <button
                  onClick={() => setIsAppointmentRequested(true)}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Agendar Turno de Taller</span>
                  <Calendar className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Advisor Contact Rail */}
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
              {customer.advisor ? customer.advisor[0] : 'G'}
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Tu Asesor/a Personal Autosol
              </div>
              <div className="text-base font-black text-slate-900">
                {customer.advisor || 'Gimena Caram'}
              </div>
              <div className="text-xs text-slate-500">
                Sucursal San Salvador de Jujuy · Ventas y Renovación
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/549388154123456?text=${encodeURIComponent(`Hola, soy ${customer.fullName} titular del ${customer.vehicleModel} patente ${customer.licensePlate}. Quisiera realizar una consulta.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-all flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Directo</span>
            </a>

            <button
              onClick={() => alert(`Llamando a Autosol Jujuy al 0388-4228900 (Interno 1106)`)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 transition-colors flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-blue-600" />
              <span>Llamar al Concesionario</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
