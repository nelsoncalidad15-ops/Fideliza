import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  LayoutGrid, 
  LayoutList, 
  Car, 
  Calendar, 
  Phone, 
  Mail, 
  MessageSquare, 
  Plus, 
  ChevronRight,
  FileSpreadsheet,
  CheckCircle2,
  Cake,
  RefreshCw
} from 'lucide-react';
import { Customer, Advisor } from '../types';
import { calculateAgeInMonths, buildTelLink, buildMailtoLink } from '../utils/communication';

interface ClientsDatabaseViewProps {
  customers: Customer[];
  advisors: Advisor[];
  onSelectCustomer: (customer: Customer) => void;
  onOpenManagementModal: (customer: Customer) => void;
  onOpenWhatsAppModal: (customer: Customer) => void;
  onAddNewCustomer: () => void;
  initialSearch?: string;
}

export const ClientsDatabaseView: React.FC<ClientsDatabaseViewProps> = ({
  customers,
  advisors,
  onSelectCustomer,
  onOpenManagementModal,
  onOpenWhatsAppModal,
  onAddNewCustomer,
  initialSearch = '',
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [branchFilter, setBranchFilter] = useState('Todas');
  const [cityFilter, setCityFilter] = useState('');
  const [advisorFilter, setAdvisorFilter] = useState('Todos');
  const [modelFilter, setModelFilter] = useState('Todos');
  const [ageFilter, setAgeFilter] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [categoryFilter, setCategoryFilter] = useState('Todos');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Filtrado multivariado
  const filteredCustomers = useMemo(() => {
    return customers.filter(client => {
      // Búsqueda en texto
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchName = client.fullName.toLowerCase().includes(query);
        const matchDoc = client.docNumber.toLowerCase().includes(query) || (client.cuit && client.cuit.includes(query));
        const matchPlate = client.licensePlate.toLowerCase().includes(query);
        const matchModel = client.vehicleModel.toLowerCase().includes(query);
        const matchChassis = client.chassisNumber.toLowerCase().includes(query);
        const matchPhone = client.phone.toLowerCase().includes(query);
        const matchCity = client.city.toLowerCase().includes(query);
        if (!matchName && !matchDoc && !matchPlate && !matchModel && !matchChassis && !matchPhone && !matchCity) {
          return false;
        }
      }

      // Sucursal
      if (branchFilter !== 'Todas' && client.branch !== branchFilter) {
        return false;
      }

      if (cityFilter && !client.city.toLowerCase().includes(cityFilter.toLowerCase())) return false;

      // Asesor
      if (advisorFilter !== 'Todos' && !client.advisor.toLowerCase().includes(advisorFilter.toLowerCase())) {
        return false;
      }

      // Modelo
      if (modelFilter !== 'Todos' && client.modelFamily !== modelFilter) {
        return false;
      }

      // Estado
      if (statusFilter !== 'Todos' && client.state !== statusFilter) {
        return false;
      }

      // Categoría
      if (categoryFilter !== 'Todos' && client.category !== categoryFilter && client.category !== 'Ambos') {
        return false;
      }

      // Antigüedad en meses
      if (ageFilter !== 'Todos') {
        const months = calculateAgeInMonths(client.deliveryDate || client.registrationDate);
        if (ageFilter === '<12' && months >= 12) return false;
        if (ageFilter === '12-24' && (months < 12 || months > 24)) return false;
        if (ageFilter === '24-36' && (months < 24 || months > 36)) return false;
        if (ageFilter === '>36' && months <= 36) return false;
      }

      return true;
    });
  }, [customers, searchTerm, branchFilter, cityFilter, advisorFilter, modelFilter, ageFilter, statusFilter, categoryFilter]);

  // Exportar a CSV compatible con Excel / Google Sheets
  const handleExportCSV = () => {
    const headers = [
      'Cliente',
      'DNI_CUIT',
      'Telefono',
      'Email',
      'Ciudad',
      'Sucursal',
      'Modelo_Version',
      'Dominio',
      'Chasis',
      'Fecha_Remito_Entrega',
      'Fecha_Patentamiento',
      'Fecha_Nacimiento',
      'Antiguedad_Meses',
      'Estado',
      'Asesor'
    ];

    const rows = filteredCustomers.map(c => [
      `"${c.fullName}"`,
      `"${c.cuit || c.docNumber}"`,
      `"${c.phone}"`,
      `"${c.email}"`,
      `"${c.city}"`,
      `"${c.branch}"`,
      `"${c.vehicleModel}"`,
      `"${c.licensePlate}"`,
      `"${c.chassisNumber}"`,
      `"${c.deliveryDate}"`,
      `"${c.registrationDate}"`,
      `"${c.birthDate || ''}"`,
      calculateAgeInMonths(c.deliveryDate || c.registrationDate),
      `"${c.state}"`,
      `"${c.advisor}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Autosol_Base_Clientes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setBranchFilter('Todas');
    setCityFilter('');
    setAdvisorFilter('Todos');
    setModelFilter('Todos');
    setAgeFilter('Todos');
    setStatusFilter('Todos');
    setCategoryFilter('Todos');
  };

  return (
    <div className="staff-view clients-view">
      
      {/* Top Header Card */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Clientes <span className="text-slate-400">{filteredCustomers.length}</span>
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 transition-colors"
            title="Descargar archivo CSV para Excel o Google Sheets"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={onAddNewCustomer}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Cargar Cliente</span>
          </button>
        </div>
      </div>

      {copiedNotification && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>CSV exportado.</span>
        </div>
      )}

      {/* Advanced Filter Toolbar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        
        {/* Search Bar + View Mode Toggle */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar cliente, DNI, dominio o teléfono"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
              >
                ✕ Limpiar
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Restablecer todos los filtros"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restablecer</span>
            </button>

            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                  viewMode === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Vista Tabla Completa"
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                  viewMode === 'cards' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Vista Tarjetas"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Dropdowns Row */}
        <details className="group border-t border-slate-100 pt-3">
          <summary className="flex cursor-pointer list-none items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900">
            <Filter className="w-3.5 h-3.5" />Filtros avanzados
          </summary>
        <div className="client-filter-grid mt-3 text-xs">
          
          {/* Sucursal */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Sucursal</label>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="Todas">Todas</option>
              <option value="San Salvador de Jujuy">Jujuy Central</option>
              <option value="Ledesma">Ledesma</option>
              <option value="Perico">Perico</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Localidad</label>
            <input
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              placeholder="Ej. Tartagal"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Modelo */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Modelo</label>
            <select
              value={modelFilter}
              onChange={(e) => setModelFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="Todos">Todos los modelos</option>
              <option value="Taos">Taos</option>
              <option value="Amarok">Amarok</option>
              <option value="Nivus">Nivus</option>
              <option value="T-Cross">T-Cross</option>
              <option value="Polo">Polo Track / Polo</option>
              <option value="Virtus">Virtus</option>
              <option value="Tiguan">Tiguan</option>
              <option value="Tera">Tera</option>
            </select>
          </div>

          {/* Antigüedad de Remito */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Antigüedad Entrega</label>
            <select
              value={ageFilter}
              onChange={(e) => setAgeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="Todos">Cualquier tiempo</option>
              <option value="<12">&lt; 12 meses (Nuevos)</option>
              <option value="12-24">12 a 24 meses (1er Servicio)</option>
              <option value="24-36">24 a 36 meses (Renovación)</option>
              <option value=">36">&gt; 36 meses (Cambio Urgente)</option>
            </select>
          </div>

          {/* Estado Comercial */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Estado</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="Todos">Todos los estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Contactado">Contactado</option>
              <option value="Interesado">Interesado</option>
              <option value="Potencial renovación">Potencial renovación</option>
              <option value="Oportunidad activa">Oportunidad activa</option>
              <option value="Renovado">Renovado</option>
            </select>
          </div>

          {/* Asesor */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Asesor Asignado</label>
            <select
              value={advisorFilter}
              onChange={(e) => setAdvisorFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="Todos">Todos</option>
              {advisors.map(adv => (
                <option key={adv.id} value={adv.name}>{adv.name.replace('Direccion - ', '')}</option>
              ))}
            </select>
          </div>

          {/* Módulo Ventas / Postventa */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Módulo</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="Todos">Ventas & Postventa</option>
              <option value="Ventas">Solo Ventas / Fidelización</option>
              <option value="Postventa">Solo Postventa / Taller</option>
            </select>
          </div>

        </div>
        </details>

      </div>

      {/* Main Results Table or Cards */}
      {filteredCustomers.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <Search className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No se encontraron clientes</h3>
          <p className="text-xs text-slate-500">
            Probá ajustando los términos de búsqueda o quitando algunos de los filtros seleccionados.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
          >
            Limpiar filtros
          </button>
        </div>
      ) : viewMode === 'table' ? (
        
        /* Table Mode - Structured like Autosol Official Base */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-white uppercase text-[11px] font-semibold tracking-wider">
                <tr>
                  <th className="py-3.5 px-3">Cliente / DNI-CUIT</th>
                  <th className="py-3.5 px-3">Modelo / Versión</th>
                  <th className="py-3.5 px-3">Dominio & Chasis</th>
                  <th className="py-3.5 px-3">Fec. Remito</th>
                  <th className="py-3.5 px-3">Antigüedad</th>
                  <th className="py-3.5 px-3">Contacto / Teléfono</th>
                  <th className="py-3.5 px-3">Sucursal</th>
                  <th className="py-3.5 px-3">Asesor</th>
                  <th className="py-3.5 px-3">Estado</th>
                  <th className="py-3.5 px-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredCustomers.map(client => {
                  const ageMonths = calculateAgeInMonths(client.deliveryDate || client.registrationDate);
                  return (
                    <tr key={client.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3 px-3">
                        <div 
                          onClick={() => onSelectCustomer(client)}
                          className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer"
                        >
                          {client.fullName}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {client.cuit || client.docNumber}
                        </div>
                        {client.birthDate && (
                          <div className="text-[10px] text-rose-600 flex items-center gap-1 font-medium mt-0.5">
                            <Cake className="w-2.5 h-2.5" /> Nac: {client.birthDate}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800 max-w-[200px] truncate" title={client.vehicleModel}>
                        {client.vehicleModel}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded inline-block">
                          {client.licensePlate}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5 max-w-[120px] truncate" title={client.chassisNumber}>
                          {client.chassisNumber}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-700">
                        {client.deliveryDate || 'Sin dato'}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                          ageMonths >= 24 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {ageMonths > 0 ? `${ageMonths} m` : '0km'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-mono text-slate-800">{client.phone}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[130px]">{client.email}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {client.city}
                      </td>
                      <td className="py-3 px-3 text-slate-700 font-medium">
                        {client.advisor.replace('Direccion - ', '')}
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                          {client.state}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onOpenWhatsAppModal(client)}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors"
                            title="Abrir WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={buildTelLink(client.phone)}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-800 hover:text-white transition-colors"
                            title="Llamar"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => onOpenManagementModal(client)}
                            className="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white text-[11px] font-bold transition-colors"
                          >
                            Gestionar
                          </button>
                          <button
                            onClick={() => onSelectCustomer(client)}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                            title="Ver Ficha Completa"
                          >
                            <ChevronRight className="w-4 h-4" />
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
      ) : (

        /* Cards Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map(client => {
            const ageMonths = calculateAgeInMonths(client.deliveryDate || client.registrationDate);
            return (
              <div 
                key={client.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all space-y-3 hover:border-blue-400"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 
                      onClick={() => onSelectCustomer(client)}
                      className="text-base font-extrabold text-slate-900 hover:text-blue-600 cursor-pointer"
                    >
                      {client.fullName}
                    </h4>
                    <p className="text-xs text-slate-500 font-mono">
                      {client.cuit || client.docNumber} · {client.city}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {client.state}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span>{client.vehicleModel}</span>
                    <span className="font-mono bg-white px-1.5 py-0.5 rounded text-blue-700 border border-slate-200">
                      {client.licensePlate}
                    </span>
                  </div>
                  <div className="text-slate-500 text-[11px] flex items-center justify-between pt-1 border-t border-slate-200/50">
                    <span>Entrega: {client.deliveryDate || 'Sin dato'}</span>
                    <span className="font-semibold text-blue-600">
                      {ageMonths > 0 ? `${ageMonths} meses` : 'Reciente'}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Asesor:</span>
                    <span className="font-medium">{client.advisor.replace('Direccion - ', '')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Teléfono:</span>
                    <span className="font-mono font-medium">{client.phone}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                  <button
                    onClick={() => onOpenWhatsAppModal(client)}
                    className="flex-1 py-2 px-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={() => onOpenManagementModal(client)}
                    className="py-2 px-3 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-600 hover:text-white transition-colors border border-blue-200"
                  >
                    Gestionar
                  </button>
                  <button
                    onClick={() => onSelectCustomer(client)}
                    className="py-2 px-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
                  >
                    Ficha
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
