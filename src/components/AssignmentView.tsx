import React, { useMemo, useState } from 'react';
import { CalendarDays, Check, MapPin, Search, UserRoundCheck, Users } from 'lucide-react';
import { Advisor, Customer } from '../types';
import { calculateAgeInMonths } from '../utils/communication';

interface AssignmentViewProps {
  customers: Customer[];
  advisors: Advisor[];
  onReassignCustomer: (customerId: string, newAdvisorName: string) => void;
  onBulkAssign: (customerIds: string[], advisorName: string, contactDate: string) => void;
  onSelectCustomer: (c: Customer) => void;
}

const advisorMatches = (customer: Customer, advisor: Advisor) => {
  const assigned = customer.advisor.toLowerCase();
  const name = advisor.name.toLowerCase();
  return assigned.includes(name) || name.includes(assigned);
};

export const AssignmentView: React.FC<AssignmentViewProps> = ({
  customers,
  advisors,
  onReassignCustomer,
  onBulkAssign,
  onSelectCustomer,
}) => {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('todas');
  const [age, setAge] = useState('todos');
  const [advisorFilter, setAdvisorFilter] = useState('todos');
  const [selected, setSelected] = useState<string[]>([]);
  const [targetAdvisor, setTargetAdvisor] = useState(advisors[0]?.name || '');
  const [contactDate, setContactDate] = useState(new Date().toISOString().slice(0, 10));
  const [feedback, setFeedback] = useState('');

  const cities = useMemo(() => Array.from(new Set(customers.map(customer => customer.city))).sort(), [customers]);

  const filtered = useMemo(() => customers.filter(customer => {
    const months = calculateAgeInMonths(customer.deliveryDate || customer.registrationDate);
    const knownAdvisor = advisors.some(advisor => advisorMatches(customer, advisor));
    if (city !== 'todas' && customer.city !== city) return false;
    if (age === '12-24' && (months < 12 || months >= 24)) return false;
    if (age === '24' && months < 24) return false;
    if (age === '36' && months < 36) return false;
    if (advisorFilter === 'sin_activo' && knownAdvisor) return false;
    if (advisorFilter !== 'todos' && advisorFilter !== 'sin_activo' && customer.advisor !== advisorFilter) return false;
    if (search && ![customer.fullName, customer.vehicleModel, customer.licensePlate, customer.advisor].some(value => value?.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  }), [customers, advisors, city, age, advisorFilter, search]);

  const toggleAll = () => {
    const visibleIds = filtered.map(customer => customer.id);
    const allSelected = visibleIds.every(id => selected.includes(id));
    setSelected(allSelected ? selected.filter(id => !visibleIds.includes(id)) : Array.from(new Set([...selected, ...visibleIds])));
  };

  const apply = () => {
    if (!selected.length || !targetAdvisor || !contactDate) return;
    onBulkAssign(selected, targetAdvisor, contactDate);
    setFeedback(`${selected.length} clientes asignados.`);
    setSelected([]);
    window.setTimeout(() => setFeedback(''), 2400);
  };

  return (
    <div className="staff-view assignment-view">
      <header className="screen-header">
        <div className="screen-header__title"><span className="screen-header__icon"><UserRoundCheck /></span><div><h1>Asignar clientes</h1></div></div>
        {feedback && <span className="assignment-done"><Check />{feedback}</span>}
      </header>

      <section className="assignment-filters">
        <label className="compact-search"><Search /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar cliente o vehículo" /></label>
        <label><MapPin /><select value={city} onChange={event => setCity(event.target.value)}><option value="todas">Todas las ciudades</option>{cities.map(value => <option key={value} value={value}>{value}</option>)}</select></label>
        <label><CalendarDays /><select value={age} onChange={event => setAge(event.target.value)}><option value="todos">Cualquier antigüedad</option><option value="12-24">Entre 1 y 2 años</option><option value="24">Más de 2 años</option><option value="36">Más de 3 años</option></select></label>
        <label><Users /><select value={advisorFilter} onChange={event => setAdvisorFilter(event.target.value)}><option value="todos">Todos los asesores</option><option value="sin_activo">Vendedor no activo</option>{advisors.map(advisor => <option key={advisor.id} value={advisor.name}>{advisor.name.replace('Direccion - ', '')}</option>)}</select></label>
      </section>

      {selected.length > 0 && (
        <section className="bulk-assignment">
          <strong>{selected.length} seleccionados</strong>
          <label><Users /><select value={targetAdvisor} onChange={event => setTargetAdvisor(event.target.value)}>{advisors.map(advisor => <option key={advisor.id} value={advisor.name}>{advisor.name.replace('Direccion - ', '')}</option>)}</select></label>
          <label><CalendarDays /><input type="date" value={contactDate} onChange={event => setContactDate(event.target.value)} /></label>
          <button onClick={apply}><Check />Asignar</button>
        </section>
      )}

      <section className="assignment-table">
        <div className="assignment-table__top"><strong>{filtered.length} clientes</strong><button onClick={toggleAll}>{filtered.length > 0 && filtered.every(customer => selected.includes(customer.id)) ? 'Quitar selección' : 'Seleccionar todos'}</button></div>
        <div className="assignment-table__head"><span></span><span>Cliente</span><span>Ciudad / antigüedad</span><span>Vendedor</span><span>Asesor actual</span></div>
        <div className="assignment-table__body">
          {filtered.map(customer => {
            const months = calculateAgeInMonths(customer.deliveryDate || customer.registrationDate);
            const checked = selected.includes(customer.id);
            const seller = customer.originalAdvisor || customer.advisor;
            const sellerActive = advisors.some(advisor => {
              const activeName = advisor.name.toLowerCase();
              const sellerName = seller.toLowerCase();
              return activeName.includes(sellerName) || sellerName.includes(activeName);
            });
            return (
              <article key={customer.id} className={checked ? 'assignment-client is-selected' : 'assignment-client'}>
                <input type="checkbox" checked={checked} onChange={() => setSelected(value => value.includes(customer.id) ? value.filter(id => id !== customer.id) : [...value, customer.id])} aria-label={`Seleccionar ${customer.fullName}`} />
                <button onClick={() => onSelectCustomer(customer)}><strong>{customer.fullName}</strong><span>{customer.vehicleModel} · {customer.licensePlate}</span></button>
                <div><strong>{customer.city}</strong><span>{months} meses desde la entrega</span></div>
                <div><strong>{seller.replace('Direccion - ', '')}</strong><span>{sellerActive ? 'Activo' : 'No activo'}</span></div>
                <select value={customer.advisor} onChange={event => onReassignCustomer(customer.id, event.target.value)} aria-label={`Asesor actual de ${customer.fullName}`}>{advisors.map(advisor => <option key={advisor.id} value={advisor.name}>{advisor.name.replace('Direccion - ', '')}</option>)}</select>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
