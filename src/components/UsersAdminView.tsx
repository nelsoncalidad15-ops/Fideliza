import React, { useMemo, useState } from 'react';
import { Check, Plus, Search, Shield, UserCog, X } from 'lucide-react';
import { AccessLevel, levelLabel, saveUserAccounts, UserAccount, UserArea } from '../data/userAccounts';

const permissions: Record<AccessLevel, string> = {
  operario: 'Clientes y agenda',
  jefe: 'Gestión e indicadores',
  administrador: 'Acceso total',
};

interface UsersAdminViewProps {
  accounts: UserAccount[];
  onAccountsChange: (accounts: UserAccount[]) => void;
}

export const UsersAdminView: React.FC<UsersAdminViewProps> = ({ accounts, onAccountsChange }) => {
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState('');
  const [feedback, setFeedback] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', level: 'operario' as AccessLevel, area: 'ventas' as UserArea });

  const persist = (next: UserAccount[], message: string) => {
    onAccountsChange(next);
    saveUserAccounts(next);
    setFeedback(message);
    window.setTimeout(() => setFeedback(''), 2400);
  };

  const createUser = (event: React.FormEvent) => {
    event.preventDefault();
    if (accounts.some(account => account.email.toLowerCase() === form.email.trim().toLowerCase())) {
      setFeedback('Ese correo ya está registrado.');
      return;
    }
    const next = [{
      id: `u-${Date.now()}`,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      level: form.level,
      area: form.level === 'administrador' ? 'ambos' : form.area,
      active: true,
    }, ...accounts];
    persist(next, 'Usuario creado.');
    setForm({ name: '', email: '', password: '', level: 'operario', area: 'ventas' });
    setCreating(false);
  };

  const visibleAccounts = useMemo(() => {
    const value = search.toLowerCase();
    return accounts.filter(account => !value || account.name.toLowerCase().includes(value) || account.email.toLowerCase().includes(value));
  }, [accounts, search]);

  const isLastActiveAdmin = (account: UserAccount) => account.level === 'administrador' && account.active && accounts.filter(item => item.level === 'administrador' && item.active).length === 1;

  const changeLevel = (account: UserAccount, level: AccessLevel) => {
    if (level !== 'administrador' && isLastActiveAdmin(account)) {
      setFeedback('Debe quedar al menos un administrador activo.');
      return;
    }
    persist(accounts.map(item => item.id === account.id ? { ...item, level, area: level === 'administrador' ? 'ambos' : item.area === 'ambos' ? 'ventas' : item.area } : item), 'Nivel actualizado.');
  };

  const toggleStatus = (account: UserAccount) => {
    if (isLastActiveAdmin(account)) {
      setFeedback('Debe quedar al menos un administrador activo.');
      return;
    }
    persist(accounts.map(item => item.id === account.id ? { ...item, active: !item.active } : item), account.active ? 'Usuario desactivado.' : 'Usuario activado.');
  };

  return (
    <div className="staff-view users-view">
      <header className="screen-header">
        <div className="screen-header__title"><span className="screen-header__icon"><UserCog /></span><div><h1>Usuarios</h1></div></div>
        <button className="users-new" onClick={() => setCreating(value => !value)}>{creating ? <X /> : <Plus />}{creating ? 'Cancelar' : 'Nuevo usuario'}</button>
      </header>

      {creating && (
        <form className="user-create" onSubmit={createUser}>
          <label><span>Nombre</span><input required value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} /></label>
          <label><span>Correo</span><input required type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} placeholder="nombre@autosol.com.ar" /></label>
          <label><span>Contraseña inicial</span><input required minLength={8} type="text" value={form.password} onChange={event => setForm({ ...form, password: event.target.value })} /></label>
          <label><span>Área</span><select value={form.level === 'administrador' ? 'ambos' : form.area} disabled={form.level === 'administrador'} onChange={event => setForm({ ...form, area: event.target.value as UserArea })}><option value="ventas">Ventas</option><option value="postventa">Postventa</option><option value="ambos">Ambas</option></select></label>
          <label><span>Nivel</span><select value={form.level} onChange={event => { const level = event.target.value as AccessLevel; setForm({ ...form, level, area: level === 'administrador' ? 'ambos' : form.area === 'ambos' ? 'ventas' : form.area }); }}>{Object.entries(levelLabel).map(([value, label]) => <option key={value} value={value}>{label} · {permissions[value as AccessLevel]}</option>)}</select></label>
          <button type="submit"><Check />Crear usuario</button>
        </form>
      )}

      {feedback && <div className="users-feedback"><Check />{feedback}</div>}

      <section className="users-panel">
        <div className="users-toolbar">
          <div><strong>{accounts.length} usuarios</strong></div>
          <label className="compact-search"><Search /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar usuario" /></label>
        </div>
        <div className="users-head"><span>Usuario</span><span>Área</span><span>Nivel</span><span>Estado</span></div>
        {visibleAccounts.map(account => (
          <article className="user-row" key={account.id}>
            <div className="user-identity"><span>{account.name.slice(0, 1).toUpperCase()}</span><div><strong>{account.name}</strong><small>{account.email}</small></div></div>
            <select className="user-area" value={account.area} disabled={account.level === 'administrador'} onChange={event => persist(accounts.map(item => item.id === account.id ? { ...item, area: event.target.value as UserArea } : item), 'Área actualizada.')}><option value="ventas">Ventas</option><option value="postventa">Postventa</option><option value="ambos">Ambas</option></select>
            <label className="user-level"><Shield /><select value={account.level} onChange={event => changeLevel(account, event.target.value as AccessLevel)}>{Object.entries(levelLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <button className={account.active ? 'user-status is-active' : 'user-status'} onClick={() => toggleStatus(account)}>{account.active ? 'Activo' : 'Inactivo'}</button>
          </article>
        ))}
      </section>
    </div>
  );
};
