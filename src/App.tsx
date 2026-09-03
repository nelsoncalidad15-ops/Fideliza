import React, { useState, useMemo } from 'react';
import { initialCustomers, advisors, initialCampaigns } from './data/mockData';
import { Customer, Advisor, ContactChannel, ManagementResult, UserRole } from './types';
import { SidebarNav, ROLE_PERMISSIONS } from './components/SidebarNav';
import { DashboardView } from './components/DashboardView';
import { AgendaView } from './components/AgendaView';
import { ClientsDatabaseView } from './components/ClientsDatabaseView';
import { CampaignsView } from './components/CampaignsView';
import { BirthdaysAnniversariesView } from './components/BirthdaysAnniversariesView';
import { PostventaView } from './components/PostventaView';
import { AssignmentView } from './components/AssignmentView';
import { SalesManagerDashboard } from './components/SalesManagerDashboard';
import { ClientDetailModal } from './components/ClientDetailModal';
import { RegisterManagementModal } from './components/RegisterManagementModal';
import { WhatsAppPreviewModal } from './components/WhatsAppPreviewModal';
import { AddCustomerModal } from './components/AddCustomerModal';
import { TechnicalGuideModal } from './components/TechnicalGuideModal';
import { MinimalistLandingView } from './components/MinimalistLandingView';
import { AuthenticatedUser } from './components/LoginView';
import { ClientLoginModal } from './components/ClientLoginModal';
import { CustomerPortalView } from './components/CustomerPortalView';
import { CallsHistoryView } from './components/CallsHistoryView';
import { TelephonyStatsView } from './components/TelephonyStatsView';
import { UsersAdminView } from './components/UsersAdminView';
import { getUserAccounts } from './data/userAccounts';
import { Lock, ShieldAlert } from 'lucide-react';

const normalizePersonName = (value: string) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/direccion\s*-|lic\./gi, '')
  .replace(/[^a-z0-9]/gi, '')
  .toLowerCase();

const isSamePerson = (first: string, second: string) => {
  const normalizedFirst = normalizePersonName(first);
  const normalizedSecond = normalizePersonName(second);
  return Boolean(
    normalizedFirst &&
    normalizedSecond &&
    (normalizedFirst === normalizedSecond || normalizedFirst.includes(normalizedSecond) || normalizedSecond.includes(normalizedFirst))
  );
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [currentView, setCurrentView] = useState<string>('inicio');
  const [activeModule, setActiveModule] = useState<'ventas' | 'postventa'>('ventas');
  const [selectedAdvisorId, setSelectedAdvisorId] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userAccounts, setUserAccounts] = useState(getUserAccounts);

  // Role and Sidebar State
  const [userRole, setUserRole] = useState<UserRole>('gerencia');
  const [isSidebarPinned, setIsSidebarPinned] = useState<boolean>(true);
  const [roleNotice, setRoleNotice] = useState<string | null>(null);

  // Modals state
  const [selectedCustomerForDetail, setSelectedCustomerForDetail] = useState<Customer | null>(null);
  const [selectedCustomerForManagement, setSelectedCustomerForManagement] = useState<Customer | null>(null);
  const [selectedCustomerForWhatsApp, setSelectedCustomerForWhatsApp] = useState<Customer | null>(null);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  // Counters for Header badges
  const pendingTasksCount = useMemo(() => {
    return customers.filter(c => c.state === 'Pendiente' || c.priority === 'Alta').length;
  }, [customers]);

  const birthdaysCount = useMemo(() => {
    return customers.filter(c => Boolean(c.birthDate) || c.contactReason === 'Cumpleaños').length;
  }, [customers]);

  // Filter-aware navigation handler
  const handleNavigate = (view: string) => {
    if (view === 'inicio') {
      setCurrentView('inicio');
      setRoleNotice(null);
      return;
    }
    if (view === 'mi_autosol') {
      if (currentCustomer) {
        setCurrentView('mi_autosol');
      } else {
        setIsLoginModalOpen(true);
      }
      setRoleNotice(null);
      return;
    }
    if (!currentUser) {
      // If user tries to access internal CRM views without being logged in as staff, open the login modal
      setIsLoginModalOpen(true);
      return;
    }
    const allowed = ROLE_PERMISSIONS[userRole].allowedViews;
    if (allowed.includes(view)) {
      setCurrentView(view);
      setRoleNotice(null);
    } else {
      const roleName = ROLE_PERMISSIONS[userRole].label;
      setRoleNotice(`Acceso protegido: La vista "${view.toUpperCase()}" no está permitida para el perfil "${roleName}".`);
      setTimeout(() => setRoleNotice(null), 5000);
    }
  };

  const handleSetUserRole = (newRole: UserRole) => {
    setUserRole(newRole);
    const allowed = ROLE_PERMISSIONS[newRole].allowedViews;
    if (!allowed.includes(currentView)) {
      setCurrentView(allowed[0] || 'inicio');
    }
    setRoleNotice(null);
  };

  // Handler: Save Management
  const handleSaveManagement = (
    customerId: string, 
    data: {
      date: string;
      channel: ContactChannel;
      result: ManagementResult;
      notes: string;
      detectedInterest?: string;
      nextFollowUpDate?: string;
      advisorName: string;
    }
  ) => {
    setCustomers(prev => prev.map(c => {
      if (c.id !== customerId) return c;

      const newHistoryItem = {
        id: `h_${Date.now()}`,
        date: data.date,
        channel: data.channel,
        result: data.result,
        notes: data.notes,
        detectedInterest: data.detectedInterest,
        nextFollowUpDate: data.nextFollowUpDate,
        advisorName: data.advisorName,
      };

      let newState = c.state;
      if (data.result === 'Renovado') newState = 'Renovado';
      else if (data.result === 'Interesado' || data.result === 'Quiere cotización') newState = 'Interesado';
      else if (data.result === 'Quiere entregar usado') newState = 'Potencial renovación';
      else if (data.result === 'No respondió') newState = 'No respondió';
      else if (data.result === 'Volver a contactar') newState = 'Seguimiento';
      else if (data.result === 'No contactar comercialmente') newState = 'No interesado';
      else if (data.result === 'No contactar hasta') newState = 'Seguimiento';
      else newState = 'Contactado';

      return {
        ...c,
        state: newState,
        lastContactDate: data.date,
        nextScheduledContact: data.nextFollowUpDate || c.nextScheduledContact,
        tradeInInterest: data.result === 'Quiere entregar usado' ? true : c.tradeInInterest,
        financingInterest: data.result === 'Interesado en financiación' ? true : c.financingInterest,
        noCommercialContact: data.result === 'No contactar comercialmente' ? true : c.noCommercialContact,
        noContactUntil: data.result === 'No contactar hasta' ? data.nextFollowUpDate : c.noContactUntil,
        notes: data.notes ? `${c.notes ? c.notes + ' | ' : ''}${data.notes}` : c.notes,
        history: [newHistoryItem, ...c.history],
      };
    }));

    setSelectedCustomerForManagement(null);
    setToast('Gestión guardada');
    window.setTimeout(() => setToast(null), 2600);
  };

  // Handler: Mark as Renewed (converts into completed renewal)
  const handleMarkAsRenewed = (customerId: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id !== customerId) return c;
      return {
        ...c,
        state: 'Renovado',
        lastContactDate: new Date().toLocaleDateString('es-AR'),
        tags: [...c.tags, 'Renovado 2026'],
        history: [
          {
            id: `h_renew_${Date.now()}`,
            date: new Date().toLocaleDateString('es-AR'),
            channel: 'Presencial',
            result: 'Renovado',
            notes: '¡Cliente renovó exitosamente su unidad en Autosol! Se concreta entrega de 0km.',
            advisorName: c.advisor,
          },
          ...c.history,
        ]
      };
    }));

    if (selectedCustomerForDetail && selectedCustomerForDetail.id === customerId) {
      setSelectedCustomerForDetail(prev => prev ? { ...prev, state: 'Renovado' } : null);
    }
  };

  // Handler: Reassign Customer
  const handleReassignCustomer = (customerId: string, newAdvisorName: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id !== customerId) return c;
      return {
        ...c,
        advisor: newAdvisorName,
        history: [
          {
            id: `h_reassign_${Date.now()}`,
            date: new Date().toLocaleDateString('es-AR'),
            channel: 'Presencial',
            result: 'Contactado',
            notes: `Cartera reasignada a asesor: ${newAdvisorName}.`,
            advisorName: newAdvisorName,
          },
          ...c.history,
        ]
      };
    }));
  };

  const handleBulkAssign = (customerIds: string[], advisorName: string, contactDate: string) => {
    const today = new Date().toISOString().slice(0, 10);
    setCustomers(prev => prev.map(customer => customerIds.includes(customer.id) ? {
      ...customer,
      advisor: advisorName,
      nextScheduledContact: contactDate,
      state: customer.state === 'Renovado' ? customer.state : 'Pendiente',
      priority: contactDate === today ? 'Alta' : 'Media',
    } : customer));
    setToast(`${customerIds.length} clientes asignados`);
    window.setTimeout(() => setToast(null), 2600);
  };

  // Handler: Automatic Distribution of Portfolio
  const handleAutoDistribute = (rule: 'equitativo' | 'sucursal' | 'modelo') => {
    setCustomers(prev => {
      return prev.map((c, index) => {
        let assignedAdv = advisors[index % advisors.length].name;
        if (rule === 'sucursal') {
          if (c.branch === 'Ledesma') assignedAdv = 'O. YEVARA';
          else if (c.branch === 'Perico') assignedAdv = 'M. OLMOS';
          else assignedAdv = index % 2 === 0 ? 'GUSTAVO MAURICIO CABEZAS' : 'SOFÍA MARTÍNEZ';
        } else if (rule === 'modelo') {
          if (c.modelFamily === 'Amarok') assignedAdv = 'GUSTAVO MAURICIO CABEZAS';
          else if (c.modelFamily === 'Taos') assignedAdv = 'SOFÍA MARTÍNEZ';
          else if (c.modelFamily === 'Nivus' || c.modelFamily === 'T-Cross') assignedAdv = 'O. YEVARA';
          else assignedAdv = 'M. OLMOS';
        }
        return {
          ...c,
          advisor: assignedAdv,
        };
      });
    });
  };

  // Handler: Add New Customer
  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers(prev => [newCustomer, ...prev]);
    setIsAddCustomerOpen(false);
  };

  // Handler: Send Selected IDs to Today's Agenda
  const handleSendToAgenda = (customerIds: string[]) => {
    setCustomers(prev => prev.map(c => {
      if (customerIds.includes(c.id)) {
        return {
          ...c,
          nextScheduledContact: 'Hoy',
          priority: 'Alta',
          state: c.state === 'No respondió' ? 'Pendiente' : c.state,
        };
      }
      return c;
    }));
  };

  // Active advisor object
  const currentAdvisor = advisors.find(a => a.id === selectedAdvisorId);

  const isPublicView = currentView === 'inicio' || currentView === 'mi_autosol';

  return (
    <div className="app-shell min-h-screen bg-slate-100/70 font-sans text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
      
      {/* Lateral Navigation (Rendered when staff is logged in) */}
      {currentUser && (
        <SidebarNav
          currentView={currentView}
          setCurrentView={handleNavigate}
          userRole={userRole}
          setUserRole={handleSetUserRole}
          selectedAdvisorId={selectedAdvisorId}
          setSelectedAdvisorId={setSelectedAdvisorId}
          advisors={advisors}
          onOpenGuideModal={() => setIsGuideOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          pendingTasksCount={pendingTasksCount}
          birthdaysCount={birthdaysCount}
          isPinned={isSidebarPinned}
          setIsPinned={setIsSidebarPinned}
          currentUser={currentUser}
          activeModule={activeModule}
          setActiveModule={setActiveModule}
          onLogout={() => {
            setCurrentUser(null);
            setCurrentView('inicio');
          }}
        />
      )}

      {/* Main Content Area (Full-width for landing/portal, offset for staff with sidebar) */}
      <div className={currentUser ? 'staff-main' : 'public-main'}>
        
        {/* Security / Permission Alert Banner */}
        {roleNotice && (
          <div className="mx-4 sm:mx-6 lg:mx-8 mt-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 flex items-center justify-between text-xs font-semibold shadow-sm animate-fade-in">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{roleNotice}</span>
            </div>
            <button 
              onClick={() => setRoleNotice(null)} 
              className="text-amber-700 hover:text-amber-900 font-bold px-2 py-1"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <main className={isPublicView ? 'public-view' : 'staff-page'}>
        
        {/* View 0: Minimalist Initial Screen (Replicating User's Layout) */}
        {currentView === 'inicio' && (
          <MinimalistLandingView
            onNavigate={handleNavigate}
            customers={customers}
            advisors={advisors}
            onOpenCustomerDetail={setSelectedCustomerForDetail}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            loggedInCustomer={currentCustomer}
            loggedInStaff={currentUser}
            onOpenCustomerPortal={() => setCurrentView('mi_autosol')}
          />
        )}

        {/* View: Client Personal Portal (Mi Autosol) */}
        {currentView === 'mi_autosol' && currentCustomer && (
          <CustomerPortalView
            customer={currentCustomer}
            onLogout={() => {
              setCurrentCustomer(null);
              setCurrentView('inicio');
            }}
            onBackToHome={() => setCurrentView('inicio')}
          />
        )}

        {/* View 1: Executive Dashboard */}
        {currentView === 'dashboard' && (
          <DashboardView
            customers={customers}
            advisors={advisors}
            onSelectCustomer={setSelectedCustomerForDetail}
            onOpenManagementModal={setSelectedCustomerForManagement}
            onOpenWhatsAppModal={setSelectedCustomerForWhatsApp}
            onNavigateToView={handleNavigate}
          />
        )}

        {/* View: Telephony Calls History (Inspired by Screenshot 1) */}
        {currentView === 'llamadas' && (
          <CallsHistoryView
            onNavigateToStats={() => handleNavigate('estadisticas_tel')}
            currentUserEmail={currentUser?.email || 'gerencia@autosol.com.ar'}
          />
        )}

        {/* View: Telephony Minutes & Traffic Statistics (Inspired by Screenshot 2) */}
        {currentView === 'estadisticas_tel' && (
          <TelephonyStatsView
            onNavigateToHistory={() => handleNavigate('llamadas')}
            currentUserEmail={currentUser?.email || 'gerencia@autosol.com.ar'}
          />
        )}

        {/* View 2: Advisor Agenda */}
        {currentView === 'agenda' && (
          <AgendaView
            customers={customers}
            advisors={advisors}
            selectedAdvisorId={selectedAdvisorId}
            setSelectedAdvisorId={setSelectedAdvisorId}
            onSelectCustomer={setSelectedCustomerForDetail}
            onOpenManagementModal={setSelectedCustomerForManagement}
            onOpenWhatsAppModal={setSelectedCustomerForWhatsApp}
            activeModule={activeModule}
          />
        )}

        {/* View 3: Full Clients Database */}
        {currentView === 'clientes' && (
          <ClientsDatabaseView
            customers={customers}
            advisors={advisors}
            onSelectCustomer={setSelectedCustomerForDetail}
            onOpenManagementModal={setSelectedCustomerForManagement}
            onOpenWhatsAppModal={setSelectedCustomerForWhatsApp}
            onAddNewCustomer={() => setIsAddCustomerOpen(true)}
            initialSearch={searchQuery}
          />
        )}

        {/* View 4: Intelligent Campaigns */}
        {currentView === 'campanas' && (
          <CampaignsView
            customers={customers}
            advisors={advisors}
            campaigns={initialCampaigns}
            onSelectCustomer={setSelectedCustomerForDetail}
            onOpenWhatsAppModal={setSelectedCustomerForWhatsApp}
            onOpenManagementModal={setSelectedCustomerForManagement}
            onSendToAgenda={handleSendToAgenda}
          />
        )}

        {/* View 5: Birthdays & Delivery Anniversaries */}
        {currentView === 'cumpleanos' && (
          <AgendaView
            customers={customers}
            advisors={advisors}
            selectedAdvisorId={selectedAdvisorId}
            setSelectedAdvisorId={setSelectedAdvisorId}
            onSelectCustomer={setSelectedCustomerForDetail}
            onOpenManagementModal={setSelectedCustomerForManagement}
            onOpenWhatsAppModal={setSelectedCustomerForWhatsApp}
            initialTab="cumpleanos"
            activeModule={activeModule}
          />
        )}

        {/* View 6: Workshop / Postventa */}
        {currentView === 'postventa' && (
          <PostventaView
            customers={customers}
            onSelectCustomer={setSelectedCustomerForDetail}
            onOpenWhatsAppModal={setSelectedCustomerForWhatsApp}
            onOpenManagementModal={setSelectedCustomerForManagement}
          />
        )}

        {/* View 7: Portfolio Assignment */}
        {currentView === 'asignacion' && (
          <AssignmentView
            customers={customers}
            advisors={advisors}
            onReassignCustomer={handleReassignCustomer}
            onBulkAssign={handleBulkAssign}
            onSelectCustomer={setSelectedCustomerForDetail}
          />
        )}

        {/* View 8: Sales Manager Supervision */}
        {currentView === 'supervision' && (
          <SalesManagerDashboard
            customers={customers}
            advisors={advisors}
            onSelectAdvisor={(advId) => {
              setSelectedAdvisorId(advId);
              handleNavigate('agenda');
            }}
            onSelectCustomer={setSelectedCustomerForDetail}
          />
        )}

        {currentView === 'usuarios' && userRole === 'admin' && (
          <UsersAdminView
            accounts={userAccounts}
            onAccountsChange={setUserAccounts}
          />
        )}

      </main>

      {/* Modern Automotive Footer */}
      {!currentUser && <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center font-black text-white bg-blue-700 text-xs">
              W
            </div>
            <div>
              <span className="font-bold text-white tracking-wide">AUTOSOL FIDELIZA</span>
              <p className="text-[11px] text-slate-400">
                “La relación con el cliente no termina con la entrega.”
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] text-slate-400">
            <span>Casa Central: Jujuy</span>
            <span>Sucursal Ledesma</span>
            <span>Sucursal Perico</span>
            <span>Sucursal Salta</span>
          </div>

          <div className="text-right text-[11px] text-slate-400">
            © {new Date().getFullYear()} Autosol S.R.L. · Concesionario Oficial Volkswagen
          </div>
        </div>
      </footer>}

      </div>

      {toast && (
        <div className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-xl animate-fade-in">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />{toast}
        </div>
      )}

      {/* Global Modals */}
      {selectedCustomerForDetail && (
        <ClientDetailModal
          customer={selectedCustomerForDetail}
          onClose={() => setSelectedCustomerForDetail(null)}
          onOpenManagementModal={(c) => {
            setSelectedCustomerForManagement(c);
          }}
          onOpenWhatsAppModal={(c) => {
            setSelectedCustomerForWhatsApp(c);
          }}
          onMarkAsRenewed={handleMarkAsRenewed}
        />
      )}

      {selectedCustomerForManagement && (
        <RegisterManagementModal
          customer={selectedCustomerForManagement}
          advisors={advisors}
          onClose={() => setSelectedCustomerForManagement(null)}
          onSaveManagement={handleSaveManagement}
        />
      )}

      {selectedCustomerForWhatsApp && (
        <WhatsAppPreviewModal
          customer={selectedCustomerForWhatsApp}
          currentAdvisorName={currentAdvisor?.name || 'Autosol Volkswagen'}
          onClose={() => setSelectedCustomerForWhatsApp(null)}
          onLoggedAsSent={(notes) => {
            handleSaveManagement(selectedCustomerForWhatsApp.id, {
              date: new Date().toLocaleDateString('es-AR'),
              channel: 'WhatsApp',
              result: 'Contactado',
              notes,
              advisorName: currentAdvisor?.name || selectedCustomerForWhatsApp.advisor,
            });
            setSelectedCustomerForWhatsApp(null);
          }}
        />
      )}

      {isAddCustomerOpen && (
        <AddCustomerModal
          advisors={advisors}
          onClose={() => setIsAddCustomerOpen(false)}
          onAddCustomer={handleAddCustomer}
        />
      )}

      {isGuideOpen && (
        <TechnicalGuideModal
          onClose={() => setIsGuideOpen(false)}
        />
      )}

      {/* Floating Login Modal (Pestaña flotante de login) */}
      <ClientLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onStaffLogin={(user) => {
          setCurrentUser(user);
          setUserRole(user.role);
          if (user.role === 'asesor' || user.role === 'postventa') {
            const matchedAdv = advisors.find(a => 
              a.email.toLowerCase() === user.email.toLowerCase() ||
              user.name.toLowerCase().includes(a.name.toLowerCase()) ||
              a.name.toLowerCase().includes(user.name.toLowerCase())
            );
            if (matchedAdv) {
              setSelectedAdvisorId(matchedAdv.id);
            }
            setActiveModule(user.role === 'postventa' ? 'postventa' : 'ventas');
            setCurrentView(user.role === 'postventa' ? 'postventa' : 'agenda');
          } else if (user.role === 'jefe_postventa') {
            setActiveModule('postventa');
            setCurrentView('postventa');
          } else {
            setActiveModule('ventas');
            setCurrentView('dashboard');
          }
        }}
      />

    </div>
  );
}
