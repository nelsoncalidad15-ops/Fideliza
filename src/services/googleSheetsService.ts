import { Customer, InteractionLog } from '../types';
import { initialCustomers } from '../data/mockData';

const SHEETS_URL_KEY = 'autosol_sheets_url';
const SHEETS_TOKEN_KEY = 'autosol_sheets_token';
export const DEFAULT_API_TOKEN = 'AUTOSOL_SECURE_TOKEN_2026';

export const getSheetsEndpoint = (): string => {
  try {
    const saved = localStorage.getItem(SHEETS_URL_KEY);
    if (saved && saved.trim()) return saved.trim();
  } catch {}
  return (import.meta as any).env?.VITE_GOOGLE_APPS_SCRIPT_URL || '';
};

export const saveSheetsEndpoint = (url: string) => {
  try {
    localStorage.setItem(SHEETS_URL_KEY, url.trim());
  } catch {}
};

export const getSheetsToken = (): string => {
  try {
    const saved = localStorage.getItem(SHEETS_TOKEN_KEY);
    if (saved && saved.trim()) return saved.trim();
  } catch {}
  return DEFAULT_API_TOKEN;
};

export const saveSheetsToken = (token: string) => {
  try {
    localStorage.setItem(SHEETS_TOKEN_KEY, token.trim());
  } catch {}
};

export interface SheetFetchResult {
  success: boolean;
  customers: Customer[];
  source: 'sheets' | 'local';
  message?: string;
}

const normalize = (str: string) => str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/direccion\s*-|lic\./gi, '').trim();

/**
 * Consulta clientes a Google Sheets vía Apps Script.
 * Aplica protección de datos: si el rol es asesor, el endpoint o cliente filtra solo su cartera.
 */
export async function fetchCustomersFromSheet(
  user?: { name: string; email: string; role: string } | null
): Promise<SheetFetchResult> {
  const endpoint = getSheetsEndpoint();

  if (!endpoint) {
    return {
      success: true,
      customers: initialCustomers,
      source: 'local',
      message: 'Operando con base local. Conectá Google Sheets para sincronizar en vivo.'
    };
  }

  try {
    const params = new URLSearchParams({
      action: 'get_customers',
      token: getSheetsToken(),
      role: user?.role || 'asesor',
      advisor: user?.name || '',
      email: user?.email || '',
    });

    const url = endpoint.includes('?') ? `${endpoint}&${params.toString()}` : `${endpoint}?${params.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    const json = await response.json();
    if (json.status === 'success' && Array.isArray(json.data) && json.data.length > 0) {
      const mappedCustomers: Customer[] = json.data.map((row: any, index: number) => ({
        id: String(row.id || `sheet_${index + 1}`),
        fullName: String(row.fullName || row.nombre || 'Sin nombre'),
        firstName: row.firstName || (row.fullName ? row.fullName.split(' ')[0] : ''),
        lastName: row.lastName || '',
        docNumber: String(row.docNumber || row.dni || row.cuit || ''),
        cuit: row.cuit ? String(row.cuit) : undefined,
        phone: String(row.phone || row.telefono || ''),
        contactPhone: row.contactPhone ? String(row.contactPhone) : undefined,
        email: String(row.email || row.correo || ''),
        address: String(row.address || row.direccion || 'Jujuy'),
        city: String(row.city || row.ciudad || 'San Salvador de Jujuy'),
        zipCode: String(row.zipCode || row.cp || '4600'),
        branch: (row.branch || row.sucursal || 'San Salvador de Jujuy') as any,
        vehicleModel: String(row.vehicleModel || row.modelo || 'Volkswagen 0km'),
        brand: 'Volkswagen',
        modelFamily: (row.modelFamily || row.familia || 'Taos') as any,
        chassisNumber: String(row.chassisNumber || row.chasis || ''),
        licensePlate: String(row.licensePlate || row.patente || row.dominio || ''),
        deliveryDate: String(row.deliveryDate || row.fechaEntrega || ''),
        registrationDate: String(row.registrationDate || row.fechaPatentamiento || row.deliveryDate || ''),
        birthDate: row.birthDate || row.fechaNacimiento || undefined,
        advisor: String(row.advisor || row.asesor || 'Asesor Autosol'),
        originalAdvisor: row.originalAdvisor || row.vendedorOriginal || undefined,
        state: (row.state || row.estado || 'Pendiente') as any,
        contactReason: (row.contactReason || row.motivo || 'Renovación preferencial') as any,
        lastContactDate: row.lastContactDate || row.ultimoContacto || undefined,
        nextScheduledContact: row.nextScheduledContact || row.proximoContacto || undefined,
        priority: (row.priority || row.prioridad || 'Media') as any,
        category: (row.category || row.categoria || 'Ventas') as any,
        tags: Array.isArray(row.tags) ? row.tags : (row.tags ? String(row.tags).split(',').map((t: string) => t.trim()) : ['Google Sheet']),
        notes: row.notes || row.observaciones || undefined,
        history: Array.isArray(row.history) ? row.history : [],
      }));

      // Capa de seguridad adicional del lado del cliente:
      if (user && user.role === 'asesor') {
        const userKey = normalize(user.name);
        const filtered = mappedCustomers.filter(c => {
          const adv = normalize(c.advisor);
          return adv.includes(userKey) || userKey.includes(adv);
        });
        return { success: true, customers: filtered, source: 'sheets' };
      }

      return { success: true, customers: mappedCustomers, source: 'sheets' };
    }

    throw new Error(json.message || 'Formato de respuesta no reconocido');
  } catch (err: any) {
    console.warn('No se pudo sincronizar con Google Sheets, usando base local:', err);
    return {
      success: false,
      customers: initialCustomers,
      source: 'local',
      message: `No se pudo conectar a Google Sheets: ${err?.message || 'Error de conexión'}. Usando base local.`
    };
  }
}

/**
 * Envía una nueva gestión comercial al Google Sheet
 */
export async function syncManagementToSheet(
  customerId: string,
  data: {
    date: string;
    channel: string;
    result: string;
    notes: string;
    detectedInterest?: string;
    nextFollowUpDate?: string;
    advisorName: string;
    customerName?: string;
    vehicleModel?: string;
    licensePlate?: string;
  }
): Promise<boolean> {
  const endpoint = getSheetsEndpoint();
  if (!endpoint) return false;

  try {
    await fetch(endpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'log_interaction',
        token: getSheetsToken(),
        customerId,
        ...data,
      }),
    });
    return true;
  } catch (err) {
    console.warn('Error al guardar gestión en Google Sheets:', err);
    return false;
  }
}
