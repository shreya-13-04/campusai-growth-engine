import React, { useState } from 'react';
import { GrowthDataProvider, useGrowthData } from './context/GrowthDataContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewTab } from './components/tabs/OverviewTab';
import { ProgressTab } from './components/tabs/ProgressTab';
import { ChannelsTab } from './components/tabs/ChannelsTab';
import { AmbassadorsTab } from './components/tabs/AmbassadorsTab';
import { ReferralsTab } from './components/tabs/ReferralsTab';
import { ExperimentsTab } from './components/tabs/ExperimentsTab';
import { OutreachStudioTab } from './components/tabs/OutreachStudioTab';
import { RegistrationsTab } from './components/tabs/RegistrationsTab';
import { DemoModal } from './components/modals/DemoModal';
import { QuickRegModal } from './components/modals/QuickRegModal';
import { Info, CheckCircle2 } from 'lucide-react';

const DashboardContent = () => {
  const { activeTab, toast } = useGrowthData();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'progress':
        return <ProgressTab />;
      case 'channels':
        return <ChannelsTab />;
      case 'ambassadors':
        return <AmbassadorsTab />;
      case 'referrals':
        return <ReferralsTab />;
      case 'experiments':
        return <ExperimentsTab />;
      case 'studio':
        return <OutreachStudioTab />;
      case 'registrations':
        return <RegistrationsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Main Content Pane */}
      <div className="app-main">
        <Header isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
        <main>{renderActiveView()}</main>
      </div>

      {/* Floating Modals */}
      <DemoModal />
      <QuickRegModal />

      {/* Toast Notification Container */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type || 'success'}`}>
            {toast.type === 'info' ? (
              <Info size={16} style={{ color: 'var(--accent-cyan)' }} />
            ) : (
              <CheckCircle2 size={16} style={{ color: '#34d399' }} />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <GrowthDataProvider>
      <DashboardContent />
    </GrowthDataProvider>
  );
}
