import React, { useState } from 'react';
import {
  FlaskConical,
  Plus,
  CheckCircle2,
  Clock,
  Award,
  Filter,
} from 'lucide-react';
import { useGrowthData } from '../../context/GrowthDataContext';

export const ExperimentsTab = () => {
  const {
    experiments,
    addExperiment,
    updateExperimentStatus,
    showToast,
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
    if (!title.trim() || !hypothesis.trim()) {
      showToast('Please provide both an experiment title and hypothesis', 'warning');
      return;
    }

    addExperiment({
      title: title.trim(),
      channel,
      hypothesis: hypothesis.trim(),
      impact,
      confidence,
      ease,
      owner: owner.trim() || 'Growth Ops',
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
  const avgIce = experiments.length > 0
    ? Math.round(experiments.reduce((sum, e) => sum + e.iceScore, 0) / experiments.length)
    : 0;

  return (
    <div className="view-container">
      {/* Executive Key Figures Strip */}
      <div className="executive-kpi-bar">
        <div className="kpi-cell">
          <div className="kpi-cell-label">Total Hypotheses Logged</div>
          <div className="kpi-cell-val">
            <span className="mono-num">{experiments.length}</span>
          </div>
          <div className="kpi-meta">
            <span className="badge badge-indigo">Active Pool</span>
            <span className="kpi-caption">Growth backlog</span>
          </div>
        </div>

        <div className="kpi-cell">
          <div className="kpi-cell-label">Validated Winners</div>
          <div className="kpi-cell-val">
            <span className="mono-num">{winnersCount}</span>
          </div>
          <div className="kpi-meta">
            <span className="badge badge-green">Adopted</span>
            <span className="kpi-caption">High measured lift</span>
          </div>
        </div>

        <div className="kpi-cell">
          <div className="kpi-cell-label">In Flight / Testing</div>
          <div className="kpi-cell-val">
            <span className="mono-num">{activeCount}</span>
          </div>
          <div className="kpi-meta">
            <span className="badge badge-cyan">Gathering Data</span>
            <span className="kpi-caption">Active cohorts</span>
          </div>
        </div>

        <div className="kpi-cell">
          <div className="kpi-cell-label">Average ICE Score</div>
          <div className="kpi-cell-val">
            <span className="mono-num">{avgIce}</span>
            <span className="kpi-sub">/ 1,000</span>
          </div>
          <div className="kpi-meta">
            <span className="badge badge-amber">Prioritized</span>
            <span className="kpi-caption">Impact × Conf × Ease</span>
          </div>
        </div>
      </div>

      {/* Header Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${statusFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setStatusFilter('all')}
          >
            All Hypotheses ({experiments.length})
          </button>
          <button
            className={`btn btn-sm ${statusFilter === 'Winner' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setStatusFilter('Winner')}
          >
            Winners ({winnersCount})
          </button>
          <button
            className={`btn btn-sm ${statusFilter === 'Running' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setStatusFilter('Running')}
          >
            In Flight ({activeCount})
          </button>
          <button
            className={`btn btn-sm ${statusFilter === 'Backlog' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setStatusFilter('Backlog')}
          >
            Backlog ({backlogCount})
          </button>
          <button
            className={`btn btn-sm ${statusFilter === 'Invalidated' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setStatusFilter('Invalidated')}
          >
            Archived
          </button>
        </div>

        <button className="btn btn-primary btn-sm" onClick={() => setIsModalOpen(true)}>
          <Plus size={15} />
          + Propose Growth Hack
        </button>
      </div>

      {/* Experiments Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        {filteredExperiments.map((exp) => {
          let statusBadgeClass = 'badge-indigo';
          let borderAccent = 'var(--primary)';
          if (exp.status === 'Winner') {
            statusBadgeClass = 'badge-green';
            borderAccent = 'var(--accent-emerald)';
          } else if (exp.status === 'Running' || exp.status === 'In Progress') {
            statusBadgeClass = 'badge-amber';
            borderAccent = 'var(--accent-amber)';
          } else if (exp.status === 'Invalidated') {
            statusBadgeClass = 'badge-rose';
            borderAccent = 'var(--accent-rose)';
          }

          return (
            <div
              key={exp.id}
              className="card"
              style={{
                marginBottom: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderLeft: `4px solid ${borderAccent}`,
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span className={`badge ${statusBadgeClass}`}>
                    {exp.status === 'Winner' ? 'Validated Winner' : exp.status}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ICE Score:</span>
                    <strong className="mono-num" style={{ color: 'var(--text-highlight)', fontSize: '0.95rem' }}>
                      {exp.iceScore}
                    </strong>
                  </div>
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-highlight)', marginBottom: '4px' }}>
                  {exp.title}
                </h3>

                <div style={{ fontSize: '0.74rem', color: 'var(--primary)', fontWeight: '600', marginBottom: '12px' }}>
                  Channel: <strong>{exp.channel}</strong> • Owner: {exp.owner} • {exp.date}
                </div>

                <p style={{ fontSize: '0.84rem', color: 'var(--text-main)', marginBottom: '14px', lineHeight: '1.5' }}>
                  <strong>Hypothesis:</strong> {exp.hypothesis}
                </p>

                {/* Submetrics: Impact, Confidence, Ease */}
                <div style={{ display: 'flex', gap: '14px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', padding: '10px 14px', borderRadius: 'var(--radius-md)', marginBottom: '14px', fontSize: '0.76rem' }}>
                  <span>Impact: <strong className="mono-num">{exp.impact}/10</strong></span>
                  <span>Confidence: <strong className="mono-num">{exp.confidence}/10</strong></span>
                  <span>Ease: <strong className="mono-num">{exp.ease}/10</strong></span>
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
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Update Status:</span>
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

      {/* Propose Experiment Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Propose Growth Hypothesis</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmitExperiment}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="exp-title" className="form-label">Tactic / Experiment Title *</label>
                  <input
                    id="exp-title"
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. 1-Click WhatsApp Forwarding Button with Project Teaser"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label htmlFor="exp-channel" className="form-label">Primary Channel</label>
                    <select
                      id="exp-channel"
                      className="form-select"
                      value={channel}
                      onChange={(e) => setChannel(e.target.value)}
                    >
                      <option value="WhatsApp">WhatsApp Peer Loops</option>
                      <option value="Ambassador Network">Campus Ambassadors</option>
                      <option value="College Clubs">College Tech Clubs</option>
                      <option value="Instagram Paid">Instagram Reels Boost</option>
                      <option value="Offline / Lab Posters">Lab Notice Posters / QR</option>
                      <option value="LinkedIn Direct">LinkedIn Student Outreach</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="exp-owner" className="form-label">Lead / Owner</label>
                    <input
                      id="exp-owner"
                      type="text"
                      className="form-input"
                      value={owner}
                      onChange={(e) => setOwner(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="exp-hypo" className="form-label">Hypothesis & Proposed Change *</label>
                  <textarea
                    id="exp-hypo"
                    required
                    className="form-textarea"
                    rows="3"
                    placeholder="If we [action/hook], then [expected result] because [reason]..."
                    value={hypothesis}
                    onChange={(e) => setHypothesis(e.target.value)}
                  />
                </div>

                {/* ICE Sliders */}
                <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px', marginTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: '700' }}>ICE Prioritization Matrix</span>
                    <span className="badge badge-indigo">
                      Calculated ICE: <strong className="mono-num" style={{ marginLeft: '4px' }}>{liveIceScore}</strong>
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                        <label htmlFor="impact-range">Impact: <strong>{impact}</strong> / 10</label>
                        <span style={{ color: 'var(--text-muted)' }}>Estimated registration volume lift</span>
                      </div>
                      <input
                        id="impact-range"
                        type="range"
                        min="1"
                        max="10"
                        value={impact}
                        onChange={(e) => setImpact(Number(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--primary)' }}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                        <label htmlFor="conf-range">Confidence: <strong>{confidence}</strong> / 10</label>
                        <span style={{ color: 'var(--text-muted)' }}>Certainty based on past test data</span>
                      </div>
                      <input
                        id="conf-range"
                        type="range"
                        min="1"
                        max="10"
                        value={confidence}
                        onChange={(e) => setConfidence(Number(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--primary)' }}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                        <label htmlFor="ease-range">Ease: <strong>{ease}</strong> / 10</label>
                        <span style={{ color: 'var(--text-muted)' }}>Speed to execute (10 = &lt; 2 hrs)</span>
                      </div>
                      <input
                        id="ease-range"
                        type="range"
                        min="1"
                        max="10"
                        value={ease}
                        onChange={(e) => setEase(Number(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--primary)' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Log Growth Experiment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
