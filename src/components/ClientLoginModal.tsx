import React, { useEffect, useState } from 'react';
import { ArrowRight, Eye, EyeOff, Lock, Mail, X } from 'lucide-react';
import { authenticateUser, levelLabel, roleForLevel } from '../data/userAccounts';
import vwLogo from '../assets/logos/vw.png';
import { AuthenticatedUser } from './LoginView';

interface ClientLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStaffLogin: (user: AuthenticatedUser) => void;
}

export const ClientLoginModal: React.FC<ClientLoginModalProps> = ({ isOpen, onClose, onStaffLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) setError('');
  }, [isOpen]);

  if (!isOpen) return null;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const account = authenticateUser(email, password);
    if (!account) {
      setError('Correo o contraseña incorrectos.');
      return;
    }
    onStaffLogin({
      name: account.name,
      email: account.email,
      role: roleForLevel(account.level, account.area),
      avatar: '',
      department: levelLabel[account.level],
      internalPhone: '',
      dealership: 'Autosol',
    });
    setPassword('');
    onClose();
  };

  const handleQuickLogin = (role: 'gerencia' | 'jefe_ventas' | 'asesor' | 'jefe_postventa' | 'postventa') => {
    const roleProfiles: Record<string, AuthenticatedUser> = {
      gerencia: {
        name: 'SuperAdmin / Gerencia (Modo Diseñador)',
        email: 'gerencia@autosol.com.ar',
        role: 'gerencia',
        avatar: '',
        department: 'Gerencia General & Directorio',
        internalPhone: 'Troncal 9991',
        dealership: 'Autosol Jujuy',
      },
      jefe_ventas: {
        name: 'Jefe de Ventas',
        email: 'jefe.ventas@autosol.com.ar',
        role: 'jefe_ventas',
        avatar: '',
        department: 'Ventas 0km & Usados',
        internalPhone: 'Int. 1101',
        dealership: 'Autosol Jujuy',
      },
      asesor: {
        name: 'Mario Olmos (Asesor Ventas)',
        email: 'molmos@autosol.com.ar',
        role: 'asesor',
        avatar: '',
        department: 'Ventas Salón Central',
        internalPhone: 'Int. 1106',
        dealership: 'Autosol Jujuy',
      },
      jefe_postventa: {
        name: 'Jefe de Postventa',
        email: 'jefe.postventa@autosol.com.ar',
        role: 'jefe_postventa',
        avatar: '',
        department: 'Taller & Servicios',
        internalPhone: 'Int. 1001',
        dealership: 'Autosol Jujuy',
      },
      postventa: {
        name: 'Sofía Martínez (Operario Postventa)',
        email: 'smartinez@autosol.com.ar',
        role: 'postventa',
        avatar: '',
        department: 'Taller Central',
        internalPhone: 'Int. 1002',
        dealership: 'Autosol Jujuy',
      },
    };

    const target = roleProfiles[role];
    if (target) {
      onStaffLogin(target);
      onClose();
    }
  };

  return (
    <div className="login-backdrop" role="dialog" aria-modal="true" aria-labelledby="login-title">
      <form onSubmit={submit} className="login-card">
        <button type="button" onClick={onClose} className="login-close" aria-label="Cerrar"><X /></button>
        <div className="login-brand"><span><img src={vwLogo} alt="Volkswagen" /></span><strong>Autosol <small>Fideliza</small></strong></div>
        <h1 id="login-title">Ingresar</h1>

        <div className="login-fields">
          <label><span>Correo</span><div><Mail /><input required autoFocus type="email" value={email} onChange={event => { setEmail(event.target.value); setError(''); }} placeholder="nombre@autosol.com.ar" /></div></label>
          <label><span>Contraseña</span><div><Lock /><input required type={showPassword ? 'text' : 'password'} value={password} onChange={event => { setPassword(event.target.value); setError(''); }} /><button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>{showPassword ? <EyeOff /> : <Eye />}</button></div></label>
        </div>

        {error && <p className="login-error">{error}</p>}
        <button type="submit" className="login-submit">Ingresar <ArrowRight /></button>

        {/* ========================================================= */}
        {/* INGRESO POR DETRÁS (BACKDOOR TEMPORAL DE DISEÑO) */}
        {/* ========================================================= */}
        <div style={{
          marginTop: '1.25rem',
          paddingTop: '1rem',
          borderTop: '1px dashed #cbd5e1',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.625rem',
          }}>
            <span style={{
              fontSize: '0.6875rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              background: '#fef3c7',
              color: '#92400e',
              padding: '0.2rem 0.5rem',
              borderRadius: '0.375rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}>
              ⚡ Ingreso por Detrás (Backdoor)
            </span>
            <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>1 clic sin clave</span>
          </div>

          {/* Botón Maestro: Acceso a Todas las Pantallas */}
          <button
            type="button"
            onClick={() => handleQuickLogin('gerencia')}
            style={{
              width: '100%',
              padding: '0.65rem 0.85rem',
              marginBottom: '0.5rem',
              borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, #0284c7 0%, #001e50 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.75rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 2px 4px rgba(0,30,80,0.2)',
            }}
          >
            <span>👑 Ver TODAS las Pantallas (SuperAdmin)</span>
          </button>

          {/* Atajos a roles específicos para probar cada experiencia */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.375rem' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('jefe_ventas')}
              style={{
                padding: '0.45rem 0.5rem',
                fontSize: '0.6875rem',
                fontWeight: 600,
                borderRadius: '0.5rem',
                background: '#f1f5f9',
                color: '#334155',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              💼 Jefe Ventas
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('asesor')}
              style={{
                padding: '0.45rem 0.5rem',
                fontSize: '0.6875rem',
                fontWeight: 600,
                borderRadius: '0.5rem',
                background: '#f1f5f9',
                color: '#334155',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              🚗 Asesor (M. Olmos)
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('jefe_postventa')}
              style={{
                padding: '0.45rem 0.5rem',
                fontSize: '0.6875rem',
                fontWeight: 600,
                borderRadius: '0.5rem',
                background: '#f1f5f9',
                color: '#334155',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              🔧 Jefe Postventa
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('postventa')}
              style={{
                padding: '0.45rem 0.5rem',
                fontSize: '0.6875rem',
                fontWeight: 600,
                borderRadius: '0.5rem',
                background: '#f1f5f9',
                color: '#334155',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              🛠️ Op. Postventa
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
