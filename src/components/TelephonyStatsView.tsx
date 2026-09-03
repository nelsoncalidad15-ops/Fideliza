import React, { useState } from 'react';
import { 
  Clock, 
  Headphones, 
  Timer, 
  Calendar, 
  RefreshCw, 
  Download, 
  ArrowUpRight, 
  Filter, 
  TrendingUp,
  Building2,
  Users,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  LineChart, 
  Line 
} from 'recharts';
import { mockDailyMinutesData } from '../data/mockCalls';

interface TelephonyStatsViewProps {
  onNavigateToHistory: () => void;
  currentUserEmail: string;
}

export const TelephonyStatsView: React.FC<TelephonyStatsViewProps> = ({
  onNavigateToHistory,
  currentUserEmail
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'tipo' | 'destino' | 'origen' | 'departamento'>('general');
  const [dateRange, setDateRange] = useState('30d');
  const [callDirection, setCallDirection] = useState('Todas');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const advisorBreakdown = [
    { name: 'Gimena Caram', role: 'Ventas 0km (Int. 1106)', minutes: 8420, calls: 4210, efficiency: '96%' },
    { name: 'Gustavo Cabezas', role: 'Ventas Jujuy (Int. 1102)', minutes: 6950, calls: 3520, efficiency: '94%' },
    { name: 'Luciana Fernández', role: 'Taller & Postventa (Int. 1001)', minutes: 5890, calls: 2980, efficiency: '98%' },
    { name: 'Carolina Mamaní', role: 'Planes de Ahorro (Int. 1108)', minutes: 4210, calls: 2120, efficiency: '91%' },
    { name: 'Central Jujuy Preatendedor', role: 'Troncal 0800 (9991)', minutes: 2154, calls: 1041, efficiency: '99%' },
  ];

  return (
    <div className="staff-view telephony-view font-sans">
      
      {/* Main Header & Controls matching Image 2 */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Telefonía</span>
            </h1>
          </div>

          {/* Date range & Refresh */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-500 font-medium">Fecha:</span>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="30d">Últimos 30 días</option>
                <option value="7d">Últimos 7 días</option>
                <option value="today">Hoy</option>
              </select>
            </div>

            <button
              onClick={handleRefresh}
              className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refrescar</span>
            </button>

            <button
              onClick={onNavigateToHistory}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Ver Historial
            </button>
          </div>
        </div>

        {/* Tab Navigation matching Image 2 */}
        <div className="flex flex-wrap items-center gap-1 pt-2 border-t border-slate-100 text-xs">
          {[
            { id: 'general', label: 'General' },
            { id: 'origen', label: 'Por origen / Asesor' },
            { id: 'destino', label: 'Por destino' },
            { id: 'tipo', label: 'Por tipo' },
            { id: 'departamento', label: 'Por departamento' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3 Metric Cards (Pixel-accurate matching Image 2) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Minutos totales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Minutos totales
            </span>
            <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              27.624
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>+14.2% vs mes anterior</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Llamadas totales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Llamadas totales
            </span>
            <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              13.871
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>88.4% tasa de efectividad</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <Headphones className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Duración media de llamada */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Duración media de llamada
            </span>
            <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              00:02:11
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              Óptimo para sondeo y turnos
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <Timer className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Direction filter bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">Dirección de llamada:</span>
          <select
            value={callDirection}
            onChange={(e) => setCallDirection(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold py-1 px-3 rounded-xl focus:outline-none"
          >
            <option value="Todas">Todas las direcciones</option>
            <option value="Saliente">Solo Salientes (Comerciales)</option>
            <option value="Entrante">Solo Entrantes (Recepción/Taller)</option>
          </select>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Última sincronización con central Anura: <strong>Hoy 09:47:20</strong>
        </div>
      </div>

      {/* Main Interactive Spline Chart (Accurately recreating curve from Image 2) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Evolución de Minutos Hablados por Día</h3>
            <p className="text-xs text-slate-500">Curva de tráfico telefónico acumulado (del 4 de Agosto al 3 de Septiembre)</p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 font-bold text-slate-700">
              <span className="w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow-xs"></span>
              Minutos
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockDailyMinutesData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                tickLine={false} 
                stroke="#64748b" 
                fontSize={11}
                dy={5}
              />
              <YAxis 
                tickLine={false} 
                stroke="#64748b" 
                fontSize={11}
                domain={[0, 2500]}
                ticks={[0, 500, 1000, 1500, 2000, 2500]}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-950 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs space-y-1">
                        <div className="font-bold text-blue-400">Día {label}</div>
                        <div>Minutos hablados: <strong className="font-mono text-white">{payload[0].value} min</strong></div>
                        <div className="text-[10px] text-slate-400">Total llamadas: {payload[0].payload.llamadas}</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="minutos" 
                stroke="#2563eb" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#colorMinutes)" 
                dot={{ r: 4, stroke: '#2563eb', strokeWidth: 2, fill: '#ffffff' }}
                activeDot={{ r: 6, fill: '#1d4ed8' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Breakdown by Advisor & Branch (Sinergia Total de Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Table: Desglose por Asesor */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Rendimiento por Asesor / Operador</span>
            </h4>
            <span className="text-[11px] font-bold text-blue-600">Top Producción</span>
          </div>

          <div className="divide-y divide-slate-100">
            {advisorBreakdown.map((adv) => (
              <div key={adv.name} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-800">{adv.name}</div>
                  <div className="text-[10px] text-slate-400">{adv.role}</div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-slate-900">{adv.minutes.toLocaleString()} min</div>
                  <div className="text-[10px] text-slate-500">{adv.calls.toLocaleString()} llamadas · <span className="text-emerald-600 font-semibold">{adv.efficiency}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card: Sucursales y Consumo */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-600" />
              <span>Distribución por Sucursal Autosol</span>
            </h4>
            <span className="text-[11px] text-slate-400 font-mono">Total $107.921,83</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-800">Casa Central Jujuy (Av. Savio)</span>
                <span className="font-mono text-slate-600">54% (14.916 min)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '54%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-800">Sucursal Salta (Av. Paraguay)</span>
                <span className="font-mono text-slate-600">32% (8.839 min)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-full rounded-full" style={{ width: '32%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-800">Sucursal Libertador Gral. San Martín (Ledesma)</span>
                <span className="font-mono text-slate-600">8% (2.210 min)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: '8%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-800">Sucursal Perico</span>
                <span className="font-mono text-slate-600">6% (1.659 min)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '6%' }} />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Troncal E1 / SIP Trunking Dedicado</span>
            <span className="font-bold text-emerald-600">99.98% Uptime</span>
          </div>
        </div>

      </div>

    </div>
  );
};
