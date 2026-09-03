import React, { useState, useMemo } from 'react';
import { 
  Phone, 
  PhoneIncoming, 
  PhoneOutgoing, 
  Search, 
  RefreshCw, 
  Download, 
  Volume2, 
  Play, 
  Pause, 
  X, 
  BarChart2, 
  DollarSign, 
  Filter, 
  MessageSquare, 
  Calendar, 
  Clock, 
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { mockCallsData, TelephonyCall } from '../data/mockCalls';

interface CallsHistoryViewProps {
  onNavigateToStats: () => void;
  currentUserEmail: string;
}

export const CallsHistoryView: React.FC<CallsHistoryViewProps> = ({
  onNavigateToStats,
  currentUserEmail
}) => {
  const [calls, setCalls] = useState<TelephonyCall[]>(mockCallsData);
  const [dateRange, setDateRange] = useState('7d');
  const [searchQuery, setSearchQuery] = useState('');
  const [directionFilter, setDirectionFilter] = useState<'all' | 'Saliente' | 'Entrante'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Contestada' | 'No contestada' | 'Cancelada'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Audio playback modal state
  const [playingCall, setPlayingCall] = useState<TelephonyCall | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(35);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  // Filtered calls
  const filteredCalls = useMemo(() => {
    return calls.filter(call => {
      const matchesSearch = 
        call.originName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        call.originNumber.includes(searchQuery) ||
        call.destinationLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        call.destinationNumber.includes(searchQuery) ||
        (call.customerName && call.customerName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDirection = directionFilter === 'all' || 
        (directionFilter === 'Saliente' && call.direction === 'Saliente') ||
        (directionFilter === 'Entrante' && (call.direction === 'Entrante' || call.direction === '08xx Entrante'));

      const matchesStatus = statusFilter === 'all' || call.status === statusFilter;

      return matchesSearch && matchesDirection && matchesStatus;
    });
  }, [calls, searchQuery, directionFilter, statusFilter]);

  const totalCost = useMemo(() => {
    return filteredCalls.reduce((acc, c) => acc + c.cost, 0);
  }, [filteredCalls]);

  const handleExportCSV = () => {
    const headers = 'Fecha,Dirección,Origen,Número,Destino,Número Destino,Estado,Duración,Costo\n';
    const rows = filteredCalls.map(c => 
      `"${c.dateTime}","${c.direction}","${c.originName}","${c.originNumber}","${c.destinationLocation}","${c.destinationNumber}","${c.status}","${c.duration}","$${c.cost.toFixed(2)}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `historial_llamadas_autosol_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="staff-view calls-view font-sans">
      
      {/* Main Title & Action Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Llamadas</span>
            </h1>
          </div>

          {/* Quick links to statistics */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onNavigateToStats}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Estadísticas minutos</span>
            </button>

            <button
              onClick={onNavigateToStats}
              className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Estadísticas consumo</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar matching screenshot */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            {/* Date filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-500 font-medium">Fecha:</span>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="today">Hoy</option>
                <option value="7d">Últimos 7 días</option>
                <option value="30d">Últimos 30 días</option>
                <option value="month">Este mes</option>
              </select>
            </div>

            {/* Refresh button */}
            <button
              onClick={handleRefresh}
              className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refrescar</span>
            </button>

            {/* Direction Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              {(['all', 'Saliente', 'Entrante'] as const).map(dir => (
                <button
                  key={dir}
                  onClick={() => setDirectionFilter(dir)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    directionFilter === dir 
                      ? 'bg-white text-blue-700 shadow-xs font-bold' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {dir === 'all' ? 'Todas' : dir}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold py-1.5 px-2.5 rounded-xl focus:outline-none"
            >
              <option value="all">Todos los estados</option>
              <option value="Contestada">Solo Contestadas</option>
              <option value="No contestada">No contestadas</option>
              <option value="Cancelada">Canceladas</option>
            </select>
          </div>

          {/* Search and count */}
          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-600 whitespace-nowrap">
              Total <strong className="text-blue-600 font-mono text-sm">3.232</strong>
              {filteredCalls.length !== calls.length && (
                <span className="text-slate-400 font-normal"> (filtradas: {filteredCalls.length})</span>
              )}
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Buscar por asesor, destino, número..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Calls Table (Pixel-accurate matching Screenshot 1) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            {/* Table Header */}
            <thead className="bg-slate-50/90 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Fecha ⇅</th>
                <th className="py-3 px-3">Dirección</th>
                <th className="py-3 px-3">Origen</th>
                <th className="py-3 px-2 text-center">Número</th>
                <th className="py-3 px-3">Destino</th>
                <th className="py-3 px-2">Número Destino</th>
                <th className="py-3 px-3 text-center">Estado</th>
                <th className="py-3 px-3 text-center">Duración</th>
                <th className="py-3 px-2 text-center">Grabación</th>
                <th className="py-3 px-3 text-right">Precio</th>
                <th className="py-3 px-3 text-center">Acción</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredCalls.map((call) => {
                return (
                  <tr key={call.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Fecha */}
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                      {call.dateTime}
                    </td>

                    {/* Dirección */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        call.direction === 'Saliente'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : call.direction === 'Entrante'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {call.direction}
                      </span>
                    </td>

                    {/* Origen */}
                    <td className="py-3 px-3 font-semibold text-slate-900 whitespace-nowrap">
                      {call.originName}
                    </td>

                    {/* Número Origen */}
                    <td className="py-3 px-2 font-mono text-center text-slate-600 whitespace-nowrap">
                      {call.originNumber}
                    </td>

                    {/* Destino */}
                    <td className="py-3 px-3 font-medium text-slate-800 whitespace-nowrap max-w-xs truncate">
                      {call.destinationLocation}
                      {call.customerName && (
                        <div className="text-[10px] text-blue-600 font-bold">{call.customerName}</div>
                      )}
                    </td>

                    {/* Número Destino */}
                    <td className="py-3 px-2 font-mono text-slate-600 whitespace-nowrap">
                      {call.destinationNumber}
                    </td>

                    {/* Estado */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                        call.status === 'Contestada'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : call.status === 'No contestada'
                          ? 'bg-slate-100 text-slate-600 border border-slate-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {call.status === 'Contestada' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {call.status === 'No contestada' && <AlertCircle className="w-3 h-3 text-slate-500" />}
                        {call.status === 'Cancelada' && <XCircle className="w-3 h-3 text-rose-600" />}
                        {call.status}
                      </span>
                    </td>

                    {/* Duración */}
                    <td className="py-3 px-3 font-mono text-center font-semibold text-slate-800 whitespace-nowrap">
                      {call.duration}
                    </td>

                    {/* Grabación de Audio */}
                    <td className="py-3 px-2 text-center whitespace-nowrap">
                      {call.hasRecording ? (
                        <button
                          onClick={() => {
                            setPlayingCall(call);
                            setIsPlayingAudio(true);
                          }}
                          className="w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-700 text-white inline-flex items-center justify-center shadow-xs transition-transform hover:scale-105 cursor-pointer"
                          title="Escuchar grabación de llamada"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-slate-300 text-[11px]">—</span>
                      )}
                    </td>

                    {/* Precio */}
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                      {call.cost > 0 ? `$ ${call.cost.toFixed(2).replace('.', ',')}` : '$ 0,00'}
                    </td>

                    {/* Acción / Rellamada */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <a
                        href={`tel:${call.destinationNumber}`}
                        className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 inline-flex transition-colors"
                        title="Rellamar a este destino"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </td>

                  </tr>
                );
              })}
            </tbody>

            {/* Footer Summary Row matching screenshot */}
            <tfoot className="bg-slate-50 font-mono font-bold text-xs border-t-2 border-slate-200">
              <tr>
                <td colSpan={7} className="py-3 px-4 text-right text-slate-500 font-sans uppercase text-[10px]">
                  Totales auditados del período:
                </td>
                <td className="py-3 px-3 text-center text-slate-900 font-black">
                  94:07:07
                </td>
                <td></td>
                <td className="py-3 px-3 text-right text-emerald-700 font-black text-sm">
                  $ 107.921,83
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <div>
            Copyright <strong>Anura © 2026</strong> · Telefonía IP para empresas · Integrado con Autosol CRM
          </div>
          <div className="flex items-center gap-3">
            <span>Privacidad y auditoría oficial</span>
            <span>Central Jujuy: 3884119271</span>
          </div>
        </div>
      </div>

      {/* Audio Recording Playback Modal */}
      {playingCall && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-fade-in space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Grabación de Llamada Oficial</h3>
                  <p className="text-[11px] text-slate-500 font-mono">{playingCall.dateTime} · {playingCall.duration}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setPlayingCall(null);
                  setIsPlayingAudio(false);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Call participants */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Asesor Origen:</span>
                <span className="font-bold text-slate-800">{playingCall.originName} ({playingCall.originNumber})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Destino / Cliente:</span>
                <span className="font-semibold text-slate-800">{playingCall.destinationLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Número telefónico:</span>
                <span className="font-mono text-blue-600 font-bold">{playingCall.destinationNumber}</span>
              </div>
            </div>

            {/* Audio Waveform visualization */}
            <div className="p-4 rounded-2xl bg-slate-950 text-white space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>00:00:14</span>
                <div className="flex items-center gap-1 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Audio HD Calidad 128kbps
                </div>
                <span>{playingCall.duration}</span>
              </div>

              {/* Fake sound wave bars */}
              <div className="flex items-center justify-between gap-1 h-12 px-2">
                {[40, 65, 80, 45, 90, 75, 60, 30, 85, 95, 70, 50, 65, 80, 40, 55, 90, 60, 45, 70, 85, 40, 60, 30].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className={`w-1 rounded-full transition-all duration-300 ${
                      i < 10 ? 'bg-blue-500' : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>

              {/* Scrubbing bar & Play/Pause */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>

                <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden cursor-pointer">
                  <div className="bg-blue-500 h-full rounded-full w-[45%]" />
                </div>
              </div>
            </div>

            {/* Call transcription / notes */}
            {playingCall.recordingTranscription && (
              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs">
                <span className="font-bold text-blue-900 block mb-1">Transcripción Inteligente de la Conversación:</span>
                <p className="text-slate-700 leading-relaxed italic">
                  "{playingCall.recordingTranscription}"
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setPlayingCall(null);
                  setIsPlayingAudio(false);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Cerrar Reproductor
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
