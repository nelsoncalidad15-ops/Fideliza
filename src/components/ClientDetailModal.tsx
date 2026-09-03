import React from 'react';
import { Award, CalendarDays, Car, ChevronDown, Clock, Mail, MapPin, MessageSquare, Phone, PlusCircle, UserRound, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Customer } from '../types';
import { buildMailtoLink, buildTelLink, calculateAgeInMonths } from '../utils/communication';

interface ClientDetailModalProps {
  customer: Customer;
  onClose: () => void;
  onOpenManagementModal: (c: Customer) => void;
  onOpenWhatsAppModal: (c: Customer) => void;
  onMarkAsRenewed: (customerId: string) => void;
}

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({
  customer,
  onClose,
  onOpenManagementModal,
  onOpenWhatsAppModal,
  onMarkAsRenewed,
}) => {
  const ageMonths = calculateAgeInMonths(customer.deliveryDate || customer.registrationDate);

  const markRenewed = () => {
    confetti({ particleCount: 70, spread: 65, origin: { y: .6 }, colors: ['#001e50', '#0050d8', '#10b981'] });
    onMarkAsRenewed(customer.id);
  };

  return (
    <div className="client-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="client-name">
      <div className="client-modal">
        <header className="client-modal__header">
          <div className="client-modal__identity">
            <div><h2 id="client-name">{customer.fullName}</h2><p>{customer.cuit || customer.docNumber} · {customer.city}</p></div>
            <span className="client-modal__status">{customer.state}</span>
          </div>
          <button onClick={onClose} className="client-modal__close" aria-label="Cerrar"><X /></button>
        </header>

        <div className="client-actions">
          <button className="whatsapp" onClick={() => onOpenWhatsAppModal(customer)}><MessageSquare />WhatsApp</button>
          <a href={buildTelLink(customer.phone)}><Phone />Llamar</a>
          <a href={buildMailtoLink(customer.email, 'Autosol Volkswagen', `Hola ${customer.fullName},\n\n`) }><Mail />Email</a>
          <button className="manage" onClick={() => onOpenManagementModal(customer)}><PlusCircle />Registrar</button>
          {customer.state !== 'Renovado' && <button className="renew" onClick={markRenewed}><Award />Renovado</button>}
        </div>

        <div className="client-modal__body">
          <section className="client-keyfacts">
            <div><CalendarDays /><span>Próximo contacto</span><strong>{customer.nextScheduledContact || 'Sin fecha'}</strong></div>
            <div><Clock /><span>Antigüedad</span><strong>{ageMonths} meses</strong></div>
            <div><UserRound /><span>Asesor</span><strong>{customer.advisor.replace('Direccion - ', '')}</strong></div>
          </section>

          <section className="client-info-grid">
            <div className="client-info">
              <h3>Contacto</h3>
              <dl>
                <div><dt><Phone />Teléfono</dt><dd>{customer.phone}</dd></div>
                <div><dt><Mail />Correo</dt><dd>{customer.email}</dd></div>
                <div><dt><MapPin />Dirección</dt><dd>{customer.address}, {customer.city}</dd></div>
              </dl>
            </div>
            <div className="client-info">
              <h3>Vehículo</h3>
              <dl>
                <div><dt><Car />Modelo</dt><dd>{customer.vehicleModel}</dd></div>
                <div><dt>Dominio</dt><dd>{customer.licensePlate}</dd></div>
                <div><dt>Entrega</dt><dd>{customer.deliveryDate || 'Sin fecha'}</dd></div>
              </dl>
            </div>
          </section>

          <section className="client-reason"><span>Motivo</span><strong>{customer.contactReason}</strong></section>

          <details className="client-history">
            <summary><span>Historial ({customer.history.length})</span><ChevronDown /></summary>
            <div>
              {customer.history.length === 0 ? <p>Sin gestiones.</p> : customer.history.map(item => (
                <article key={item.id}><div><strong>{item.result}</strong><span>{item.date} · {item.channel}</span></div>{item.notes && <p>{item.notes}</p>}{item.nextFollowUpDate && <small>Próximo: {item.nextFollowUpDate}</small>}</article>
              ))}
            </div>
          </details>

          {customer.notes && <details className="client-history"><summary><span>Notas</span><ChevronDown /></summary><div><p>{customer.notes}</p></div></details>}
        </div>
      </div>
    </div>
  );
};
