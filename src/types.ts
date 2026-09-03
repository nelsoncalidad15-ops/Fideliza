export type CustomerState = 
  | 'Pendiente'
  | 'Contactado'
  | 'No respondió'
  | 'Interesado'
  | 'No interesado'
  | 'Seguimiento'
  | 'Potencial renovación'
  | 'Postventa'
  | 'Oportunidad activa'
  | 'Renovado';

export type ContactChannel = 'WhatsApp' | 'Llamada' | 'Mail' | 'Presencial';

export type ContactReason = 
  | 'Renovación 12 meses'
  | 'Renovación 24 meses'
  | 'Renovación 36 meses'
  | 'Cumpleaños'
  | 'Aniversario de entrega'
  | 'Seguimiento de entrega'
  | 'Seguimiento satisfacción 48hs'
  | 'Primer Service 10.000 km / 1 año'
  | 'Segundo Service 20.000 km / 2 años'
  | 'Interesado en cotización'
  | 'Interesado en entregar usado'
  | 'Interesado en financiación'
  | 'Campaña especial'
  | 'Seguimiento reprogramado'
  | 'Postventa'
  | string;

/** Roles de producto. Los nombres existentes se mantienen para no romper el
 * directorio de demostración ni los permisos ya conectados. */
export type UserRole =
  | 'admin'
  | 'jefe_ventas'
  | 'asesor'
  | 'jefe_postventa'
  | 'postventa'
  | 'calidad'
  | 'gerencia';

export type ManagementResult =
  | 'No respondió'
  | 'Contactado'
  | 'No interesado'
  | 'Interesado'
  | 'Quiere cotización'
  | 'Quiere entregar usado'
  | 'Interesado en financiación'
  | 'Volver a contactar'
  | 'No contactar comercialmente'
  | 'No contactar hasta'
  | 'Renovado'
  | 'Seguimiento postventa';

export interface InteractionLog {
  id: string;
  date: string; // ISO or DD/MM/YYYY
  channel: ContactChannel;
  result: ManagementResult;
  notes: string;
  detectedInterest?: string;
  nextFollowUpDate?: string;
  advisorName: string;
}

export interface Customer {
  id: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  docNumber: string; // DNI o CUIT
  cuit?: string;
  phone: string;
  contactPhone?: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  branch: 'San Salvador de Jujuy' | 'Ledesma' | 'Perico' | 'Salta';
  
  // Vehículo y compra
  vehicleModel: string; // ej: VOLKSWAGEN TAOS Highline 250TSI AT MY26
  brand: string; // Volkswagen
  modelFamily: 'Taos' | 'Amarok' | 'Nivus' | 'T-Cross' | 'Polo' | 'Virtus' | 'Tiguan' | 'Tera' | 'Otro';
  chassisNumber: string;
  licensePlate: string; // Dominio (ej: AI464QL)
  deliveryDate: string; // Fec. Remito (ej: 11/02/2025 o 2026)
  registrationDate: string; // Fecha Patentamiento
  cancellationDate?: string; // Fec. Anul.
  birthDate?: string; // Fec. Nac. Cli. (ej: 23/09/1967)
  
  // Asignación y Comercial
  advisor: string; // Asesor asignado (ej: GUSTAVO MAURICIO CABEZAS, O. Yevara, M. Olmos)
  originalAdvisor?: string;
  state: CustomerState;
  contactReason: ContactReason;
  lastContactDate?: string;
  nextScheduledContact?: string;
  priority: 'Alta' | 'Media' | 'Baja';
  
  // Perfil Fidelización & Postventa
  category: 'Ventas' | 'Postventa' | 'Ambos';
  tags: string[];
  notes?: string;
  estimatedKm?: number;
  lastServiceDate?: string;
  lastServiceKm?: number;
  tradeInInterest?: boolean; // Interés en entregar usado
  financingInterest?: boolean;
  /** Preferencias de contacto: excluyen al cliente de nuevas campañas. */
  noCommercialContact?: boolean;
  noContactUntil?: string;
  history: InteractionLog[];
}

export interface Advisor {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Asesor Comercial' | 'Jefe de Ventas' | 'Asesor de Servicio Postventa' | 'Gerencia';
  avatar: string;
  assignedCustomersCount: number;
  contactedTodayCount: number;
  renewalsCount: number;
  branch: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  targetModel?: string;
  minAgeMonths?: number;
  maxAgeMonths?: number;
  targetAudience: string;
  createdDate: string;
  active: boolean;
  matchedCustomerCount: number;
  suggestedMessage: string;
}
