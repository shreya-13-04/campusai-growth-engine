import React, { useState } from 'react';
import {
  FlaskConical,
  Plus,
  CheckCircle2,
  Clock,
  Archive,
  Award,
  Sparkles,
  Filter,
  Flame,
} from 'lucide-react';
import { useGrowthData } from '../../context/GrowthDataContext';
import { MetricCard } from '../MetricCard';

export const ExperimentsTab = () => {
  const {
    experiments,
    addExperiment,
    updateExperimentStatus,
  } = useGrowthData();

  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [channel, setChannel] = useState('WhatsApp');
  const [hypothesis, setHypothesis] = useState('');
  const [impact, setImpact] = useState(8);
  const [confidence, setConfidence] = useState(7);
  const [ease, setEase] = useState(8);
  const [owner, setOwner] = useState('Growth Ops');

  const liveIceScore = impact * confidence * ease;

  const handleSubmitExperiment = (e) => {
    e.preventDefault();
    if (!title.trim() || !hypothesis.trim()) return;

    addExperiment({
      title: title.trim(),
      channel,
      hypothesis: hypothesis.trim(),
      impact,
      confidence,
      ease,
      owner,
    });

    setTitle('');
    setHypothesis('');
    setIsModalOpen(false);
  };

  const filteredExperiments = experiments.filter((exp) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'Winner') return exp.status === 'Winner';
    if (statusFilter === 'Running') return exp.status === 'Running' || exp.status === 'In Progress';
    if (statusFilter === 'Backlog') return exp.status === 'Backlog';
    if (statusFilter === 'Invalidated') return exp.status === 'Invalidated';
    return true;
  });

  const winnersCount = experiments.filter((e) => e.status === 'Winner').length;
  const activeCount = experiments.filter((e) => e.status === 'Running' || e.status === 'In Progress').length;
  const backlogCount = experiments.filter((e) => e.status === 'Backlog').length;

  return (
    <div className="view-container">
      <div className="section-header">
        <div className="section-title-wrap">
          <h2>Growth Experiments & ICE Prioritization</h2>
          <p className="section-desc">
            Systematic growth backlog ranked by <strong>Impact (1-10) × Confidence (1-10) × Ease (1-10)</strong>. Track validated winners, running tests, and archived learnings.
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          + Propose Growth Hack
        </button>
      </div>

      {/* KPI Stats */}
      <div className="kpi-grid">
        <MetricCard
          label="Total Experiments Logged"
          value={experiments.length}
          subtext="Growth hypothesis test pool"
          icon={FlaskConical}
          badgeText="Active Backlog"
          badgeType="neutral"
          accentColor="#6D5CE8"
        />

        <MetricCard
          label="Validated Winners"
          value={winnersCount}
          subtext="Implemented high-lift tactics"
          icon={Award}
          badgeText="Proven Lift"
          badgeType="positive"
          accentColor="#10B981"
        />

        <MetricCard
          label="Running in Flight"
          value={activeCount}
          subtext="Currently gathering cohort data"
          icon={Clock}
          badgeText="Testing"
          badgeType="warning"
          accentColor="#0284C7"
        />

        <MetricCard
          label="Average ICE Score"
          value={Math.round(experiments.reduce((sum, e) => sum + e.iceScore, 0) / experiments.length)}
          subtext="Max possible: 1,000"
          icon={Flame}
          badgeText="High Conviction"
          badgeType="positive"
          accentColor="#D97706"
        />
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button
          className={`btn btn-sm ${statusFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setStatusFilter('all')}
        >
          All Experiments ({experiments.length})
        </button>
        <button
          className={`btn btn-sm ${statusFilter === 'Winner' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setStatusFilter('Winner')}
        >
          🏆 Winners ({winnersCount})
        </button>
        <button
          className={`btn btn-sm ${statusFilter === 'Running' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setStatusFilter('Running')}
        >
          ⚡ In Flight / Testing ({activeCount})
        </button>
        <button
          className={`btn btn-sm ${statusFilter === 'Backlog' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setStatusFilter('Backlog')}
        >
          📋 Planned Backlog ({backlogCount})
        </button>
        <button
          className={`btn btn-sm ${statusFilter === 'Invalidated' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setStatusFilter('Invalidated')}
        >
          📁 Archived / Invalidated
        </button>
      </div>

      {/* Experiments Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
        {filteredExperiments.map((exp) => {
          let statusBadgeClass = 'badge-indigo';
          if (exp.status === 'Winner') statusBadgeClass = 'badge-green';
          if (exp.status === 'Running' || exp.status === 'In Progress') statusBadgeClass = 'badge-gold';
          if (exp.status === 'Invalidated') statusBadgeClass = 'badge-rose';

          return (
            <div
              key={exp.id}
              className="card"
              style={{
                marginBottom: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderLeft: `4px solid ${
                  exp.status === 'Winner' ? '#10b981' : exp.status === 'Running' || exp.status === 'In Progress' ? '#f59e0b' : exp.status === 'Invalidated' ? '#f43f5e' : '#6366f1'
                }`,
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <span className={`badge ${statusBadgeClass}`}>
                    {exp.status === 'Winner' ? '🏆 Winner' : exp.status}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>ICE Score:</span>
                    <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-highlight)', fontSize: '0.95rem' }}>
                      {exp.iceScore}
                    </strong>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.02rem', fontWeight: '700', color: 'var(--text-highlight)', marginBottom: '6px' }}>
                  {exp.title}
                </h3>

                <div style={{ fontSize: '0.74rem', color: 'var(--primary)', fontWeight: '600', marginBottom: '12px' }}>
                  Channel: <strong>{exp.channel}</strong> • Owner: {exp.owner} • {exp.date}
                </div>

                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: '1.5' }}>
                  <strong>Hypothesis:</strong> {exp.hypothesis}
                </p>

                {/* Submetrics: Impact, Confidence, Ease */}
                <div style={{ display: 'flex', gap: '14px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', padding: '10px 14px', borderRadius: 'var(--radius-md)', marginBottom: '14px', fontSize: '0.76rem' }}>
                  <span>Impact: <strong>{exp.impact}/10</strong></span>
                  <span>Confidence: <strong>{exp.confidence}/10</strong></span>
                  <span>Ease: <strong>{exp.ease}/10</strong></span>
                </div>

                {exp.keyLearning && (
                  <div style={{ background: 'var(--primary-tint)', border: '1px solid var(--primary-border)', borderRadius: 'var(--radius-md)', padding: '12px 14px', marginBottom: '14px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '2px' }}>
                      Outcome & Key Learning:
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: '1.45' }}>
                      {exp.keyLearning}
                    </div>
                    {exp.lift && (
                      <div style={{ fontSize: '0.74rem', color: 'var(--accent-emerald-text)', fontWeight: '700', marginTop: '6px' }}>
                        Observed Lift: {exp.lift}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Status Update Control */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>Change Status:</span>
                <select
                  value={exp.status}
                  onChange={(e) => updateExperimentStatus(exp.id, e.target.value)}
                  className="form-select"
                  style={{ width: 'auto', padding: '4px 8px', fontSize: '0.76rem' }}
                >
                  <option value="Winner">Winner (Adopted)</option>
                  <option value="Running">Running / In Progress</option>
                  <option value="Backlog">Backlog / Planned</option>
                  <option value="Invalidated">Invalidated / Stopped</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>

      {/* Propose Growth Hack Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Propose New Growth Experiment</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setIsModalOpen(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmitExperiment}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Experiment Name / Growth Hack *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Hostel Common Room QR Challenge"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Target Channel</label>
                  <select className="form-select" value={channel} onChange={(e) => setChannel(e.target.value)}>
                    <option value="WhatsApp">WhatsApp Peer Loops</option>
                    <option value="Ambassador Network">Campus Ambassador Network</option>
                    <option value="Instagram Paid">Instagram Paid Boost</option>
                    <option value="College Clubs">College Tech Clubs (Discord/Slack)</option>
                    <option value="LinkedIn Direct">LinkedIn Student Posts</option>
                    <option value="Offline / Lab Posters">Offline / Lab Posters</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Hypothesis (If X, then Y because Z) *</label>
                  <textarea
                    required
                    rows="3"
                    className="form-textarea"
                    placeholder="If we provide a 1-click WhatsApp forward text with the project GIF preview, then forward rates will double because..."
                    value={hypothesis}
                    onChange={(e) => setHypothesis(e.target.value)}
                  />
                </div>

                {/* ICE Sliders */}
                <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-highlight)' }}>
                      ICE Scoring Parameters
                    </span>
                    <span style={{ fontSize: '0.86rem', color: 'var(--primary)', fontFamily: 'var(--font-mono)', fontWeight: '800' }}>
                      Calculated ICE Score: {liveIceScore}
                    </span>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '4px' }}>
                      <span>Impact (1-10):</span>
                      <strong>{impact}</strong>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={impact}
                      onChange={(e) => setImpact(parseInt(e.target.value, 10))}
                      style={{ width: '100%', accentColor: 'var(--primary)' }}
                    />
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '4px' }}>
                      <span>Confidence (1-10):</span>
                      <strong>{confidence}</strong>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={confidence}
                      onChange={(e) => setConfidence(parseInt(e.target.value, 10))}
                      style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '4px' }}>
                      <span>Ease / Speed to Implement (1-10):</span>
                      <strong>{ease}</strong>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={ease}
                      onChange={(e) => setEase(parseInt(e.target.value, 10))}
                      style={{ width: '100%', accentColor: 'var(--accent-emerald)' }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Tactic Owner / Lead</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Growth Lead or Campus Team"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add to Experiment Backlog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
