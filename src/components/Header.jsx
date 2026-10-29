import React from 'react';
import {
  Menu,
  X,
  UserPlus,
  RotateCcw,
  Info,
  Calendar,
  Wallet,
  CheckCircle2,
} from 'lucide-react';
import { useGrowthData } from '../context/GrowthDataContext';

export const Header = ({ isMobileOpen, setIsMobileOpen }) => {
  const {
    activeTab,
    campaign,
    totalRegistrations,
    totalSpend,
    setIsSimModalOpen,
    setIsQuickRegOpen,
    resetToDefaults,
  } = useGrowthData();

  const tabTitles = {
    overview: 'Campaign Overview & Run-Rate Trajectory',
    progress: 'Campaign Overview & Run-Rate Trajectory',
    acquisition: 'Acquisition Channels & Outreach Studio',
    channels: 'Acquisition Channels & Outreach Studio',
    studio: 'Acquisition Channels & Outreach Studio',
    referrals: 'Campus Referral Engine & Ambassador Leaderboard',
    ambassadors: 'Campus Referral Engine & Ambassador Leaderboard',
    experiments: 'Growth Experiments Management (ICE)',
    registrations: 'Student Registrations Roster & Audit Log',
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          className="mobile-nav-toggle"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className="header-title-box">
          <h2>{tabTitles[activeTab] || 'Growth Engine'}</h2>
          <span className="header-subtitle">
            Workshop: {campaign.title} • Goal: {campaign.targetRegistrations} Signups in {campaign.totalDays} Days
          </span>
        </div>
      </div>

      <div className="header-actions">
        {/* Transparent Demo Data Badge */}
        <button
          className="demo-mode-badge"
          onClick={() => setIsSimModalOpen(true)}
          title="Click to view Simulation & Data Integrity details"
        >
          <span className="pulse-dot" />
          <span>DEMO DATA / SIMULATION</span>
          <Info size={14} style={{ opacity: 0.8 }} />
        </button>

        {/* Quick Test Registration Trigger */}
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setIsQuickRegOpen(true)}
          title="Simulate a new student registration to test live metrics update"
        >
          <UserPlus size={15} />
          <span>+ Add Demo Reg</span>
        </button>

        {/* Quick Reset */}
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => {
            if (window.confirm('Reset all demo metrics to default seed state?')) {
              resetToDefaults();
            }
          }}
          title="Reset to default demo data"
        >
          <RotateCcw size={15} />
        </button>
      </div>
    </header>
  );
};
