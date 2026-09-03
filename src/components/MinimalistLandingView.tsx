import React, { useRef } from 'react';
import { ArrowDown, ArrowRight, CalendarDays, CheckCircle2, Users } from 'lucide-react';
import { Advisor, Customer } from '../types';
import { AuthenticatedUser } from './LoginView';
import vehicleImage from '../assets/images/vw-taos-fideliza.png';
import vwLogo from '../assets/logos/vw.png';

interface MinimalistLandingViewProps {
  onNavigate: (view: string) => void;
  customers: Customer[];
  advisors: Advisor[];
  onOpenCustomerDetail: (customer: Customer) => void;
  onOpenLogin?: () => void;
  loggedInCustomer?: Customer | null;
  loggedInStaff?: AuthenticatedUser | null;
  onOpenCustomerPortal?: () => void;
}

const workAreas = [
  { icon: CalendarDays, title: 'Agenda', copy: 'Qué hacer hoy.' },
  { icon: Users, title: 'Clientes', copy: 'Toda la cartera, a mano.' },
  { icon: CheckCircle2, title: 'Seguimiento', copy: 'El próximo paso, claro.' },
];

export const MinimalistLandingView: React.FC<MinimalistLandingViewProps> = ({
  onNavigate,
  onOpenLogin,
  loggedInStaff,
}) => {
  const workspaceRef = useRef<HTMLElement>(null);
  const enter = () => loggedInStaff ? onNavigate('agenda') : onOpenLogin?.();
  const discover = () => workspaceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <main className="fideliza-landing">
      <section className="fideliza-hero">
        <img src={vehicleImage} alt="Volkswagen Taos azul" className="fideliza-hero__image" />
        <div className="fideliza-hero__overlay" />

        <header className="fideliza-header">
          <div className="fideliza-header__inner">
            <div className="fideliza-brand" aria-label="Autosol Fideliza">
              <span className="fideliza-brand__mark">
                <img src={vwLogo} alt="Volkswagen" />
              </span>
              <span className="fideliza-brand__name">
                <strong>Autosol</strong>
                <small>Fideliza</small>
              </span>
            </div>
            <button onClick={enter} className="fideliza-header__login">
              {loggedInStaff ? 'Mi agenda' : 'Ingresar'}
            </button>
          </div>
        </header>

        <div className="fideliza-hero__content">
          <div className="fideliza-hero__copy">
            <p className="fideliza-eyebrow">Autosol Fideliza</p>
            <h1>La relación sigue después de la entrega.</h1>
            <p className="fideliza-hero__description">
              Una plataforma interna para contactar, registrar y acompañar mejor a cada cliente.
            </p>
          </div>
        </div>

        <button onClick={discover} className="fideliza-discover">
          <span>Descubrí más</span>
          <ArrowDown aria-hidden="true" />
        </button>
      </section>

      <section id="herramientas" ref={workspaceRef} className="fideliza-workspace">
        <div className="fideliza-workspace__inner">
          <div className="fideliza-workspace__heading">
            <p className="fideliza-eyebrow fideliza-eyebrow--blue">Gestión interna</p>
            <h2>Todo lo importante,<br />en un solo lugar.</h2>
            <p>Entrá, contactá y registrá. Nada más.</p>
          </div>

          <div className="fideliza-tools">
            {workAreas.map(({ icon: Icon, title, copy }) => (
              <article key={title} className="fideliza-tool">
                <span className="fideliza-tool__icon"><Icon aria-hidden="true" /></span>
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </article>
            ))}
          </div>

          <button onClick={enter} className="fideliza-workspace__login">
            {loggedInStaff ? 'Ir a mi agenda' : 'Ingresar al sistema'}
            <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </section>
    </main>
  );
};
