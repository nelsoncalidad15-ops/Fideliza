export interface TelephonyCall {
  id: string;
  dateTime: string;
  direction: 'Saliente' | 'Entrante' | '08xx Entrante';
  originName: string;
  originNumber: string;
  destinationLocation: string;
  destinationNumber: string;
  status: 'Contestada' | 'No contestada' | 'Cancelada';
  duration: string; // e.g. "00:00:09"
  durationSeconds: number;
  cost: number; // in ARS e.g. 35.30
  hasRecording: boolean;
  recordingTranscription?: string;
  customerName?: string;
  modelInterest?: string;
}

export const mockCallsData: TelephonyCall[] = [
  {
    id: 'call-1',
    dateTime: '2026-09-03 09:47:20',
    direction: 'Saliente',
    originName: 'Gimena Caram',
    originNumber: '1106',
    destinationLocation: 'ARGENTINA - JOAQUIN V GONZALEZ - MOVIL',
    destinationNumber: '0387715400105',
    status: 'Contestada',
    duration: '00:00:09',
    durationSeconds: 9,
    cost: 35.30,
    hasRecording: true,
    recordingTranscription: 'Asesora Gimena Caram contacta para confirmar turno de entrega de unidad 0km Volkswagen Taos.',
    customerName: 'Roberto Gómez',
    modelInterest: 'Taos Highline'
  },
  {
    id: 'call-2',
    dateTime: '2026-09-03 09:45:31',
    direction: 'Saliente',
    originName: 'Gimena Caram',
    originNumber: '1106',
    destinationLocation: 'ARGENTINA - SALTA - MOVIL',
    destinationNumber: '0387155522636',
    status: 'Contestada',
    duration: '00:00:37',
    durationSeconds: 37,
    cost: 25.52,
    hasRecording: true,
    recordingTranscription: 'Consulta sobre cotización de plan de ahorro y toma de usado llave contra llave en Jujuy.',
    customerName: 'María Fernanda Cruz',
    modelInterest: 'T-Cross Comfortline'
  },
  {
    id: 'call-3',
    dateTime: '2026-09-03 09:44:00',
    direction: 'Saliente',
    originName: 'Gimena Caram',
    originNumber: '1106',
    destinationLocation: 'ARGENTINA - SALTA - MOVIL',
    destinationNumber: '0387155821072',
    status: 'Contestada',
    duration: '00:00:05',
    durationSeconds: 5,
    cost: 25.52,
    hasRecording: true,
    recordingTranscription: 'Coordinación de visita al salón de ventas Casa Central San Salvador de Jujuy.',
    customerName: 'Carlos Alberto Morales',
    modelInterest: 'Amarok V6 Extreme'
  },
  {
    id: 'call-4',
    dateTime: '2026-09-03 09:43:22',
    direction: 'Entrante',
    originName: 'Grupo Cenoa Autosol Jujuy-Troncal',
    originNumber: '3884119271',
    destinationLocation: 'Sucursal Jujuy',
    destinationNumber: '9991',
    status: 'No contestada',
    duration: '00:00:00',
    durationSeconds: 0,
    cost: 0.00,
    hasRecording: false
  },
  {
    id: 'call-5',
    dateTime: '2026-09-03 09:43:22',
    direction: 'Saliente',
    originName: 'Grupo Cenoa Autosol Jujuy-Troncal',
    originNumber: '3884119271',
    destinationLocation: 'Sucursal Jujuy',
    destinationNumber: '9991',
    status: 'No contestada',
    duration: '00:00:00',
    durationSeconds: 0,
    cost: 0.00,
    hasRecording: false
  },
  {
    id: 'call-6',
    dateTime: '2026-09-03 09:43:19',
    direction: 'Saliente',
    originName: 'Gimena Caram',
    originNumber: '1106',
    destinationLocation: 'ARGENTINA - ROSARIO - MOVIL',
    destinationNumber: '0341157272002',
    status: 'Cancelada',
    duration: '00:00:00',
    durationSeconds: 0,
    cost: 0.00,
    hasRecording: false
  },
  {
    id: 'call-7',
    dateTime: '2026-09-03 09:42:57',
    direction: 'Entrante',
    originName: 'Grupo Cenoa Autosol Jujuy-Troncal',
    originNumber: '3884119271',
    destinationLocation: 'Preatendedor LA LUZ',
    destinationNumber: '08004444765',
    status: 'Contestada',
    duration: '00:00:25',
    durationSeconds: 25,
    cost: 0.00,
    hasRecording: false,
    recordingTranscription: 'Llamada ingresada por línea 0800 LA LUZ. Derivada a sector Postventa Jujuy.'
  },
  {
    id: 'call-8',
    dateTime: '2026-09-03 09:42:57',
    direction: '08xx Entrante',
    originName: 'Grupo Cenoa Autosol Jujuy-Troncal',
    originNumber: '3884119271',
    destinationLocation: 'Preatendedor LA LUZ',
    destinationNumber: '08004444765',
    status: 'Contestada',
    duration: '00:00:55',
    durationSeconds: 55,
    cost: 0.00,
    hasRecording: false
  },
  {
    id: 'call-9',
    dateTime: '2026-09-03 09:42:53',
    direction: 'Saliente',
    originName: 'Gimena Caram',
    originNumber: '1106',
    destinationLocation: 'ARGENTINA - SALTA - MOVIL',
    destinationNumber: '0387415864933',
    status: 'Cancelada',
    duration: '00:00:00',
    durationSeconds: 0,
    cost: 0.00,
    hasRecording: false
  },
  {
    id: 'call-10',
    dateTime: '2026-09-03 09:42:09',
    direction: 'Saliente',
    originName: 'Gimena Caram',
    originNumber: '1106',
    destinationLocation: 'ARGENTINA - SALTA - MOVIL',
    destinationNumber: '0387156033126',
    status: 'Contestada',
    duration: '00:00:03',
    durationSeconds: 3,
    cost: 25.52,
    hasRecording: true,
    recordingTranscription: 'Intento de contacto por renovación de garantía de 3 años Volkswagen.',
    customerName: 'Héctor Tapia',
    modelInterest: 'Polo Track'
  },
  {
    id: 'call-11',
    dateTime: '2026-09-03 09:41:40',
    direction: 'Saliente',
    originName: 'Luciana Fernández',
    originNumber: '1001',
    destinationLocation: 'ARGENTINA - SALTA - MOVIL',
    destinationNumber: '0387154063450',
    status: 'Contestada',
    duration: '00:03:27',
    durationSeconds: 207,
    cost: 102.08,
    hasRecording: true,
    recordingTranscription: 'Turno confirmado para 1er Service de 15.000 km en Taller Oficial Autosol Jujuy. Bonificación de filtro de polen incluida.',
    customerName: 'Santiago Benítez',
    modelInterest: 'Nivus Highline'
  },
  {
    id: 'call-12',
    dateTime: '2026-09-03 09:38:45',
    direction: 'Saliente',
    originName: 'Gimena Caram',
    originNumber: '1106',
    destinationLocation: 'ARGENTINA - SALTA - MOVIL',
    destinationNumber: '0387155983780',
    status: 'Contestada',
    duration: '00:03:11',
    durationSeconds: 191,
    cost: 102.08,
    hasRecording: true,
    recordingTranscription: 'Charla con cliente que cumple 30 meses de posesión de su Amarok. Interés concreto en renovar con tasa 0%.',
    customerName: 'Dr. Alejandro Rueda',
    modelInterest: 'Amarok V6 Highline'
  },
  {
    id: 'call-13',
    dateTime: '2026-09-03 09:38:05',
    direction: 'Saliente',
    originName: 'Gimena Caram',
    originNumber: '1106',
    destinationLocation: 'ARGENTINA - SALTA - MOVIL',
    destinationNumber: '0387155005375',
    status: 'Contestada',
    duration: '00:00:02',
    durationSeconds: 2,
    cost: 25.52,
    hasRecording: true,
    recordingTranscription: 'Mensaje de voz solicitando contacto por WhatsApp oficial de Autosol.',
    customerName: 'Esteban Quispe'
  }
];

export const mockDailyMinutesData = [
  { date: '8/4', minutos: 1450, llamadas: 720 },
  { date: '8/6', minutos: 1240, llamadas: 680 },
  { date: '8/8', minutos: 80, llamadas: 45 },
  { date: '8/9', minutos: 40, llamadas: 20 },
  { date: '8/10', minutos: 1520, llamadas: 810 },
  { date: '8/12', minutos: 1200, llamadas: 640 },
  { date: '8/14', minutos: 1190, llamadas: 630 },
  { date: '8/16', minutos: 95, llamadas: 52 },
  { date: '8/18', minutos: 2210, llamadas: 1120 },
  { date: '8/20', minutos: 1540, llamadas: 790 },
  { date: '8/22', minutos: 920, llamadas: 510 },
  { date: '8/23', minutos: 85, llamadas: 42 },
  { date: '8/24', minutos: 1780, llamadas: 890 },
  { date: '8/26', minutos: 1290, llamadas: 670 },
  { date: '8/28', minutos: 880, llamadas: 460 },
  { date: '8/30', minutos: 60, llamadas: 30 },
  { date: '9/1', minutos: 1420, llamadas: 730 },
  { date: '9/2', minutos: 1160, llamadas: 610 },
  { date: '9/3', minutos: 180, llamadas: 95 }
];
