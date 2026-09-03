import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Award, 
  AlertOctagon, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Car,
  ChevronRight
} from 'lucide-react';
import { Customer, Advisor } from '../types';
import { calculateAgeInMonths } from '../utils/communication';

interface SalesManagerDashboardProps {
  customers: Customer[];
  advisors: Advisor[];
  onSelectAdvisor: (advisorId: string) => void;
  onSelectCustomer: (c: Customer) => void;
}

export const SalesManagerDashboard: React.FC<SalesManagerDashboardProps> = ({
  customers,
  advisors,
  onSelectAdvisor,
  onSelectCustomer,
}) => {
  const total = customers.length;
  const contacted = customers.filter(c => c.state === 'Contactado' || c.history.length > 0).length;
  const interested = customers.filter(c => c.state === 'Interesado' || c.state === 'Potencial renovación' || c.tradeInInterest).length;
  const renewed = customers.filter(c => c.state === 'Renovado').length;
  const unattended = customers.filter(c => c.state === 'Pendiente' || c.state === 'No respondió').length;

  const contactRate = Math.round((contacted / (total || 1)) * 100);
  const conversionRate = Math.round((renewed / (contacted || 1)) * 100);

  return (
    <div className="staff-view supervision-view">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Indicadores</h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
            Tasa de Contacto: {contactRate}%
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold border border-blue-300">
            Tasa de Cierre: {conversionRate}%
          </span>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="manager-kpis">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Cartera Asignada</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{total}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Contactabilidad</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{contacted}</div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${contactRate}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Oportunidades Activas</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-700">{interested}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Renovados 0km ★</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">{renewed}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Cartera Desatendida</span>
            <AlertOctagon className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600">{unattended}</div>
        </div>

      </div>

      {/* Advisor Performance Ranking */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 className="font-black text-base">Rendimiento por asesor</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Asesor</th>
                <th className="py-3 px-4">Sucursal</th>
                <th className="py-3 px-4 text-center">Cartera Total</th>
                <th className="py-3 px-4 text-center">Contactados</th>
                <th className="py-3 px-4 text-center">Pendientes</th>
                <th className="py-3 px-4 text-center">Interesados</th>
                <th className="py-3 px-4 text-center">Renovados</th>
                <th className="py-3 px-4 text-center">Tasa Cierre</th>
                <th className="py-3 px-4 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {advisors.map(adv => {
                const assigned = customers.filter(c => 
                  c.advisor.toLowerCase().includes(adv.name.toLowerCase()) || 
                  adv.name.toLowerCase().includes(c.advisor.toLowerCase())
                );
                const advContacted = assigned.filter(c => c.state === 'Contactado' || c.history.length > 0).length;
                const advPending = assigned.filter(c => c.state === 'Pendiente' || c.state === 'No respondió').length;
                const advInterested = assigned.filter(c => c.state === 'Interesado' || c.state === 'Potencial renovación' || c.tradeInInterest).length;
                const advRenewed = assigned.filter(c => c.state === 'Renovado').length;
                const advConversion = Math.round((advRenewed / (advContacted || 1)) * 100);

                return (
                  <tr key={adv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img src={adv.avatar} alt={adv.name} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <div className="font-bold text-slate-900">{adv.name.replace('Direccion - ', '')}</div>
                          <div className="text-[10px] text-slate-500">{adv.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{adv.branch}</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-900">{assigned.length}</td>
                    <td className="py-3 px-4 text-center font-semibold text-emerald-700">{advContacted}</td>
                    <td className="py-3 px-4 text-center font-semibold text-rose-600">{advPending}</td>
                    <td className="py-3 px-4 text-center font-semibold text-blue-700">{advInterested}</td>
                    <td className="py-3 px-4 text-center font-black text-amber-600">{advRenewed} ★</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-mono font-bold text-[11px]">
                        {advConversion}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onSelectAdvisor(adv.id)}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-bold text-[11px] transition-colors"
                      >
                        Ver Agenda
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Critical Attention Alert Box */}
      <div className="bg-rose-50 border border-rose-200 p-5 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
          <AlertOctagon className="w-5 h-5 text-rose-600" />
          <span>Alertas de Cartera Desatendida (Sin gestión en los últimos 45 días)</span>
        </div>
        <p className="text-xs text-rose-900 leading-relaxed">
          Los siguientes clientes tienen un vehículo con más de 20 meses de antigüedad y no registran interacción en las últimas semanas. Podés reasignarlos o enviar una alerta directa al asesor asignado.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {customers
            .filter(c => calculateAgeInMonths(c.deliveryDate || c.registrationDate) >= 20 && c.state === 'Pendiente')
            .slice(0, 6)
            .map(client => (
              <div 
                key={client.id}
                onClick={() => onSelectCustomer(client)}
                className="bg-white p-3 rounded-xl border border-rose-200 shadow-sm cursor-pointer hover:border-rose-400 text-xs space-y-1"
              >
                <div className="font-bold text-slate-900 flex justify-between">
                  <span>{client.fullName}</span>
                  <span className="text-rose-600 font-mono text-[11px]">{client.licensePlate}</span>
                </div>
                <div className="text-slate-500 flex justify-between text-[11px]">
                  <span>{client.vehicleModel}</span>
                  <span className="font-bold">{client.advisor.replace('Direccion - ', '')}</span>
                </div>
              </div>
            ))}
        </div>
      </div>

    </div>
  );
};
