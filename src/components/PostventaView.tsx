import React, { useState } from 'react';
import { 
  Clock, 
  ShieldAlert, 
  CalendarCheck, 
  Star, 
  Phone, 
  MessageSquare, 
  Car, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { Customer } from '../types';
import { calculateAgeInMonths, buildTelLink } from '../utils/communication';

interface PostventaViewProps {
  customers: Customer[];
  onSelectCustomer: (c: Customer) => void;
  onOpenWhatsAppModal: (c: Customer) => void;
  onOpenManagementModal: (c: Customer) => void;
}

export const PostventaView: React.FC<PostventaViewProps> = ({
  customers,
  onSelectCustomer,
  onOpenWhatsAppModal,
  onOpenManagementModal,
}) => {
  const [subTab, setSubTab] = useState<'1service' | 'garantia_vencer' | 'inactivos' | 'satisfaccion'>('1service');

  // Filtrado de clientes para postventa
  const postventaClients = customers.filter(c => {
    const months = calculateAgeInMonths(c.deliveryDate || c.registrationDate);

    if (subTab === '1service') {
      return months >= 8 && months <= 15;
    }
    if (subTab === 'garantia_vencer') {
      // 3 años de garantía oficial Volkswagen (30 a 38 meses)
      return months >= 30 && months <= 38;
    }
    if (subTab === 'inactivos') {
      return months >= 18 && (!c.lastServiceDate || c.lastServiceDate.includes('2024') || c.lastServiceDate.includes('2023'));
    }
    if (subTab === 'satisfaccion') {
      return months < 6 || c.contactReason.includes('satisfacción');
    }
    return true;
  });

  return (
    <div className="staff-view postventa-view">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Postventa</h2>
        </div>
      </div>

      {/* KPI Cards for Postventa */}
      <div className="hidden">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold">
            <Clock className="w-4 h-4" />
            <span>1° Service (10k/15k)</span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {customers.filter(c => calculateAgeInMonths(c.deliveryDate || c.registrationDate) >= 8 && calculateAgeInMonths(c.deliveryDate || c.registrationDate) <= 15).length}
          </div>
          <p className="text-[11px] text-slate-500">Unidades en ventana de 1er service</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-amber-600 text-xs font-bold">
            <ShieldAlert className="w-4 h-4" />
            <span>Garantía por Vencer</span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {customers.filter(c => calculateAgeInMonths(c.deliveryDate || c.registrationDate) >= 30 && calculateAgeInMonths(c.deliveryDate || c.registrationDate) <= 38).length}
          </div>
          <p className="text-[11px] text-slate-500">Oportunidad de salto a 0km nuevo</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-rose-600 text-xs font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>Inactivos Taller &gt; 18m</span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {customers.filter(c => calculateAgeInMonths(c.deliveryDate || c.registrationDate) > 18).length}
          </div>
          <p className="text-[11px] text-slate-500">Campaña de recuperación con descuento</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold">
            <Star className="w-4 h-4" />
            <span>Índice Satisfacción</span>
          </div>
          <div className="text-2xl font-black text-slate-900">4.9 / 5.0</div>
          <p className="text-[11px] text-slate-500">NPS Postventa Autosol S.R.L.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        {[
          { id: '1service', label: '1° Service Oficial (10.000 km / 1 año)' },
          { id: 'garantia_vencer', label: 'Garantía por vencer' },
          { id: 'inactivos', label: 'Recuperar clientes' },
          { id: 'satisfaccion', label: 'Satisfacción' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl transition-all ${
              subTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table list */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between">
          <span>Clientes ({postventaClients.length})</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-white uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Vehículo & Dominio</th>
                <th className="py-3 px-4">Fec. Remito / Antigüedad</th>
                <th className="py-3 px-4">Último Service</th>
                <th className="py-3 px-4">Acción Sugerida</th>
                <th className="py-3 px-4 text-center">Contactar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {postventaClients.map(c => {
                const months = calculateAgeInMonths(c.deliveryDate || c.registrationDate);
                return (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div 
                        onClick={() => onSelectCustomer(c)}
                        className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer"
                      >
                        {c.fullName}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">{c.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{c.vehicleModel}</div>
                      <div className="font-mono text-blue-700 text-[11px] font-bold">{c.licensePlate}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div>{c.deliveryDate || 'Sin dato'}</div>
                      <div className="text-[11px] text-slate-500 font-semibold">{months} meses</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {c.lastServiceDate || 'Sin registro'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                        {subTab === '1service' ? 'Ofrecer turno 1er service' : subTab === 'garantia_vencer' ? 'Ofrecer renovación 0km con usado' : 'Ofrecer 15% desc. repuestos'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onOpenWhatsAppModal(c)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>
                        <a
                          href={buildTelLink(c.phone)}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => onOpenManagementModal(c)}
                          className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                        >
                          Gestionar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
