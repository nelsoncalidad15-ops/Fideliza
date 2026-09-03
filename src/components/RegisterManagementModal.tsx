import React, { useMemo, useState } from 'react';
import { CalendarDays, Check, ChevronRight, Mail, MessageSquare, Phone, X } from 'lucide-react';
import { Advisor, ContactChannel, Customer, ManagementResult } from '../types';

interface RegisterManagementModalProps {
  customer: Customer;
  advisors: Advisor[];
  onClose: () => void;
  onSaveManagement: (customerId: string, data: {
    date: string;
    channel: ContactChannel;
    result: ManagementResult;
    notes: string;
    detectedInterest?: string;
    nextFollowUpDate?: string;
    advisorName: string;
  }) => void;
}

const outcomes: Array<{ value: ManagementResult; tone: string }> = [
  { value: 'No respondió', tone: 'border-slate-200 hover:border-slate-400' },
  { value: 'Contactado', tone: 'border-blue-200 bg-blue-50/50 hover:border-blue-400' },
  { value: 'No interesado', tone: 'border-slate-200 hover:border-slate-400' },
  { value: 'Interesado', tone: 'border-emerald-200 bg-emerald-50/40 hover:border-emerald-400' },
  { value: 'Quiere cotización', tone: 'border-emerald-200 bg-emerald-50/40 hover:border-emerald-400' },
  { value: 'Quiere entregar usado', tone: 'border-emerald-200 bg-emerald-50/40 hover:border-emerald-400' },
  { value: 'Interesado en financiación', tone: 'border-emerald-200 bg-emerald-50/40 hover:border-emerald-400' },
  { value: 'Volver a contactar', tone: 'border-amber-200 bg-amber-50/40 hover:border-amber-400' },
  { value: 'No contactar comercialmente', tone: 'border-rose-200 bg-rose-50/40 hover:border-rose-400' },
  { value: 'No contactar hasta', tone: 'border-rose-200 bg-rose-50/40 hover:border-rose-400' },
];

export const RegisterManagementModal: React.FC<RegisterManagementModalProps> = ({ customer, advisors, onClose, onSaveManagement }) => {
  const [channel, setChannel] = useState<ContactChannel>('WhatsApp');
  const [result, setResult] = useState<ManagementResult>('Contactado');
  const [notes, setNotes] = useState('');
  const [interest, setInterest] = useState('');
  const [nextDate, setNextDate] = useState('');
  const [advisorName, setAdvisorName] = useState(customer.advisor || advisors[0]?.name || '');
  const needsFollowUp = result === 'Volver a contactar' || result === 'No contactar hasta';
  const isInterested = ['Interesado', 'Quiere cotización', 'Quiere entregar usado', 'Interesado en financiación'].includes(result);
  const defaultInterest = useMemo(() => result === 'Quiere entregar usado' ? 'Usado' : result === 'Interesado en financiación' ? 'Financiación' : result === 'Quiere cotización' ? 'Cotización' : '', [result]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    onSaveManagement(customer.id, {
      date: new Date().toLocaleDateString('es-AR'), channel, result, notes: notes.trim(),
      detectedInterest: isInterested ? (interest || defaultInterest || undefined) : undefined,
      nextFollowUpDate: needsFollowUp ? nextDate || undefined : undefined, advisorName,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/40 backdrop-blur-sm p-0 sm:p-5">
      <form onSubmit={submit} className="w-full max-w-xl rounded-t-[28px] sm:rounded-[28px] bg-white shadow-2xl overflow-hidden animate-fade-in">
        <header className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-slate-100">
          <div><p className="text-[11px] font-bold uppercase tracking-[.14em] text-blue-600">Registrar gestión</p><h2 className="mt-1 text-lg font-bold text-slate-950">¿Qué pasó con {customer.firstName || customer.fullName.split(' ')[0]}?</h2><p className="mt-1 text-xs text-slate-500">{customer.vehicleModel} · {customer.licensePlate}</p></div>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-5 w-5" /></button>
        </header>
        <div className="max-h-[72vh] overflow-y-auto p-5 space-y-5">
          <section><p className="mb-2 text-xs font-semibold text-slate-700">Resultado</p><div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{outcomes.map(item => <button key={item.value} type="button" onClick={() => setResult(item.value)} className={`min-h-11 rounded-xl border px-2.5 text-left text-xs font-semibold transition ${result === item.value ? 'border-blue-600 bg-blue-600 text-white shadow-sm' : `text-slate-700 ${item.tone}`}`}>{item.value}</button>)}</div></section>
          <section className="flex flex-wrap gap-2">{[{ value: 'WhatsApp' as ContactChannel, Icon: MessageSquare }, { value: 'Llamada' as ContactChannel, Icon: Phone }, { value: 'Mail' as ContactChannel, Icon: Mail }].map(({ value, Icon }) => <button key={value} type="button" onClick={() => setChannel(value)} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold ${channel === value ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}><Icon className="h-3.5 w-3.5" />{value}</button>)}</section>
          {isInterested && <section className="rounded-2xl bg-emerald-50 p-3.5 ring-1 ring-emerald-100"><label className="text-xs font-semibold text-emerald-950">Interés detectado</label><div className="mt-2 flex flex-wrap gap-1.5">{['Renovación', 'Usado', 'Financiación', 'Cotización', 'Modelo nuevo'].map(option => <button key={option} type="button" onClick={() => setInterest(option)} className={`rounded-lg px-2.5 py-1.5 text-[11px] font-semibold ${interest === option ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-800 ring-1 ring-emerald-200'}`}>{option}</button>)}</div></section>}
          {needsFollowUp && <section className={`rounded-2xl p-3.5 ring-1 ${result === 'No contactar hasta' ? 'bg-rose-50 ring-rose-100' : 'bg-amber-50 ring-amber-100'}`}><label className={`flex items-center gap-1.5 text-xs font-semibold ${result === 'No contactar hasta' ? 'text-rose-950' : 'text-amber-950'}`}><CalendarDays className="h-4 w-4" />{result === 'No contactar hasta' ? 'No contactar hasta' : 'Próximo contacto'}</label><input required type="date" value={nextDate} onChange={e => setNextDate(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500" /></section>}
          <details className="group rounded-xl border border-slate-200 p-3"><summary className="cursor-pointer list-none text-xs font-semibold text-slate-600 flex items-center justify-between">Agregar observación <ChevronRight className="h-4 w-4 transition group-open:rotate-90" /></summary><textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Opcional" className="mt-3 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs outline-none focus:border-blue-500" /><select value={advisorName} onChange={e => setAdvisorName(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs">{advisors.map(advisor => <option key={advisor.id} value={advisor.name}>{advisor.name.replace('Direccion - ', '')}</option>)}</select></details>
        </div>
        <footer className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4"><button type="button" onClick={onClose} className="px-3 py-2 text-xs font-semibold text-slate-600">Cancelar</button><button type="submit" className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700"><Check className="h-4 w-4" />Guardar gestión</button></footer>
      </form>
    </div>
  );
};
