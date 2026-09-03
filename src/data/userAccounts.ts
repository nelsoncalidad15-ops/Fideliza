import { UserRole } from '../types';

export type AccessLevel = 'operario' | 'jefe' | 'administrador';
export type UserArea = 'ventas' | 'postventa' | 'ambos';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  level: AccessLevel;
  area: UserArea;
  active: boolean;
}

const STORAGE_KEY = 'autosol_fideliza_users_v1';

const initialAccounts: UserAccount[] = [
  { id: 'u-admin', name: 'Gerencia General Autosol', email: 'gerencia@autosol.com.ar', password: 'Autosol2026', level: 'administrador', area: 'ambos', active: true },
  { id: 'u-jefe', name: 'Jefe de Ventas', email: 'jefe.ventas@autosol.com.ar', password: 'Autosol2026', level: 'jefe', area: 'ventas', active: true },
  { id: 'u-jefe-pv', name: 'Jefe de Postventa', email: 'jefe.postventa@autosol.com.ar', password: 'Autosol2026', level: 'jefe', area: 'postventa', active: true },
  { id: 'u-gc', name: 'Gustavo Mauricio Cabezas', email: 'gcabezas@autosol.com.ar', password: 'Autosol2026', level: 'operario', area: 'ventas', active: true },
  { id: 'u-oy', name: 'Oscar Yevara', email: 'oyevara@autosol.com.ar', password: 'Autosol2026', level: 'operario', area: 'ventas', active: true },
  { id: 'u-mo', name: 'Mario Olmos', email: 'molmos@autosol.com.ar', password: 'Autosol2026', level: 'operario', area: 'ventas', active: true },
  { id: 'u-sp', name: 'Sofía Martínez', email: 'smartinez@autosol.com.ar', password: 'Autosol2026', level: 'operario', area: 'postventa', active: true },
];

export const getUserAccounts = (): UserAccount[] => {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Array<Omit<UserAccount, 'area'> & { area?: UserArea }>;
      const migrated = parsed.map(account => ({ ...account, area: account.area || (account.level === 'administrador' ? 'ambos' : 'ventas') } as UserAccount));
      const missingDefaults = initialAccounts.filter(defaultAccount => !migrated.some(account => account.id === defaultAccount.id));
      const merged = [...migrated, ...missingDefaults];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialAccounts));
  } catch {
    return initialAccounts;
  }
  return initialAccounts;
};

export const saveUserAccounts = (accounts: UserAccount[]) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
};

export const authenticateUser = (email: string, password: string) => getUserAccounts().find(account =>
  account.active && account.email.toLowerCase() === email.trim().toLowerCase() && account.password === password
);

export const roleForLevel = (level: AccessLevel, area: UserArea): UserRole => {
  if (level === 'administrador') return 'admin';
  if (level === 'jefe') return area === 'postventa' ? 'jefe_postventa' : 'jefe_ventas';
  return area === 'postventa' ? 'postventa' : 'asesor';
};

export const levelLabel: Record<AccessLevel, string> = {
  operario: 'Operario',
  jefe: 'Jefe',
  administrador: 'Administrador',
};
