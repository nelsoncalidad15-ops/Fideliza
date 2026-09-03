import React from 'react';
import { 
  ArrowRight, 
  Calendar, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  Car, 
  Clock, 
  ShieldCheck, 
  Cake,
  TrendingUp
} from 'lucide-react';

interface HeroSectionProps {
  onGoToAgenda: () => void;
  onGoToClients: () => void;
  onGoToBirthdays: () => void;
  onQuickFilter: (filter: string) => void;
  todayCount: number;
  birthdaysCount: number;
  renewalCount: number;
  postventaCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onGoToAgenda,
  onGoToClients,
  onGoToBirthdays,
  onQuickFilter,
  todayCount,
  birthdaysCount,
  renewalCount,
  postventaCount,
}) => {
  const [searchInput, setSearchInput] = React.useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onQuickFilter(searchInput.trim());
      onGoToClients();
    }
  };

  return (
    <div className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white overflow-hidden border-b border-slate-800">
      {/* Subtle modern automotive ambient lighting and backdrop pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Text Column */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              Autosol Fideliza · Concesionario Oficial Volkswagen
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              La relación con el cliente <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-200">
                no termina con la entrega.
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl font-light leading-relaxed">
              Informa, acompaña y activa oportunidades en el momento justo. Gestioná la fidelización,
              la renovación de 0km con toma de usados y el seguimiento integral de postventa para Autosol Jujuy y NOA.
            </p>

            {/* Quick interactive search bar inspired by Autosol Transparente */}
            <form onSubmit={handleSearchSubmit} className="max-w-xl">
              <div className="relative flex items-center shadow-2xl rounded-2xl bg-slate-900/90 border border-slate-700/80 p-1.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Buscá por cliente, modelo (Taos, Amarok...), patente o DNI..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-md shrink-0 flex items-center gap-1.5"
                >
                  <span>Buscar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Tag suggestions */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2.5 text-xs text-slate-400">
                <span className="text-slate-400">Filtros rápidos:</span>
                {[
                  { label: 'Taos > 24 meses', val: 'Taos' },
                  { label: 'Amarok V6', val: 'Amarok' },
                  { label: 'Cumpleaños', val: 'Cumpleaños' },
                  { label: 'Ledesma', val: 'Ledesma' },
                  { label: 'Perico', val: 'Perico' },
                  { label: 'Postventa 10k km', val: 'Service' },
                ].map((tag) => (
                  <button
                    key={tag.label}
                    type="button"
                    onClick={() => {
                      onQuickFilter(tag.val);
                      onGoToClients();
                    }}
                    className="px-2.5 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </form>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onGoToAgenda}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-blue-900/40 hover:-translate-y-0.5"
              >
                <Calendar className="w-4 h-4" />
                <span>Ver Mi Agenda Diaria ({todayCount})</span>
              </button>

              <button
                onClick={onGoToBirthdays}
                className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-800 text-amber-300 border border-slate-700/80 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all hover:-translate-y-0.5"
              >
                <Cake className="w-4 h-4 text-amber-400" />
                <span>Cumpleaños & Aniversarios ({birthdaysCount})</span>
              </button>
            </div>
          </div>

          {/* Right Hero Automotive Preview Card */}
          <div className="lg:col-span-5">
            <div className="relative bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">Gama Volkswagen · Autosol</h2>
                    <p className="text-[11px] text-slate-400">Plataforma Inteligente de Fidelización</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  En Vivo
                </span>
              </div>

              {/* 4 Mini KPI Stat Blocks inside Hero */}
              <div className="grid grid-cols-2 gap-3">
                <div 
                  onClick={onGoToAgenda}
                  className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all hover:bg-slate-800/40"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Contactos Hoy</span>
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div className="text-2xl font-black text-white mt-1">{todayCount}</div>
                  <div className="text-[10px] text-blue-400 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>En agenda activa</span>
                  </div>
                </div>

                <div 
                  onClick={onGoToClients}
                  className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all hover:bg-slate-800/40"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Renovación 0km</span>
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-emerald-400 mt-1">{renewalCount}</div>
                  <div className="text-[10px] text-emerald-300">Taos / Amarok / Nivus</div>
                </div>

                <div 
                  onClick={onGoToBirthdays}
                  className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all hover:bg-slate-800/40"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Cumpleaños</span>
                    <Cake className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-amber-300 mt-1">{birthdaysCount}</div>
                  <div className="text-[10px] text-amber-400/80">WhatsApp listo en 1-clic</div>
                </div>

                <div 
                  onClick={onGoToClients}
                  className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 hover:border-sky-500/50 cursor-pointer transition-all hover:bg-slate-800/40"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Postventa & Taller</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                  </div>
                  <div className="text-2xl font-black text-sky-300 mt-1">{postventaCount}</div>
                  <div className="text-[10px] text-sky-400/80">1° y 2° Service oficial</div>
                </div>
              </div>

              {/* Quick tip box */}
              <div className="p-3 bg-blue-950/40 rounded-xl border border-blue-800/40 text-xs text-blue-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Cálculo automático de aniversarios de remito y cumpleaños.</span>
                </div>
                <button
                  onClick={onGoToAgenda}
                  className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-2.5 py-1 rounded-lg"
                >
                  Gestionar
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
