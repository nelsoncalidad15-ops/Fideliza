import { Customer } from '../types';

/**
 * Limpia y normaliza teléfonos de Argentina para wa.me
 * Formato internacional de Argentina: 54 9 [código de área sin 0] [número sin 15]
 * Ejemplo: "0388-154760579" -> "5493884760579"
 * Ejemplo: "M:0388-156412190" -> "5493886412190"
 */
export function sanitizePhoneForWhatsApp(phone: string): string {
  if (!phone) return '';
  // Eliminar prefijos de texto como "M:", "L:", barras, espacios y guiones
  let clean = phone.replace(/^[ML]:/i, '').replace(/[^\d]/g, '');

  // Si empieza con 0, quitarlo
  if (clean.startsWith('0')) {
    clean = clean.substring(1);
  }

  // Quitar el '15' típico de celulares en Argentina si está después del código de área
  // Códigos de área comunes del NOA: 388 (Jujuy), 387 (Salta), 3878 (Orán/Ledesma), 3888 (San Pedro)
  if (clean.startsWith('38815')) {
    clean = '388' + clean.substring(5);
  } else if (clean.startsWith('38715')) {
    clean = '387' + clean.substring(5);
  } else if (clean.startsWith('387815')) {
    clean = '3878' + clean.substring(6);
  } else if (clean.startsWith('388815')) {
    clean = '3888' + clean.substring(6);
  } else if (clean.startsWith('1115')) {
    clean = '11' + clean.substring(4);
  }

  // Si no tiene código de país (54), agregarlo
  if (!clean.startsWith('54')) {
    clean = '549' + clean;
  } else if (clean.startsWith('54') && !clean.startsWith('549')) {
    clean = '549' + clean.substring(2);
  }

  return clean;
}

export function sanitizePhoneForTel(phone: string): string {
  if (!phone) return '';
  // Mantener solo dígitos y signos permitidos en tel:
  const firstPhone = phone.split('/')[0].trim();
  const clean = firstPhone.replace(/^[ML]:/i, '').replace(/[^\d+]/g, '');
  return clean;
}

export type WhatsAppTemplateType = 
  | 'cumpleanos'
  | 'aniversario_entrega'
  | 'renovacion_propuesta'
  | 'service_recordatorio'
  | 'satisfaccion_postentrega'
  | 'cotizacion_usado'
  | 'mensaje_libre';

export interface WhatsAppTemplate {
  id: WhatsAppTemplateType;
  title: string;
  category: 'Fidelización' | 'Renovación' | 'Postventa';
  template: (customer: Customer, advisorName?: string) => string;
}

export const whatsAppTemplates: WhatsAppTemplate[] = [
  {
    id: 'cumpleanos',
    title: '🎂 Saludo de Cumpleaños + Beneficio',
    category: 'Fidelización',
    template: (customer, advisorName = 'tu asesor de Autosol') => {
      const nombre = customer.firstName || customer.fullName;
      const modelo = customer.vehicleModel;
      return `¡Hola ${nombre}! 🎂🎉 Desde Autosol Volkswagen queremos desearte un muy feliz cumpleaños. Te saluda ${advisorName}. Esperamos que pases un día excelente junto a tus seres queridos y disfrutando de tu ${modelo}. ¡Como agasajo, tenés una bonificación especial en taller y accesorios este mes! ¡Felicidades!`;
    }
  },
  {
    id: 'aniversario_entrega',
    title: '🚗 Aniversario de Entrega',
    category: 'Fidelización',
    template: (customer, advisorName = 'tu asesor de Autosol') => {
      const nombre = customer.firstName || customer.fullName;
      const modelo = customer.vehicleModel;
      const patente = customer.licensePlate;
      return `¡Hola ${nombre}! Te saluda ${advisorName} de Autosol Volkswagen. Hoy queremos celebrar un aniversario especial: ¡el tiempo que venís compartiendo junto a tu ${modelo} (${patente})! Queremos agradecerte por seguir confiando en nuestra concesionaria y saber cómo sentís tu vehículo. ¿Cómo viene tu experiencia?`;
    }
  },
  {
    id: 'renovacion_propuesta',
    title: '✨ Oportunidad de Renovación 0km',
    category: 'Renovación',
    template: (customer, advisorName = 'Autosol Volkswagen') => {
      const nombre = customer.firstName || customer.fullName;
      const modelo = customer.vehicleModel;
      const patente = customer.licensePlate;
      return `Hola ${nombre}, ¿cómo estás? Te escribe ${advisorName}. Nos comunicamos porque tu ${modelo} (${patente}) califica dentro de nuestro Programa de Renovación Preferencial de Autosol. Contamos con tasación especial de tu unidad como parte de pago y financiación a tasa promocional para subirte a tu próximo 0km. ¿Te gustaría que te preparemos una propuesta sin compromiso?`;
    }
  },
  {
    id: 'service_recordatorio',
    title: '🔧 Recordatorio Service Oficial (Garantía)',
    category: 'Postventa',
    template: (customer) => {
      const nombre = customer.firstName || customer.fullName;
      const modelo = customer.vehicleModel;
      const patente = customer.licensePlate;
      return `Hola ${nombre}! Te escribimos desde el área de Postventa de Autosol Volkswagen. Te recordamos que tu ${modelo} (${patente}) está en fecha para su servicio de mantenimiento oficial programado. Realizar el service en taller oficial protege la garantía de fábrica y asegura el óptimo rendimiento. ¿Querés que te reservemos un turno prioritario para esta semana?`;
    }
  },
  {
    id: 'satisfaccion_postentrega',
    title: '⭐ Control de Satisfacción Post-Entrega',
    category: 'Postventa',
    template: (customer, advisorName = 'tu asesor de Autosol') => {
      const nombre = customer.firstName || customer.fullName;
      const modelo = customer.vehicleModel;
      return `Hola ${nombre}! Te saluda ${advisorName} de Autosol Volkswagen. Esperamos que estés disfrutando muchísimo de tu nuevo ${modelo}. Queríamos acompañarte en estos primeros días de uso y ponernos a disposición por cualquier duda o consulta sobre el funcionamiento, conectividad o documentación de tu unidad. ¡Estamos a tu lado en cada kilómetro!`;
    }
  },
  {
    id: 'cotizacion_usado',
    title: '📊 Tasación de Usado y Cotización',
    category: 'Renovación',
    template: (customer, advisorName = 'Autosol') => {
      const nombre = customer.firstName || customer.fullName;
      const modelo = customer.vehicleModel;
      return `Hola ${nombre}! Te saluda ${advisorName}. En base a tu interés en renovar, tenemos abierta la cotización prioritaria para recibir tu ${modelo} llave contra llave, para que no te quedes a pie en ningún momento. ¿Cuándo te resultaría cómodo pasar por nuestra sucursal para la peritación de tu unidad?`;
    }
  }
];

export function buildWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = sanitizePhoneForWhatsApp(phone);
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

export function buildMailtoLink(email: string, subject: string, body: string): string {
  const encSub = encodeURIComponent(subject);
  const encBody = encodeURIComponent(body);
  return `mailto:${email}?subject=${encSub}&body=${encBody}`;
}

export function buildTelLink(phone: string): string {
  const clean = sanitizePhoneForTel(phone);
  return `tel:${clean}`;
}

/**
 * Calcula la antigüedad en meses desde la fecha de entrega o patentamiento
 */
export function calculateAgeInMonths(dateString: string): number {
  if (!dateString) return 0;
  // Puede venir como DD/MM/YYYY o YYYY-MM-DD
  let parts: string[] = [];
  if (dateString.includes('/')) {
    parts = dateString.split('/');
  } else if (dateString.includes('-')) {
    parts = dateString.split('-');
    parts = [parts[2], parts[1], parts[0]];
  }
  if (parts.length < 3) return 0;
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  let year = parseInt(parts[2], 10);
  if (year < 100) year += 2000;

  const targetDate = new Date(year, month, day);
  const today = new Date(); // Septiembre 2026 en contexto

  const months = (today.getFullYear() - targetDate.getFullYear()) * 12 + (today.getMonth() - targetDate.getMonth());
  return Math.max(0, months);
}
