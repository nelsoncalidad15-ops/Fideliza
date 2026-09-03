import React, { useState } from 'react';
import { X, FileCode2, Copy, Check, FileSpreadsheet, Smartphone, Terminal, ExternalLink } from 'lucide-react';

interface TechnicalGuideModalProps {
  onClose: () => void;
}

export const TechnicalGuideModal: React.FC<TechnicalGuideModalProps> = ({ onClose }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const appsScriptCode = `// Google Apps Script para Autosol Fideliza (Pegar en Extensiones > Apps Script de tu Google Sheet)
function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var rows = [];

  for (var i = 1; i < data.length; i++) {
    var row = {};
    for (var j = 0; j < headers.length; j++) {
      row[headers[j]] = data[i][j];
    }
    rows.push(row);
  }

  return ContentService.createTextOutput(JSON.stringify(rows))
    .setMimeType(ContentService.MimeType.JSON);
}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white w-full max-w-3xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Guía de Integración & Despliegue</h3>
              <p className="text-xs text-slate-400">Autosol Fideliza · Conexión Google Sheets, WhatsApp & VS Code</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto text-xs sm:text-sm text-slate-700">
          
          {/* Step 1: VS Code */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Terminal className="w-4 h-4 text-blue-600" />
              <span>1. Cómo ejecutar el proyecto en VS Code</span>
            </div>
            <p className="text-xs text-slate-600">
              Podés exportar el proyecto a ZIP o clonarlo en tu máquina local. Ejecutá en la terminal:
            </p>
            <div className="bg-slate-950 text-slate-200 p-3 rounded-xl font-mono text-xs relative">
              <code>
                npm install<br />
                npm run dev
              </code>
              <button
                onClick={() => copyText("npm install\nnpm run dev", "npm")}
                className="absolute right-3 top-3 text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-slate-300 flex items-center gap-1"
              >
                {copiedSection === "npm" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === "npm" ? "Copiado" : "Copiar"}</span>
              </button>
            </div>
          </div>

          {/* Step 2: Columns mapping */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>2. Estructura exacta de columnas de la Base de Autosol</span>
            </div>
            <p className="text-xs text-slate-600">
              El sistema procesa y calcula dinámicamente las fechas del CSV o Planilla oficial:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-bold text-slate-800">Modelo / Versión</div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-bold text-slate-800">Nº Chasis</div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-bold text-emerald-700">Fec.Remito (Entrega)</div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-bold text-rose-700">Fec.Nac.Cli (Cumple)</div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-bold text-slate-800">Nomb.Cliente / Apell.</div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-bold text-blue-700">Teléfono (WhatsApp)</div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-bold text-slate-800">Dominio (Patente)</div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-bold text-slate-800">Sucursal (Jujuy/Ledesma)</div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-bold text-slate-800">Asesor (Vendedor)</div>
            </div>
          </div>

          {/* Step 3: Google Apps Script API */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <ExternalLink className="w-4 h-4 text-purple-600" />
              <span>3. Conectar en vivo con Google Sheets (Web App gratuita)</span>
            </div>
            <p className="text-xs text-slate-600">
              Para tener sincronización directa sin servidores adicionales, podés crear un script en tu Google Sheet:
            </p>
            <div className="bg-slate-950 text-slate-200 p-3 rounded-xl font-mono text-[11px] relative max-h-40 overflow-y-auto">
              <pre>{appsScriptCode}</pre>
              <button
                onClick={() => copyText(appsScriptCode, "script")}
                className="absolute right-3 top-3 text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-slate-300 flex items-center gap-1"
              >
                {copiedSection === "script" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === "script" ? "Copiado" : "Copiar Script"}</span>
              </button>
            </div>
          </div>

          {/* Step 4: WhatsApp automation */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span>4. Enlaces inteligentes de WhatsApp (Argentina +549)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              El sanitizador de Autosol Fideliza convierte automáticamente teléfonos con formato local (ej: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">M:0388-154760579</code> o <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">3884760579</code>) al estándar internacional <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-emerald-800">5493884760579</code>, abriendo WhatsApp Web o la App móvil con el mensaje precargado en un clic.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
          >
            Entendido, volver al sistema
          </button>
        </div>

      </div>
    </div>
  );
};
