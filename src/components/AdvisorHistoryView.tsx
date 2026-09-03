import React, { useState, useMemo } from 'react';
import { 
  History, 
  Search, 
  MessageSquare, 
  Phone, 
  Mail, 
  Users, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Car, 
  TrendingUp,
  Award,
  X,
  PlusCircle
} from 'lucide-react';
import { Customer, Advisor, ContactChannel, ManagementResult } from '../types';
import { AuthenticatedUser } from './LoginView';
import { buildTelLink } from '../utils/communication';

interface AdvisorHistoryViewProps {
  customers: Customer[];
  advisors: Advisor[];
  currentUser: AuthenticatedUser | null;
  selectedAdvisorId: string;
  onSelectCustomer: (c: Customer) => void;
  onOpenManagementModal: (c: Customer) => void;
  onOpenWhatsAppModal: (c: Customer) => void;
}

interface FlatHistoryEntry {
  id: string;
  date: string;
  channel: ContactChannel;
  result: ManagementResult;
  notes: string;
  detectedInterest?: string;
  nextFollowUpDate?: string;
  advisorName: string;
  customer: Customer;
}

const normalize = (str: string) => str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/direccion\s*-|lic\./gi, '').trim();

const channelBadge = (channel: ContactChannel) => {
  switch (channel) {
    case 'WhatsApp':
      return { icon: MessageSquare, bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    case 'Llamada':
      return { icon: Phone, bg: 'bg-blue-50 text-blue-700 border-blue-200' };
    case 'Mail':
      return { icon: Mail, bg: 'bg-purple-50 text-purple-700 border-purple-200' };
    case 'Presencial':
    default:
      return { icon: Users, bg: 'bg-slate-100 text-slate-700 border-slate-200' };
  }
};

const resultBadge = (result: ManagementResult) => {
  if (result === 'Renovado') return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
  if (['Interesado', 'Quiere cotización', 'Quiere entregar usado', 'Interesado en financiación'].includes(result)) {
    return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold';
  }
  if (result === 'Contactado') return 'bg-blue-100 text-blue-800 border-blue-300';
  if (result === 'No respondió') return 'bg-amber-50 text-amber-800 border-amber-200';
  if (['Volver a contactar', 'Seguimiento postventa', 'No contactar hasta'].includes(result)) {
    return 'bg-violet-100 text-violet-800 border-violet-300';
  }
  return 'bg-slate-100 text-slate-700 border-slate-200';
};

export const AdvisorHistoryView: React.FC<AdvisorHistoryViewProps> = ({
  customers,
  advisors,
  currentUser,
  selectedAdvisorId,
  onSelectCustomer,
  onOpenManagementModal,
  onOpenWhatsAppModal,
}) => {
  const [search, setSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState<string>('todos');
  const [resultFilter, setResultFilter] = useState<string>('todos');
  const [timeFilter, setTimeFilter] = useState<'todos' | 'hoy' | 'semana'>('todos');

  const activeAdvisor = advisors.find(a => a.id === selectedAdvisorId);

  // Flatten and filter history entries
  const allEntries = useMemo(() => {
    const list: FlatHistoryEntry[] = [];
    customers.forEach(customer => {
      customer.history.forEach(h => {
        list.push({
          id: h.id,
          date: h.date,
          channel: h.channel,
          result: h.result,
          notes: h.notes,
          detectedInterest: h.detectedInterest,
          nextFollowUpDate: h.nextFollowUpDate,
          advisorName: h.advisorName || customer.advisor,
          customer,
        });
      });
    });
    return list;
  }, [customers]);

  // Filter entries according to advisor role & selected advisor
  const advisorEntries = useMemo(() => {
    if (!currentUser) return allEntries;

    // If user is a sales advisor (operario), only show their own gestiones
    if (currentUser.role === 'asesor') {
      const userKey = normalize(currentUser.name);
      return allEntries.filter(e => {
        const advName = normalize(e.advisorName);
        const custAdv = normalize(e.customer.advisor);
        return advName.includes(userKey) || userKey.includes(advName) || custAdv.includes(userKey) || userKey.includes(custAdv);
      });
    }

    // For managers/admins: filter by selected advisor if not 'todos'
    if (selectedAdvisorId !== 'todos' && activeAdvisor) {
      const advKey = normalize(activeAdvisor.name);
      return allEntries.filter(e => {
        const advName = normalize(e.advisorName);
        const custAdv = normalize(e.customer.advisor);
        return advName.includes(advKey) || advKey.includes(advName) || custAdv.includes(advKey) || advKey.includes(custAdv);
      });
    }

    return allEntries;
  }, [allEntries, currentUser, selectedAdvisorId, activeAdvisor]);

  // Today string representation in es-AR
  const todayStr = useMemo(() => new Date().toLocaleDateString('es-AR'), []);

  // Filtered by UI controls
  const filteredEntries = useMemo(() => {
    return advisorEntries.filter(entry => {
      // Channel
      if (channelFilter !== 'todos' && entry.channel !== channelFilter) return false;

      // Result
      if (resultFilter !== 'todos' && entry.result !== resultFilter) return false;

      // Time
      if (timeFilter === 'hoy') {
        const isToday = entry.date.includes(todayStr) || entry.date.toLowerCase().includes('hoy');
        if (!isToday) return false;
      }

      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchCustomer = entry.customer.fullName.toLowerCase().includes(q);
        const matchPlate = entry.customer.licensePlate.toLowerCase().includes(q);
        const matchVehicle = entry.customer.vehicleModel.toLowerCase().includes(q);
        const matchNotes = entry.notes?.toLowerCase().includes(q);
        const matchPhone = entry.customer.phone.includes(q);
        if (!matchCustomer && !matchPlate && !matchVehicle && !matchNotes && !matchPhone) {
          return false;
        }
      }

      return true;
    });
  }, [advisorEntries, channelFilter, resultFilter, timeFilter, search, todayStr]);

  // Metric summaries
  const stats = useMemo(() => {
    const total = advisorEntries.length;
    const todayCount = advisorEntries.filter(e => e.date.includes(todayStr) || e.date.toLowerCase().includes('hoy')).length;
    const interestedCount = advisorEntries.filter(e => ['Interesado', 'Quiere cotización', 'Quiere entregar usado', 'Interesado en financiación'].includes(e.result)).length;
    const renewedCount = advisorEntries.filter(e => e.result === 'Renovado').length;
    return { total, todayCount, interestedCount, renewedCount };
  }, [advisorEntries, todayStr]);

  return (
    <div className="staff-view history-view font-sans">
      {/* Header */}
      <header className="screen-header">
        <div className="screen-header__title">
          <span className="screen-header__icon">
            <History />
          </span>
          <div>
            <h1>Historial de gestiones</h1>
            <p>
              {currentUser?.role === 'asesor' 
                ? `Registro de contactos y llamados realizados por ${currentUser.name}`
                : 'Registro general de interacciones y gestiones comerciales'}
            </p>
          </div>
        </div>

        <div className="screen-toolbar">
          <label className="compact-search">
            <Search />
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Buscar cliente, patente o notas..." 
            />
            {search && <button onClick={() => setSearch('')} aria-label="Limpiar"><X className="w-3.5 h-3.5" /></button>}
          </label>
        </div>
      </header>

      {/* KPI Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span>Total Gestiones</span>
            <History className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.total}</div>
          <p className="text-[10px] text-slate-500">Contactos registrados</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span>Gestiones Hoy</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{stats.todayCount}</div>
          <p className="text-[10px] text-slate-500">Realizadas hoy en tu turno</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span>Oportunidades</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-700">{stats.interestedCount}</div>
          <p className="text-[10px] text-slate-500">Clientes con interés activo</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span>Renovados 0km ★</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">{stats.renewedCount}</div>
          <p className="text-[10px] text-slate-500">Unidades renovadas</p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Time Filter */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => setTimeFilter('todos')}
              className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition ${timeFilter === 'todos' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Todo
            </button>
            <button
              onClick={() => setTimeFilter('hoy')}
              className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition ${timeFilter === 'hoy' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Hoy ({stats.todayCount})
            </button>
          </div>

          {/* Channel Filter */}
          <select 
            value={channelFilter} 
            onChange={e => setChannelFilter(e.target.value)}
            className="h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-semibold text-xs outline-none"
          >
            <option value="todos">Todos los canales</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Llamada">Llamada telefónica</option>
            <option value="Mail">Correo electrónico</option>
            <option value="Presencial">Presencial en sucursal</option>
          </select>

          {/* Result Filter */}
          <select 
            value={resultFilter} 
            onChange={e => setResultFilter(e.target.value)}
            className="h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-semibold text-xs outline-none"
          >
            <option value="todos">Todos los resultados</option>
            <option value="Contactado">Contactado</option>
            <option value="Interesado">Interesado</option>
            <option value="Quiere cotización">Quiere cotización</option>
            <option value="Quiere entregar usado">Quiere entregar usado</option>
            <option value="Interesado en financiación">Interesado en financiación</option>
            <option value="Renovado">Renovado 0km</option>
            <option value="No respondió">No respondió</option>
            <option value="Volver a contactar">Volver a contactar</option>
          </select>
        </div>

        <div className="text-[11px] font-bold text-slate-500">
          Mostrando {filteredEntries.length} de {advisorEntries.length} gestiones
        </div>
      </section>

      {/* Timeline / History List */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredEntries.length === 0 ? (
          <div className="py-16 text-center px-4">
            <History className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">No hay gestiones registradas con estos filtros</p>
            <p className="text-xs text-slate-400 mt-1">Los contactos que realices en la agenda se guardarán automáticamente aquí.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredEntries.map(entry => {
              const { icon: ChannelIcon, bg: channelBg } = channelBadge(entry.channel);
              return (
                <article key={entry.id} className="p-4 sm:p-5 hover:bg-slate-50/70 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left info: Customer & Vehicle */}
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-bold ${channelBg}`}>
                        <ChannelIcon className="w-3.5 h-3.5" />
                        {entry.channel}
                      </span>

                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-[11px] ${resultBadge(entry.result)}`}>
                        {entry.result}
                      </span>

                      <span className="text-xs text-slate-400 font-mono">
                        {entry.date}
                      </span>

                      {entry.advisorName && (
                        <span className="text-[11px] text-slate-400 font-medium">
                          · Asesor: <strong className="text-slate-600">{entry.advisorName.replace('Direccion - ', '')}</strong>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onSelectCustomer(entry.customer)}
                        className="text-sm font-bold text-slate-900 hover:text-blue-600 transition text-left"
                      >
                        {entry.customer.fullName}
                      </button>
                      <span className="text-xs text-slate-400">· {entry.customer.city}</span>
                      <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                        {entry.customer.licensePlate}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <Car className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{entry.customer.vehicleModel}</span>
                    </div>

                    {entry.notes && (
                      <div className="mt-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-700 leading-relaxed font-normal">
                        <strong className="font-semibold text-slate-900">Observación: </strong>
                        {entry.notes}
                      </div>
                    )}

                    {entry.nextFollowUpDate && (
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-full border border-violet-200">
                        <Calendar className="w-3 h-3" />
                        Próximo contacto programado: {entry.nextFollowUpDate}
                      </div>
                    )}
                  </div>

                  {/* Right actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => onOpenWhatsAppModal(entry.customer)}
                      title="Enviar WhatsApp"
                      className="p-2 rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>

                    <a
                      href={buildTelLink(entry.customer.phone)}
                      title={`Llamar a ${entry.customer.fullName}`}
                      className="p-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition"
                    >
                      <Phone className="w-4 h-4" />
                    </a>

                    <button
                      onClick={() => onOpenManagementModal(entry.customer)}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs flex items-center gap-1.5 transition"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      Nueva gestión
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
