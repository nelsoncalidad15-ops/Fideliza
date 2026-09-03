import React from 'react';
import { ArrowRight, CalendarDays, CheckCircle2, MessageSquare, Phone, TrendingUp, Users } from 'lucide-react';
import { Advisor, Customer } from '../types';
import { buildTelLink } from '../utils/communication';

interface DashboardViewProps {
  customers: Customer[];
  advisors: Advisor[];
  onSelectCustomer: (customer: Customer) => void;
  onOpenManagementModal: (customer: Customer) => void;
  onOpenWhatsAppModal: (customer: Customer) => void;
  onNavigateToView: (view: string) => void;
}

const stateTone = (state: string) => {
  if (state === 'Pendiente' || state === 'No respondió') return 'bg-amber-50 text-amber-800 ring-amber-200';
  if (state === 'Interesado' || state === 'Potencial renovación') return 'bg-emerald-50 text-emerald-800 ring-emerald-200';
  return 'bg-slate-100 text-slate-700 ring-slate-200';
};

export const DashboardView: React.FC<DashboardViewProps> = ({ customers, advisors, onSelectCustomer, onOpenManagementModal, onOpenWhatsAppModal, onNavigateToView }) => {
  const today = customers.filter(c => c.nextScheduledContact?.toLowerCase().includes('hoy') || c.priority === 'Alta');
  const pending = customers.filter(c => c.state === 'Pendiente' || c.state === 'No respondió');
  const followUps = customers.filter(c => c.state === 'Seguimiento');
  const birthdays = customers.filter(c => c.contactReason === 'Cumpleaños' || c.tags.some(t => t.toLowerCase().includes('cumpleaños')));
  const contacted = customers.filter(c => c.state === 'Contactado' || c.history.length > 0);
  const interested = customers.filter(c => c.state === 'Interesado' || c.state === 'Potencial renovación' || c.state === 'Oportunidad activa');
  const quotes = customers.filter(c => c.history.some(h => h.result === 'Quiere cotización'));
  const renewed = customers.filter(c => c.state === 'Renovado');
  const funnel = [['Asignados', customers.length], ['Contactados', contacted.length], ['Interesados', interested.length], ['Cotizados', quotes.length], ['Renovados', renewed.length]];

  return (
    <div className="staff-view dashboard-view">
      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-950">Hoy</h1>
        </div>
        <button onClick={() => onNavigateToView('agenda')} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700"><CalendarDays className="h-4 w-4" />Abrir agenda <ArrowRight className="h-3.5 w-3.5" /></button>
      </section>

      <section className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {[
          ['Hoy', today.length, 'text-blue-700', () => onNavigateToView('agenda')],
          ['Pendientes', pending.length, 'text-amber-700', () => onNavigateToView('agenda')],
          ['Seguimientos', followUps.length, 'text-violet-700', () => onNavigateToView('agenda')],
          ['Cumpleaños', birthdays.length, 'text-rose-700', () => onNavigateToView('cumpleanos')],
        ].map(([label, value, tone, action]) => <button key={label as string} onClick={action as () => void} className="rounded-xl border border-slate-200 bg-white p-3.5 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md"><div className="text-[11px] font-semibold text-slate-500">{label as string}</div><div className={'mt-1 text-2xl font-bold ' + (tone as string)}>{value as number}</div></button>)}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div><h2 className="text-sm font-bold text-slate-900">Clientes de hoy</h2><p className="mt-0.5 text-xs text-slate-500">{today.length} por contactar</p></div>
          <button onClick={() => onNavigateToView('agenda')} className="text-xs font-semibold text-blue-700 hover:text-blue-900">Ver agenda</button>
        </div>
        {today.length === 0 ? <div className="px-5 py-8 text-center text-xs text-slate-500"><CheckCircle2 className="mx-auto mb-2 h-6 w-6 text-emerald-500" />No hay clientes urgentes ahora.</div> : (
          <div className="divide-y divide-slate-100">
            {today.slice(0, 5).map(customer => <div key={customer.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5">
              <button onClick={() => onSelectCustomer(customer)} className="min-w-[170px] text-left"><div className="text-xs font-bold text-slate-900 hover:text-blue-700">{customer.fullName}</div><div className="mt-0.5 text-[11px] text-slate-500">{customer.vehicleModel} · {customer.city}</div></button>
              <span className="flex-1 text-xs text-slate-600">{customer.contactReason}</span>
              <span className={['rounded-full px-2 py-1 text-[10px] font-bold ring-1', stateTone(customer.state)].join(' ')}>{customer.state}</span>
              <div className="ml-auto flex items-center gap-1">
                <button onClick={() => onOpenWhatsAppModal(customer)} title="WhatsApp" className="rounded-lg p-2 text-emerald-700 hover:bg-emerald-50"><MessageSquare className="h-4 w-4" /></button>
                <a href={buildTelLink(customer.phone)} title="Llamar" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"><Phone className="h-4 w-4" /></a>
                <button onClick={() => onOpenManagementModal(customer)} className="rounded-lg bg-blue-600 px-2.5 py-2 text-[11px] font-bold text-white hover:bg-blue-700">Gestionar</button>
              </div>
            </div>)}
          </div>
        )}
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-blue-600" /><h2 className="text-sm font-bold text-slate-900">Embudo comercial</h2></div>
          <div className="mt-5 space-y-3">{funnel.map(([label, value], index) => <div key={label as string}><div className="mb-1 flex justify-between text-xs"><span className="text-slate-600">{label as string}</span><strong className="text-slate-900">{value as number}</strong></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600" style={{ width: String(Math.max(5, ((value as number) / Math.max(customers.length, 1)) * 100)) + '%', opacity: 1 - index * .11 }} /></div></div>)}</div>
        </section>
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4"><Users className="h-4 w-4 text-blue-600" /><h2 className="text-sm font-bold text-slate-900">Por asesor</h2></div>
          <div className="divide-y divide-slate-100">{advisors.map(advisor => { const assigned = customers.filter(c => c.advisor.toLowerCase().includes(advisor.name.toLowerCase()) || advisor.name.toLowerCase().includes(c.advisor.toLowerCase())); const managed = assigned.filter(c => c.history.length > 0).length; return <button key={advisor.id} onClick={() => onNavigateToView('agenda')} className="flex w-full items-center justify-between px-5 py-3 text-left hover:bg-slate-50"><span className="text-xs font-semibold text-slate-800">{advisor.name.replace('Direccion - ', '')}</span><span className="text-[11px] text-slate-500">{managed}/{assigned.length} gestionados</span></button>; })}</div>
        </section>
      </div>
    </div>
  );
};
