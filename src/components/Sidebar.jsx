import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Share2,
  Trophy,
  Link2,
  FlaskConical,
  MessageSquareText,
  Users,
  RotateCcw,
  Sparkles,
  Target,
  ExternalLink,
} from 'lucide-react';
import { useGrowthData } from '../context/GrowthDataContext';

export const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const {
    activeTab,
    setActiveTab,
    campaign,
    totalRegistrations,
    progressPercent,
    resetToDefaults,
    setIsSimModalOpen,
  } = useGrowthData();

  const navItems = [
    { id: 'overview', label: 'Overview & Trajectory', icon: LayoutDashboard, aliases: ['progress'] },
    { id: 'acquisition', label: 'Acquisition & Outreach', icon: Share2, aliases: ['channels', 'studio'] },
    { id: 'referrals', label: 'Referrals & Ambassadors', icon: Link2, aliases: ['ambassadors'] },
    { id: 'experiments', label: 'Growth Experiments', icon: FlaskConical, aliases: [] },
    { id: 'registrations', label: 'Student Registrations', icon: Users, aliases: [] },
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <aside className={`app-sidebar ${isMobileOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="brand-badge">
          <div className="brand-icon">
            <Sparkles size={20} />
          </div>
          <div className="brand-info">
            <h1>
              CampusAI <span className="brand-tag">Ops</span>
            </h1>
            <p className="brand-subtitle">Growth Campaign Manager</p>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-label">Campaign Operations</span>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.aliases && item.aliases.includes(activeTab));
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {item.id === 'registrations' && (
                <span className="nav-badge">{totalRegistrations}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Mini Campaign Target Widget in Sidebar */}
      <div className="sidebar-campaign-card">
        <div className="camp-target-header">
          <span className="camp-label">Campaign Target</span>
          <span className="camp-value">
            {totalRegistrations} / {campaign.targetRegistrations}
          </span>
        </div>
        <div className="camp-progress-bar">
          <div
            className="camp-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="camp-meta">
          <span>Day {campaign.currentDay} of {campaign.totalDays}</span>
          <span>{progressPercent}% Complete</span>
        </div>

        <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setIsSimModalOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ flex: 1, fontSize: '0.72rem', justifyContent: 'center' }}
            title="Read Simulation & Methodology Disclaimers"
          >
            <Target size={12} />
            Demo Info
          </button>
          <button
            onClick={() => {
              if (window.confirm('Reset all demo metrics to default seed state?')) {
                resetToDefaults();
              }
            }}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.72rem' }}
            title="Reset to default demo data"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>
    </aside>
  );
};
