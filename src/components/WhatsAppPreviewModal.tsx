import React, { useState } from 'react';
import { X, MessageSquare, Send, Copy, Check, Sparkles, Phone, ExternalLink, Car } from 'lucide-react';
import { Customer, Advisor } from '../types';
import { 
  sanitizePhoneForWhatsApp, 
  buildWhatsAppLink, 
  whatsAppTemplates,
  WhatsAppTemplateType 
} from '../utils/communication';

interface WhatsAppPreviewModalProps {
  customer: Customer;
  currentAdvisorName?: string;
  onClose: () => void;
  onLoggedAsSent?: (notes: string) => void;
}

export const WhatsAppPreviewModal: React.FC<WhatsAppPreviewModalProps> = ({
  customer,
  currentAdvisorName = 'Autosol Volkswagen',
  onClose,
  onLoggedAsSent,
}) => {
  // Elegir plantilla por defecto según motivo
  const getDefaultTemplateId = (): WhatsAppTemplateType => {
    if (customer.contactReason === 'Cumpleaños') return 'cumpleanos';
    if (customer.contactReason === 'Aniversario de entrega') return 'aniversario_entrega';
    if (customer.contactReason.includes('Service')) return 'service_recordatorio';
    if (customer.contactReason.includes('satisfacción')) return 'satisfaccion_postentrega';
    if (customer.contactReason === 'Interesado en cotización') return 'cotizacion_usado';
    return 'renovacion_propuesta';
  };

  const [selectedTemplateId, setSelectedTemplateId] = useState<WhatsAppTemplateType>(getDefaultTemplateId());
  
  const currentTemplate = whatsAppTemplates.find(t => t.id === selectedTemplateId) || whatsAppTemplates[0];
  const [customMessage, setCustomMessage] = useState(currentTemplate.template(customer, currentAdvisorName));
  const [copied, setCopied] = useState(false);

  const cleanPhone = sanitizePhoneForWhatsApp(customer.phone);
  const waUrl = buildWhatsAppLink(customer.phone, customMessage);

  const handleSelectTemplate = (id: WhatsAppTemplateType) => {
    setSelectedTemplateId(id);
    const tmpl = whatsAppTemplates.find(t => t.id === id);
    if (tmpl) {
      setCustomMessage(tmpl.template(customer, currentAdvisorName));
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(customMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    if (onLoggedAsSent) {
      onLoggedAsSent(`Envío de WhatsApp: "${currentTemplate.title}"`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header WhatsApp Style */}
        <div className="bg-emerald-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">{customer.fullName}</h3>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-800 text-emerald-100">
                  {customer.licensePlate}
                </span>
              </div>
              <p className="text-xs text-emerald-100 font-mono">
                {customer.phone} · Número internacional: +{cleanPhone}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-emerald-800/80 hover:bg-emerald-900 text-emerald-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs">
          
          {/* Template Selector */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Plantillas Inteligentes Automatizadas</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {whatsAppTemplates.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSelectTemplate(t.id)}
                  className={`p-2 rounded-xl text-left font-semibold border transition-all ${
                    selectedTemplateId === t.id
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-[11px] truncate">{t.title}</div>
                  <div className="text-[10px] text-slate-400 font-normal">{t.category}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle context info */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] flex items-center justify-between text-slate-600">
            <span className="font-semibold flex items-center gap-1">
              <Car className="w-3 h-3 text-blue-600" />
              {customer.vehicleModel}
            </span>
            <span>Entrega: {customer.deliveryDate || 'Sin dato'}</span>
          </div>

          {/* Message Preview / Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700">Mensaje a Enviar (Podés editarlo):</label>
              <button
                type="button"
                onClick={handleCopy}
                className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 text-[11px]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '¡Copiado!' : 'Copiar texto'}</span>
              </button>
            </div>

            {/* Chat bubble representation */}
            <div className="relative rounded-2xl bg-[#e5ddd5] p-3 border border-slate-300">
              <div className="bg-white rounded-2xl p-3 shadow-sm rounded-tl-none space-y-2">
                <textarea
                  rows={6}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-900 focus:outline-none resize-none leading-relaxed"
                ></textarea>
                <div className="text-right text-[10px] text-slate-400">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓
                </div>
              </div>
            </div>
          </div>

          {/* Direct Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
            >
              Cerrar
            </button>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (onLoggedAsSent) {
                  onLoggedAsSent(`WhatsApp enviado: ${currentTemplate.title}`);
                }
              }}
              className="flex-1 max-w-xs flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/30 transition-all hover:-translate-y-0.5"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Abrir en WhatsApp</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
