import React from 'react';
import {
  ShieldAlert,
  Target,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useGrowthData } from '../../context/GrowthDataContext';

export const DemoModal = () => {
  const { isSimModalOpen, setIsSimModalOpen, resetToDefaults } = useGrowthData();

  if (!isSimModalOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => setIsSimModalOpen(false)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--accent-amber-tint)',
                border: '1px solid var(--accent-amber-border)',
                color: 'var(--accent-amber)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 className="modal-title" style={{ fontSize: '1.05rem' }}>
                Simulation & Demo Data Integrity Notice
              </h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                NxtWave Growth Hack Challenge Submission Notice
              </p>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => setIsSimModalOpen(false)}>
            ✕
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--accent-amber-tint)', border: '1px solid var(--accent-amber-border)', borderRadius: 'var(--radius-md)', padding: '14px 18px' }}>
            <strong style={{ color: 'var(--accent-amber-text)', fontSize: '0.86rem', display: 'block', marginBottom: '4px' }}>
              ⚠️ Transparent Hackathon Disclosure:
            </strong>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
              All metrics, daily velocity logs, ambassador rankings, and student entries displayed in this dashboard are <strong>simulated DEMO DATA</strong> for evaluating growth operations architecture. They do not claim to represent real human registrations or live financial transactions.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-highlight)', fontWeight: '800', marginBottom: '8px' }}>
              Campaign Strategy & Assumptions
            </h4>
            <ul style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '18px' }}>
              <li>
                <strong>Workshop:</strong> "Build Your First AI Project in 60 Minutes" (Free online hands-on webinar).
              </li>
              <li>
                <strong>Target:</strong> 500 confirmed student registrations within a 7-day window.
              </li>
              <li>
                <strong>Bootstrapped Budget:</strong> Hard cap of ₹2,000 INR total spend (₹1,240 spent to date across micro-boosts and printing).
              </li>
              <li>
                <strong>Blended CAC:</strong> Kept at ₹3.63 by relying heavily on organic WhatsApp peer forward loops and 12 campus ambassadors.
              </li>
              <li>
                <strong>AI Outreach Studio:</strong> Pure deterministic, template-assisted engine. No paid AI APIs, zero external credentials, and instant generation.
              </li>
              <li>
                <strong>State Persistence:</strong> All demo interactions (adding registrations, creating experiments, generating codes) persist in browser <code>localStorage</code>.
              </li>
            </ul>
          </div>

          <div style={{ background: 'var(--accent-emerald-tint)', border: '1px solid var(--accent-emerald-border)', borderRadius: 'var(--radius-md)', padding: '14px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald-text)', fontSize: '0.82rem', fontWeight: '800', marginBottom: '4px' }}>
              <CheckCircle2 size={16} /> Privacy & Reproducibility
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>
              Evaluators can safely test registrations, tweak experiments, and reset back to baseline at any moment without affecting external servers.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              if (window.confirm('Reset all demo metrics to default seed state?')) {
                resetToDefaults();
                setIsSimModalOpen(false);
              }
            }}
          >
            <RotateCcw size={14} />
            Reset Demo Data
          </button>
          <button type="button" className="btn btn-primary" onClick={() => setIsSimModalOpen(false)}>
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
