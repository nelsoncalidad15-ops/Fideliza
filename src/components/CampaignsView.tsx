import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Car, 
  Clock, 
  Download, 
  Calendar, 
  Send, 
  CheckCircle2, 
  Filter, 
  MessageSquare,
  Cake,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Customer, Campaign, Advisor } from '../types';
import { calculateAgeInMonths } from '../utils/communication';

interface CampaignsViewProps {
  customers: Customer[];
  advisors: Advisor[];
  campaigns: Campaign[];
  onSelectCustomer: (c: Customer) => void;
  onOpenWhatsAppModal: (c: Customer) => void;
  onOpenManagementModal: (c: Customer) => void;
  onSendToAgenda: (customerIds: string[]) => void;
}

export const CampaignsView: React.FC<CampaignsViewProps> = ({
  customers,
  advisors,
  campaigns,
  onSelectCustomer,
  onOpenWhatsAppModal,
  onOpenManagementModal,
  onSendToAgenda,
}) => {
  // Preset selector
  const [selectedPreset, setSelectedPreset] = useState<string>('taos_24');
  const [customModel, setCustomModel] = useState<string>('Todos');
  const [customMinMonths, setCustomMinMonths] = useState<number>(0);
  const [customBranch, setCustomBranch] = useState<string>('Todas');
  const [customCategory, setCustomCategory] = useState<string>('Todos');
  const [campaignNotification, setCampaignNotification] = useState<string | null>(null);

  // Aplicar segmento prearmado o personalizado
  const matchedCustomers = useMemo(() => {
    return customers.filter(c => {
      // La preferencia del cliente siempre tiene prioridad sobre la segmentación.
      if (c.noCommercialContact || (c.noContactUntil && new Date(c.noContactUntil) >= new Date())) return false;
      const months = calculateAgeInMonths(c.deliveryDate || c.registrationDate);

      if (selectedPreset === 'taos_24') {
        return c.modelFamily === 'Taos' && months >= 20;
      }
      if (selectedPreset === 'amarok_v6') {
        return c.modelFamily === 'Amarok' && months >= 24;
      }
      if (selectedPreset === 'cumpleanos_mes') {
        return c.contactReason === 'Cumpleaños' || c.tags.some(t => t.toLowerCase().includes('cumpleaños'));
      }
      if (selectedPreset === 'postventa_10k') {
        return c.category === 'Postventa' || c.category === 'Ambos' || months >= 10 && months <= 16;
      }
      if (selectedPreset === 'interes_renovar') {
        return c.state === 'Potencial renovación' || c.tradeInInterest || c.state === 'Interesado';
      }

      // Si es personalizado
      if (customModel !== 'Todos' && c.modelFamily !== customModel) return false;
      if (customBranch !== 'Todas' && c.branch !== customBranch) return false;
      if (customCategory !== 'Todos' && c.category !== customCategory && c.category !== 'Ambos') return false;
      if (customMinMonths > 0 && months < customMinMonths) return false;

      return true;
    });
  }, [customers, selectedPreset, customModel, customBranch, customCategory, customMinMonths]);

  const handleSendAllToAgenda = () => {
    const ids = matchedCustomers.map(c => c.id);
    onSendToAgenda(ids);
    setCampaignNotification(`¡${ids.length} clientes fueron añadidos a la agenda prioritaria de hoy!`);
    setTimeout(() => setCampaignNotification(null), 4000);
  };

  const handleExportCampaign = () => {
    const headers = ['Cliente', 'Telefono', 'Modelo', 'Dominio', 'Antigüedad', 'Asesor', 'Sucursal'];
    const rows = matchedCustomers.map(c => [
      `"${c.fullName}"`,
      `"${c.phone}"`,
      `"${c.vehicleModel}"`,
      `"${c.licensePlate}"`,
      calculateAgeInMonths(c.deliveryDate || c.registrationDate),
      `"${c.advisor}"`,
      `"${c.branch}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', `Campana_Autosol_${selectedPreset}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="staff-view campaigns-view">
      
      {/* Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Campañas</h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportCampaign}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Exportar Segmento</span>
          </button>
          <button
            onClick={handleSendAllToAgenda}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4" />
            <span>Enviar {matchedCustomers.length} a Agenda Hoy</span>
          </button>
        </div>
      </div>

      {campaignNotification && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{campaignNotification}</span>
        </div>
      )}

      {/* Preset Campaigns Cards */}
      <div className="campaign-presets">
        {[
          { id: 'taos_24', title: 'Plan Taos > 24m', desc: 'Renovación preferencial y tasa 0%', icon: TrendingUp, color: 'border-blue-500' },
          { id: 'amarok_v6', title: 'Fuerza Amarok V6', desc: 'Flotas agrícolas y comerciales', icon: Car, color: 'border-sky-500' },
          { id: 'cumpleanos_mes', title: 'Cumpleaños del Mes', desc: 'Fidelización + beneficio taller', icon: Cake, color: 'border-rose-500' },
          { id: 'postventa_10k', title: '1° Service 10.000km', desc: 'Conservar garantía oficial', icon: Clock, color: 'border-emerald-500' },
          { id: 'interes_renovar', title: 'Interés en Usados', desc: 'Toma llave contra llave', icon: Sparkles, color: 'border-amber-500' },
        ].map(p => {
          const Icon = p.icon;
          const isSelected = selectedPreset === p.id;
          return (
            <div
              key={p.id}
              onClick={() => setSelectedPreset(p.id)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer bg-white shadow-sm flex flex-col justify-between ${
                isSelected 
                  ? `${p.color} ring-2 ring-blue-500/20 shadow-md` 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      Activo
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-slate-900 text-xs">{p.title}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Segmenter Query Panel */}
      <details className="group rounded-2xl border border-slate-200 bg-white shadow-sm">
        <summary className="flex cursor-pointer list-none items-center justify-between p-4 text-xs font-bold text-slate-800">
          <span className="flex items-center gap-2"><Filter className="w-4 h-4 text-blue-600" />Ajustar segmento</span>
          <span className="text-emerald-700">{matchedCustomers.length} clientes</span>
        </summary>
      <div className="border-t border-slate-100 p-5 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-slate-500 font-bold mb-1">Modelo de Vehículo</label>
            <select
              value={customModel}
              onChange={(e) => {
                setCustomModel(e.target.value);
                setSelectedPreset('custom');
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="Todos">Todos los modelos</option>
              <option value="Taos">Taos</option>
              <option value="Amarok">Amarok</option>
              <option value="Nivus">Nivus</option>
              <option value="T-Cross">T-Cross</option>
              <option value="Polo">Polo Track</option>
              <option value="Virtus">Virtus</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 font-bold mb-1">Antigüedad Mínima (Meses)</label>
            <select
              value={customMinMonths}
              onChange={(e) => {
                setCustomMinMonths(Number(e.target.value));
                setSelectedPreset('custom');
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="0">Cualquier antigüedad</option>
              <option value="12">Más de 12 meses (1 año)</option>
              <option value="20">Más de 20 meses</option>
              <option value="24">Más de 24 meses (2 años)</option>
              <option value="36">Más de 36 meses (3 años)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 font-bold mb-1">Sucursal / Zona</label>
            <select
              value={customBranch}
              onChange={(e) => {
                setCustomBranch(e.target.value);
                setSelectedPreset('custom');
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="Todas">Todas las sucursales</option>
              <option value="San Salvador de Jujuy">Jujuy Central</option>
              <option value="Ledesma">Ledesma</option>
              <option value="Perico">Perico</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 font-bold mb-1">Perfil Comercial</label>
            <select
              value={customCategory}
              onChange={(e) => {
                setCustomCategory(e.target.value);
                setSelectedPreset('custom');
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="Todos">Ventas & Postventa</option>
              <option value="Ventas">Solo Ventas</option>
              <option value="Postventa">Solo Postventa</option>
            </select>
          </div>
        </div>
      </div>
      </details>

      {/* Target Audience Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-700">
            Clientes ({matchedCustomers.length})
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-white uppercase text-[11px] font-semibold">
              <tr>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Vehículo</th>
                <th className="py-3 px-4">Dominio</th>
                <th className="py-3 px-4">Antigüedad</th>
                <th className="py-3 px-4">Asesor</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {matchedCustomers.map(client => {
                const months = calculateAgeInMonths(client.deliveryDate || client.registrationDate);
                return (
                  <tr key={client.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div 
                        onClick={() => onSelectCustomer(client)}
                        className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer"
                      >
                        {client.fullName}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">{client.phone}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">{client.vehicleModel}</td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">{client.licensePlate}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 font-bold">
                        {months} meses
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{client.advisor.replace('Direccion - ', '')}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-semibold text-[10px]">
                        {client.state}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onOpenWhatsAppModal(client)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>
                        <button
                          onClick={() => onOpenManagementModal(client)}
                          className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                        >
                          Gestionar
                        </button>
                        <button
                          onClick={() => onSelectCustomer(client)}
                          className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px]"
                        >
                          Ficha
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
