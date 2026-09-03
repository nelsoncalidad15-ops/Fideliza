import React, { useEffect, useMemo, useState } from 'react';
import { Cake, CalendarDays, MessageSquare, Phone, Search, X } from 'lucide-react';
import { Advisor, Customer } from '../types';
import { buildTelLink, calculateAgeInMonths } from '../utils/communication';

interface AgendaViewProps {
  customers: Customer[];
  advisors: Advisor[];
  selectedAdvisorId: string;
  setSelectedAdvisorId: (id: string) => void;
  onSelectCustomer: (c: Customer) => void;
  onOpenManagementModal: (c: Customer) => void;
  onOpenWhatsAppModal: (c: Customer) => void;
  initialTab?: AgendaTab;
  canFilterAdvisors?: boolean;
  activeModule?: 'ventas' | 'postventa';
}

type AgendaTab = 'hoy' | 'pendientes' | 'proximos' | 'cumpleanos' | 'renovacion' | 'postventa' | 'todos';

const statusClass = (state: string) => {
  if (state === 'Pendiente' || state === 'No respondió') return 'status status--pending';
  if (state === 'Interesado' || state === 'Potencial renovación') return 'status status--positive';
  if (state === 'Renovado') return 'status status--renewed';
  return 'status';
};

export const AgendaView: React.FC<AgendaViewProps> = ({
  customers,
  advisors,
  selectedAdvisorId,
  setSelectedAdvisorId,
  onSelectCustomer,
  onOpenManagementModal,
  onOpenWhatsAppModal,
  initialTab = 'hoy',
  canFilterAdvisors = true,
  activeModule = 'ventas',
}) => {
  const [activeTab, setActiveTab] = useState<AgendaTab>(initialTab);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const selectedAdvisor = advisors.find(a => a.id === selectedAdvisorId);

  useEffect(() => {
    if (activeModule === 'ventas' && activeTab === 'postventa') {
      setActiveTab('hoy');
    }
  }, [activeModule, activeTab]);

  const visibleAdvisors = useMemo(() => {
    if (activeModule === 'ventas') {
      return advisors.filter(a => a.role !== 'Asesor de Servicio Postventa');
    }
    if (activeModule === 'postventa') {
      return advisors.filter(a => a.role === 'Asesor de Servicio Postventa' || a.role === 'Gerencia' || a.role === 'Jefe de Ventas');
    }
    return advisors;
  }, [advisors, activeModule]);

  const advisorCustomers = useMemo(() => customers.filter(customer => {
    if (activeModule === 'ventas' && customer.category === 'Postventa') return false;
    if (activeModule === 'postventa' && customer.category === 'Ventas') return false;
    if (selectedAdvisorId === 'todos' || !selectedAdvisor) return true;
    const advisorName = selectedAdvisor.name.toLowerCase();
    const assignedName = customer.advisor.toLowerCase();
    return assignedName.includes(advisorName) || advisorName.includes(assignedName);
  }), [customers, selectedAdvisorId, selectedAdvisor, activeModule]);

  const isCustomerBirthdayThisMonth = (customer: Customer): boolean => {
    if (customer.contactReason === 'Cumpleaños' || customer.tags?.some(t => t.toLowerCase().includes('cumpleaños'))) {
      return true;
    }
    if (!customer.birthDate) return false;
    const parts = customer.birthDate.split(/[-/]/);
    if (parts.length >= 2) {
      const month = parseInt(parts[1], 10);
      const currentMonth = new Date().getMonth() + 1;
      return month === currentMonth;
    }
    return false;
  };

  const belongsTo = (customer: Customer, tab: AgendaTab) => {
    const isBirthday = isCustomerBirthdayThisMonth(customer);
    const scheduledToday = customer.nextScheduledContact === new Date().toISOString().slice(0, 10) || 
      customer.nextScheduledContact?.toLowerCase().includes('hoy');
    
    // Es de renovación si su estado o motivo indican ventana de cambio de unidad
    const isRenovation = customer.state === 'Potencial renovación' || 
      customer.state === 'Renovado' || 
      customer.contactReason?.toLowerCase().includes('renovación') || 
      customer.contactReason?.toLowerCase().includes('renovacion');

    if (tab === 'hoy') return scheduledToday;
    if (tab === 'cumpleanos') return isBirthday;
    if (tab === 'proximos') return Boolean(customer.nextScheduledContact) && !scheduledToday;
    if (tab === 'renovacion') return isRenovation && !isBirthday && !scheduledToday;
    if (tab === 'pendientes') return !isRenovation && !isBirthday && !scheduledToday && (customer.state === 'Pendiente' || customer.state === 'No respondió');
    if (tab === 'postventa') return customer.category === 'Postventa' || customer.category === 'Ambos';
    return true; // 'todos'
  };

  const counts = useMemo(() => ({
    hoy: advisorCustomers.filter(c => belongsTo(c, 'hoy')).length,
    pendientes: advisorCustomers.filter(c => belongsTo(c, 'pendientes')).length,
    proximos: advisorCustomers.filter(c => belongsTo(c, 'proximos')).length,
    cumpleanos: advisorCustomers.filter(c => belongsTo(c, 'cumpleanos')).length,
    renovacion: advisorCustomers.filter(c => belongsTo(c, 'renovacion')).length,
    postventa: advisorCustomers.filter(c => belongsTo(c, 'postventa')).length,
    todos: advisorCustomers.length,
  }), [advisorCustomers]);

  const filteredCustomers = useMemo(() => advisorCustomers.filter(customer => {
    if (!belongsTo(customer, activeTab)) return false;
    if (statusFilter === 'pendiente' && !['Pendiente', 'No respondió'].includes(customer.state)) return false;
    if (statusFilter === 'gestionado' && !['Contactado', 'Interesado', 'Renovado'].includes(customer.state)) return false;
    if (!search.trim()) return true;
    const value = search.toLowerCase();
    return [customer.fullName, customer.docNumber, customer.licensePlate, customer.vehicleModel, customer.phone]
      .some(field => field?.toLowerCase().includes(value));
  }), [advisorCustomers, activeTab, statusFilter, search]);

  const tabs: Array<{ id: AgendaTab; label: string; count: number }> = useMemo(() => {
    if (activeModule === 'postventa') {
      return [
        { id: 'hoy', label: 'Hoy', count: counts.hoy },
        { id: 'pendientes', label: 'Pendientes', count: counts.pendientes },
        { id: 'proximos', label: 'Próximos', count: counts.proximos },
        { id: 'postventa', label: 'Postventa', count: counts.postventa },
        { id: 'todos', label: 'Todos', count: counts.todos },
      ];
    }
    return [
      { id: 'hoy', label: 'Hoy', count: counts.hoy },
      { id: 'pendientes', label: 'Pendientes', count: counts.pendientes },
      { id: 'proximos', label: 'Próximos', count: counts.proximos },
      { id: 'renovacion', label: 'Renovación', count: counts.renovacion },
      { id: 'cumpleanos', label: 'Cumpleaños', count: counts.cumpleanos },
      { id: 'todos', label: 'Todos', count: counts.todos },
    ];
  }, [activeModule, counts]);

  return (
    <div className="staff-view agenda-view">
      <header className="screen-header">
        <div className="screen-header__title">
          <span className="screen-header__icon"><CalendarDays /></span>
          <div>
            <div className="flex items-center gap-2.5">
              <h1>Agenda diaria</h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-bold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Sincronizado
              </span>
            </div>
            <p>{new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
        </div>
        <div className="screen-toolbar">
          <label className="compact-search">
            <Search />
            <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar cliente, auto o teléfono" />
            {search && <button onClick={() => setSearch('')} aria-label="Limpiar búsqueda"><X /></button>}
          </label>
          {canFilterAdvisors && <select value={selectedAdvisorId} onChange={event => setSelectedAdvisorId(event.target.value)} aria-label="Filtrar por asesor">
            <option value="todos">Todos los asesores</option>
            {visibleAdvisors.map(advisor => <option key={advisor.id} value={advisor.id}>{advisor.name.replace('Direccion - ', '')}</option>)}
          </select>}
        </div>
      </header>

      <section className="agenda-filters" aria-label="Filtros de agenda">
        <div className="agenda-tabs">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={activeTab === tab.id ? 'is-active' : ''}>
              <span>{tab.label}</span><strong>{tab.count}</strong>
            </button>
          ))}
        </div>
        <select value={statusFilter} onChange={event => setStatusFilter(event.target.value)} aria-label="Filtrar por estado">
          <option value="todos">Todos los estados</option>
          <option value="pendiente">Pendientes</option>
          <option value="gestionado">Gestionados</option>
        </select>
      </section>

      <section className="agenda-list">
        <div className="agenda-list__head">
          <span>Cliente</span><span>Vehículo</span><span>Motivo</span><span>Estado</span><span>Acciones</span>
        </div>
        {filteredCustomers.length === 0 ? (
          <div className="empty-state"><CalendarDays /><strong>Sin contactos en esta vista</strong><span>Probá con otro filtro o búsqueda.</span></div>
        ) : filteredCustomers.map(customer => {
          const isBirthday = belongsTo(customer, 'cumpleanos');
          return (
            <article key={customer.id} className="agenda-row">
              <button className="agenda-row__client" onClick={() => onSelectCustomer(customer)}>
                <strong>{customer.fullName}</strong>
                <span>DNI {customer.docNumber}</span>
              </button>
              <div className="agenda-row__vehicle">
                <strong>{customer.vehicleModel}</strong>
                <span>{customer.city} · {calculateAgeInMonths(customer.deliveryDate || customer.registrationDate)} meses</span>
              </div>
              <div className="agenda-row__reason">
                <strong>{isBirthday && <Cake />} {isBirthday ? customer.birthDate || 'Cumpleaños' : customer.contactReason}</strong>
                <span>{customer.lastContactDate ? `Último contacto: ${customer.lastContactDate}` : 'Sin contacto previo'}</span>
              </div>
              <div><span className={statusClass(customer.state)}>{customer.state}</span></div>
              <div className="agenda-row__actions">
                <button onClick={() => onOpenWhatsAppModal(customer)} aria-label="Enviar WhatsApp" title="WhatsApp"><MessageSquare /></button>
                <a href={buildTelLink(customer.phone)} aria-label={`Llamar a ${customer.fullName}`} title={customer.phone}><Phone /></a>
                <button className="primary" onClick={() => onOpenManagementModal(customer)}>Registrar</button>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
};
