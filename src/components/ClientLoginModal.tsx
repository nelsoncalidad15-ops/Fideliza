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
      </form>
    </div>
  );
};
