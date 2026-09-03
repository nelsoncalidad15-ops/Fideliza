import React, { useState } from 'react';
import { Cake, Calendar, Gift, MessageSquare, Phone, CheckCircle2, Car, Sparkles, Award } from 'lucide-react';
import { Customer } from '../types';
import { calculateAgeInMonths, buildTelLink } from '../utils/communication';

interface BirthdaysAnniversariesViewProps {
  customers: Customer[];
  onSelectCustomer: (c: Customer) => void;
  onOpenWhatsAppModal: (c: Customer) => void;
  onOpenManagementModal: (c: Customer) => void;
}

export const BirthdaysAnniversariesView: React.FC<BirthdaysAnniversariesViewProps> = ({
  customers,
  onSelectCustomer,
  onOpenWhatsAppModal,
  onOpenManagementModal,
}) => {
  const [celebrationType, setCelebrationType] = useState<'cumpleanos' | 'aniversario'>('cumpleanos');
  const [salutedIds, setSalutedIds] = useState<string[]>([]);

  const handleMarkSaluted = (id: string) => {
    if (!salutedIds.includes(id)) {
      setSalutedIds(prev => [...prev, id]);
    }
  };

  // Clientes con cumpleaños o aniversarios
  const birthdayClients = customers.filter(c => 
    Boolean(c.birthDate) || c.contactReason === 'Cumpleaños' || c.tags.some(t => t.toLowerCase().includes('cumpleaños'))
  );

  const anniversaryClients = customers.filter(c => {
    const months = calculateAgeInMonths(c.deliveryDate || c.registrationDate);
    return months === 12 || months === 24 || months === 36 || c.contactReason.includes('Aniversario');
  });

  const activeList = celebrationType === 'cumpleanos' ? birthdayClients : anniversaryClients;

  return (
    <div className="staff-view birthdays-view">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 uppercase tracking-wider mb-1">
            <Cake className="w-3.5 h-3.5" />
            <span>Fidelización Afectiva y Fechas Clave</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Cumpleaños y Aniversarios de Entrega</h2>
          <p className="text-sm text-slate-500">
            Un cliente que recibe un saludo personalizado en su fecha especial tiene 4x más probabilidad de renovar su vehículo en el concesionario.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCelebrationType('cumpleanos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              celebrationType === 'cumpleanos' 
                ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Cake className="w-4 h-4" />
            <span>Cumpleaños ({birthdayClients.length})</span>
          </button>
          <button
            onClick={() => setCelebrationType('aniversario')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              celebrationType === 'aniversario' 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Aniversarios Entrega ({anniversaryClients.length})</span>
          </button>
        </div>
      </div>

      {/* Special Benefits Highlight Banner */}
      <div className="bg-gradient-to-r from-rose-50 to-amber-50 p-5 rounded-2xl border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm">Beneficios Oficiales Autosol Incluidos en el Saludo</h4>
            <p className="text-xs text-slate-600">
              Lavado ecológico de cortesía + 15% de bonificación en cambio de aceite o accesorios oficiales en Jujuy y Ledesma.
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-rose-700 bg-white px-3 py-1.5 rounded-xl border border-rose-300 shadow-sm shrink-0">
          Plantilla WhatsApp Automática
        </span>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeList.map(client => {
          const isSaluted = salutedIds.includes(client.id);
          const ageMonths = calculateAgeInMonths(client.deliveryDate || client.registrationDate);

          return (
            <div 
              key={client.id}
              className={`bg-white rounded-2xl border p-5 shadow-sm transition-all space-y-4 ${
                isSaluted ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200 hover:border-blue-400'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 
                    onClick={() => onSelectCustomer(client)}
                    className="font-black text-base text-slate-900 hover:text-blue-600 cursor-pointer"
                  >
                    {client.fullName}
                  </h4>
                  <p className="text-xs text-slate-500 font-mono">
                    {client.cuit || client.docNumber} · {client.city}
                  </p>
                </div>
                {isSaluted ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Saludado
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-300">
                    {celebrationType === 'cumpleanos' ? 'Cumpleañero' : 'Aniversario'}
                  </span>
                )}
              </div>

              {/* Detail context */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                <div className="flex justify-between items-center font-bold text-slate-800">
                  <span>{client.vehicleModel}</span>
                  <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-blue-700">
                    {client.licensePlate}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1 border-t border-slate-200/50">
                  <span>
                    {celebrationType === 'cumpleanos' ? `Nacimiento: ${client.birthDate || 'Mes actual'}` : `Entrega: ${client.deliveryDate}`}
                  </span>
                  <span className="font-semibold text-blue-600">{ageMonths} meses</span>
                </div>
              </div>

              <div className="text-xs text-slate-600 flex justify-between">
                <span>Asesor asignado:</span>
                <strong className="text-slate-800">{client.advisor.replace('Direccion - ', '')}</strong>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => {
                    handleMarkSaluted(client.id);
                    onOpenWhatsAppModal(client);
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Enviar Felicitación</span>
                </button>

                <a
                  href={buildTelLink(client.phone)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  title="Llamar"
                >
                  <Phone className="w-4 h-4" />
                </a>

                <button
                  onClick={() => handleMarkSaluted(client.id)}
                  className={`p-2 rounded-xl border text-xs font-bold transition-colors ${
                    isSaluted ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                  title="Marcar como saludado"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
