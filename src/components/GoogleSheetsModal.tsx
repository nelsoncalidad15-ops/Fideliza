import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Check, 
  X, 
  ExternalLink, 
  RefreshCw, 
  ShieldCheck, 
  Copy, 
  AlertCircle,
  Database
} from 'lucide-react';
import { getSheetsEndpoint, saveSheetsEndpoint, fetchCustomersFromSheet } from '../services/googleSheetsService';
import { Customer } from '../types';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomersLoaded: (customers: Customer[]) => void;
  currentUser: any;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  onCustomersLoaded,
  currentUser,
}) => {
  const [url, setUrl] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setUrl(getSheetsEndpoint());
      setFeedback(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = url.trim();
    setIsTesting(true);
    setFeedback(null);

    saveSheetsEndpoint(cleanUrl);

    if (!cleanUrl) {
      setIsTesting(false);
      setFeedback({
        type: 'info',
        text: 'Se desvinculó Google Sheets. La aplicación volverá a utilizar los datos locales de prueba.'
      });
      return;
    }

    try {
      const result = await fetchCustomersFromSheet(currentUser);
      setIsTesting(false);
      if (result.success && result.source === 'sheets') {
        onCustomersLoaded(result.customers);
        setFeedback({
          type: 'success',
          text: `¡Conexión exitosa! Se sincronizaron ${result.customers.length} clientes en vivo desde Google Sheets.`
        });
      } else {
        setFeedback({
          type: 'error',
          text: result.message || 'No se pudieron recuperar clientes desde esa URL. Verificá que la implementación esté como "Cualquier usuario" (Anyone).'
        });
      }
    } catch (err: any) {
      setIsTesting(false);
      setFeedback({
        type: 'error',
        text: 'Error de red al conectar con Apps Script: ' + (err?.message || 'Desconocido')
      });
    }
  };

  const handleCopyScriptInstructions = () => {
    navigator.clipboard.writeText('El código se encuentra listo en el archivo google_apps_script.js en la raíz del proyecto.');
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 3000);
  };

  const isConnected = Boolean(url && url.startsWith('http'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-fade-in font-sans">
      <div className="bg-white w-full max-w-xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <header className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Conexión con Google Sheets</h2>
              <p className="text-xs text-slate-400">Base de clientes protegida en la nube mediante Apps Script</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-600">
          
          {/* Security Banner */}
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="block text-blue-950 font-bold">Protección y Privacidad de la Base</strong>
              <p className="leading-relaxed">
                Nadie puede cargar clientes manualmente ni descargar la base entera. Cuando un asesor ingresa a su agenda, Apps Script filtra en el servidor y <strong>solo le envía sus clientes asignados</strong>, impidiendo la extracción de la cartera de la concesionaria.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleTestAndSave} className="space-y-4">
            <div>
              <label className="block font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                <span>URL de la Aplicación Web (Apps Script)</span>
                {isConnected && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Configurada
                  </span>
                )}
              </label>
              <input
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 text-xs font-mono outline-none focus:border-blue-600 focus:bg-white"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Podés pegar aquí la URL de implementación que te entrega Google Sheets.
              </p>
            </div>

            {feedback && (
              <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-2 ${
                feedback.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                  : feedback.type === 'error' 
                  ? 'bg-rose-50 text-rose-800 border-rose-300' 
                  : 'bg-slate-100 text-slate-700 border-slate-300'
              }`}>
                {feedback.type === 'success' && <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
                {feedback.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
                <span>{feedback.text}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setUrl('');
                  saveSheetsEndpoint('');
                  setFeedback({ type: 'info', text: 'URL borrada. Modo local activado.' });
                }}
                className="text-slate-400 hover:text-rose-600 text-xs font-semibold"
              >
                Desconectar (usar base local)
              </button>

              <button
                type="submit"
                disabled={isTesting}
                className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 transition flex items-center gap-2 shadow-xs disabled:opacity-50"
              >
                {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                {isTesting ? 'Verificando...' : 'Guardar y Sincronizar'}
              </button>
            </div>
          </form>

          {/* Quick Setup Instructions Accordion */}
          <details className="rounded-2xl border border-slate-200 p-4 bg-slate-50/70 group">
            <summary className="cursor-pointer font-bold text-slate-800 flex items-center justify-between text-xs select-none">
              <span>¿Cómo crear la hoja y obtener esta URL en 3 minutos?</span>
              <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-3 space-y-2.5 text-[11px] text-slate-600 leading-relaxed border-t border-slate-200 pt-3">
              <p><strong>1.</strong> Creá un Google Sheet vacío en tu cuenta de Google (ej: <em>Base Clientes Autosol</em>).</p>
              <p><strong>2.</strong> Andá a <strong>Extensiones &gt; Apps Script</strong>.</p>
              <p><strong>3.</strong> Pegá el código que dejamos en el archivo <code>google_apps_script.js</code> de este proyecto.</p>
              <p><strong>4.</strong> En el selector de funciones, ejecutá <code>crearEstructuraInicial</code> (crea las columnas y el estilo de Autosol).</p>
              <p><strong>5.</strong> Tocá <strong>Implementar &gt; Nueva implementación &gt; Aplicación web</strong>.</p>
              <p><strong>6.</strong> Elegí en acceso: <em>Cualquier usuario (Anyone)</em> y copiá la URL que termina en <code>/exec</code>.</p>
              <button
                type="button"
                onClick={handleCopyScriptInstructions}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold text-[10px] hover:bg-slate-50 transition"
              >
                <Copy className="w-3 h-3 text-slate-500" />
                {copiedScript ? '¡Referencia copiada!' : 'Ver archivo google_apps_script.js en tu carpeta'}
              </button>
            </div>
          </details>

        </div>

        {/* Footer */}
        <footer className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
          >
            Listo
          </button>
        </footer>
      </div>
    </div>
  );
};
