import React, { useState } from 'react';
import { X, UserPlus, Car, MapPin, Calendar, Phone, Mail, FileText, CheckCircle2 } from 'lucide-react';
import { Customer, Advisor } from '../types';

interface AddCustomerModalProps {
  advisors: Advisor[];
  onClose: () => void;
  onAddCustomer: (customer: Customer) => void;
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  advisors,
  onClose,
  onAddCustomer,
}) => {
  const [fullName, setFullName] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [cuit, setCuit] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('San Salvador de Jujuy');
  const [branch, setBranch] = useState<'San Salvador de Jujuy' | 'Ledesma' | 'Perico'>('San Salvador de Jujuy');
  const [vehicleModel, setVehicleModel] = useState('TAOS HIGHLINE 250 TSI AT');
  const [modelFamily, setModelFamily] = useState<'Taos' | 'Amarok' | 'Nivus' | 'T-Cross' | 'Polo' | 'Virtus' | 'Tiguan' | 'Tera'>('Taos');
  const [licensePlate, setLicensePlate] = useState('');
  const [chassisNumber, setChassisNumber] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(new Date().toLocaleDateString('es-AR'));
  const [birthDate, setBirthDate] = useState('');
  const [advisor, setAdvisor] = useState(advisors[0]?.name || 'GUSTAVO MAURICIO CABEZAS');
  const [category, setCategory] = useState<'Ventas' | 'Postventa' | 'Ambos'>('Ventas');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !licensePlate.trim()) {
      alert('Por favor, completá los campos obligatorios (Nombre, Teléfono, Patente).');
      return;
    }

    const newCustomer: Customer = {
      id: `c_${Date.now()}`,
      fullName: fullName.trim(),
      docNumber: docNumber.trim() || 'DNI',
      cuit: cuit.trim() || undefined,
      phone: phone.trim(),
      email: email.trim() || `${fullName.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      address: 'Domicilio cliente',
      city,
      zipCode: '4600',
      branch,
      brand: 'Volkswagen',
      vehicleModel,
      modelFamily,
      licensePlate: licensePlate.toUpperCase().trim(),
      chassisNumber: chassisNumber.toUpperCase().trim() || `8AWZZZ${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      registrationDate: deliveryDate,
      deliveryDate,
      birthDate: birthDate || undefined,
      advisor,
      state: 'Pendiente',
      contactReason: 'Seguimiento de entrega',
      priority: 'Media',
      category,
      tags: ['Nuevo Registro', '0km'],
      notes: notes.trim() || 'Cliente dado de alta manualmente en el sistema.',
      history: [
        {
          id: `h_${Date.now()}`,
          date: new Date().toLocaleDateString('es-AR'),
          channel: 'Presencial',
          result: 'Contactado',
          notes: 'Alta del cliente y asignación en Autosol Fideliza.',
          advisorName: advisor,
        }
      ]
    };

    onAddCustomer(newCustomer);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-blue-400 font-bold uppercase tracking-wider mb-0.5">
              <UserPlus className="w-3.5 h-3.5" />
              <span>Alta de Cliente · Autosol S.R.L.</span>
            </div>
            <h3 className="text-lg font-black text-white">Incorporar Cliente a la Cartera</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto">
          
          {/* Section: Personal Details */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-blue-600">
              1. Datos del Cliente
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: MARCOS ESTEBAN ROJAS"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Teléfono (WhatsApp) *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: 388-154760579 o 549388..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">DNI o CUIT</label>
                <input
                  type="text"
                  placeholder="Ej: 34.567.890 o 20-34567890-3"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="cliente@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Fecha de Nacimiento (Cumpleaños)</label>
                <input
                  type="text"
                  placeholder="DD/MM/AAAA (ej: 14/09/1984)"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Sucursal / Ciudad</label>
                <select
                  value={branch}
                  onChange={(e) => {
                    const b = e.target.value as any;
                    setBranch(b);
                    setCity(b);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="San Salvador de Jujuy">Jujuy Central</option>
                  <option value="Ledesma">Ledesma</option>
                  <option value="Perico">Perico</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Vehicle Details */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-blue-600">
              2. Vehículo & Entrega
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Familia de Modelo</label>
                <select
                  value={modelFamily}
                  onChange={(e) => {
                    const m = e.target.value as any;
                    setModelFamily(m);
                    if (m === 'Taos') setVehicleModel('TAOS HIGHLINE 250 TSI AT');
                    else if (m === 'Amarok') setVehicleModel('AMAROK HIGHLINE V6 4X4 AT');
                    else if (m === 'Nivus') setVehicleModel('NIVUS HIGHLINE 200 TSI AT');
                    else if (m === 'T-Cross') setVehicleModel('T-CROSS HIGHLINE 200 TSI AT');
                    else if (m === 'Polo') setVehicleModel('POLO TRACK 1.0 MPI MT');
                    else if (m === 'Virtus') setVehicleModel('VIRTUS COMFORTLINE AT');
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="Taos">Taos</option>
                  <option value="Amarok">Amarok</option>
                  <option value="Nivus">Nivus</option>
                  <option value="T-Cross">T-Cross</option>
                  <option value="Polo">Polo Track</option>
                  <option value="Virtus">Virtus</option>
                  <option value="Tiguan">Tiguan</option>
                  <option value="Tera">Tera</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">Modelo y Versión Exacta</label>
                <input
                  type="text"
                  required
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Patente / Dominio *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: AF123ZZ"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold uppercase text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Número de Chasis</label>
                <input
                  type="text"
                  placeholder="8AWZZZ..."
                  value={chassisNumber}
                  onChange={(e) => setChassisNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold uppercase text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Fecha de Remito / Entrega</label>
                <input
                  type="text"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  placeholder="DD/MM/AAAA"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section: Commercial Assignment */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-blue-600">
              3. Asignación Comercial
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Asesor Responsable</label>
                <select
                  value={advisor}
                  onChange={(e) => setAdvisor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                >
                  {advisors.map(adv => (
                    <option key={adv.id} value={adv.name}>{adv.name.replace('Direccion - ', '')}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Módulo / Tipo</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="Ventas">Ventas y Fidelización</option>
                  <option value="Postventa">Taller y Postventa</option>
                  <option value="Ambos">Ambos</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black shadow-md shadow-blue-500/20 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Guardar Cliente</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
