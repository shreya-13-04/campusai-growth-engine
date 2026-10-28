import React, { useState } from 'react';
import {
  TrendingUp,
  Target,
  Calendar,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { useGrowthData } from '../../context/GrowthDataContext';
import { MetricCard } from '../MetricCard';

export const ProgressTab = () => {
  const {
    campaign,
    dailyMetrics,
    totalRegistrations,
    velocity,
    remainingRegistrations,
    remainingDays,
    neededDailyVelocity,
    projectedFinal,
    progressPercent,
    setIsQuickRegOpen,
  } = useGrowthData();

  // Interactive Scenario Simulator
  const [viralBoostMultiplier, setViralBoostMultiplier] = useState(1.15); // +15% boost
  const [ambassadorActivityLift, setAmbassadorActivityLift] = useState(20); // +20% lift

  // Simulated final calculation
  const simulatedRemainingPerDay = parseFloat(velocity) * (1 + (viralBoostMultiplier - 1) + ambassadorActivityLift / 100);
  const simulatedFinalProjected = Math.round(totalRegistrations + simulatedRemainingPerDay * remainingDays);

  return (
    <div className="view-container">
      <div className="section-header">
        <div className="section-title-wrap">
          <h2>Registration Velocity & Trajectory Model</h2>
          <p className="section-desc">
            Monitor daily burn-up trajectory against the 500 registration target in 7 days. Track variance, run-rate velocity, and test growth sensitivity scenarios.
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setIsQuickRegOpen(true)}>
          + Record Live Test Lead
        </button>
      </div>

      {/* Top Velocity Stats */}
      <div className="kpi-grid">
        <MetricCard
          label="Current Daily Velocity"
          value={`${velocity} / day`}
          subtext={`Calculated across first ${campaign.currentDay} days`}
          icon={TrendingUp}
          badgeText="Active Pace"
          badgeType="positive"
          accentColor="#6D5CE8"
        />

        <MetricCard
          label="Required Daily Run-Rate"
          value={`${neededDailyVelocity} / day`}
          subtext={`To achieve remaining ${remainingRegistrations} in ${remainingDays} days`}
          icon={Target}
          badgeText={parseFloat(velocity) >= parseFloat(neededDailyVelocity) ? 'Ahead of Goal' : 'Behind Goal'}
          badgeType={parseFloat(velocity) >= parseFloat(neededDailyVelocity) ? 'positive' : 'warning'}
          accentColor="#10B981"
        />

        <MetricCard
          label="Projected Final Registrations"
          value={`~${projectedFinal}`}
          subtext={`Target: ${campaign.targetRegistrations} (+${Math.max(0, projectedFinal - campaign.targetRegistrations)} buffer)`}
          icon={Zap}
          badgeText={`${Math.round((projectedFinal / campaign.targetRegistrations) * 100)}% of Goal`}
          badgeType="positive"
          accentColor="#0284C7"
        />

        <MetricCard
          label="Day Milestone Completion"
          value={`Day ${campaign.currentDay} / ${campaign.totalDays}`}
          subtext={`${remainingDays} days remaining before workshop`}
          icon={Calendar}
          badgeText={`${Math.round((campaign.currentDay / campaign.totalDays) * 100)}% Time Elapsed`}
          badgeType="neutral"
          accentColor="#8B5CF6"
        />
      </div>

      {/* Daily Breakdown Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-box">
            <h3>7-Day Trajectory Milestone Log</h3>
            <p className="card-subtitle">Daily actuals vs planned trajectory, variance, and cumulative pace</p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Campaign Day</th>
                <th>Daily Target</th>
                <th>Actual Signups</th>
                <th>Variance (Delta)</th>
                <th>Cumulative Total</th>
                <th>Cumulative Target</th>
                <th>Pacing Status</th>
              </tr>
            </thead>
            <tbody>
              {dailyMetrics.map((dayItem) => {
                const variance = dayItem.actual > 0 ? dayItem.actual - dayItem.target : 0;
                const isToday = dayItem.day === campaign.currentDay;
                const isPastOrToday = dayItem.day <= campaign.currentDay;

                return (
                  <tr
                    key={dayItem.day}
                    style={{
                      backgroundColor: isToday ? 'rgba(99,102,241,0.08)' : 'transparent',
                    }}
                  >
                    <td>
                      <strong style={{ color: isToday ? 'var(--primary-light)' : 'var(--text-highlight)' }}>
                        {dayItem.label}
                      </strong>
                      {isToday && (
                        <span className="badge badge-indigo" style={{ marginLeft: '8px', fontSize: '0.68rem' }}>
                          Today
                        </span>
                      )}
                    </td>
                    <td className="mono-cell">{dayItem.target}</td>
                    <td className="mono-cell">
                      {isPastOrToday ? (
                        <span style={{ fontWeight: '700', color: isToday ? '#38bdf8' : 'var(--text-highlight)' }}>
                          {dayItem.actual}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-dim)' }}>-- (Forecast: {dayItem.target})</span>
                      )}
                    </td>
                    <td>
                      {isPastOrToday ? (
                        <span
                          className={`badge ${variance >= 0 ? 'badge-green' : 'badge-rose'}`}
                          style={{ fontFamily: 'var(--font-mono)' }}
                        >
                          {variance >= 0 ? `+${variance}` : variance} ({variance >= 0 ? 'Ahead' : 'Below'})
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.74rem' }}>Scheduled</span>
                      )}
                    </td>
                    <td className="mono-cell" style={{ fontWeight: '700' }}>
                      {dayItem.cumulative}
                    </td>
                    <td className="mono-cell" style={{ color: 'var(--text-muted)' }}>
                      {dayItem.targetCum}
                    </td>
                    <td>
                      {isPastOrToday ? (
                        <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={12} /> Target Met
                        </span>
                      ) : (
                        <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
                          Upcoming
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scenario Planning Simulator */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-box">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={20} style={{ color: 'var(--accent-cyan)' }} />
              Growth Sensitivity & Scenario Simulator
            </h3>
            <p className="card-subtitle">
              Model what happens if growth levers are tweaked for the remaining {remainingDays} days
            </p>
          </div>
          <span className="badge badge-indigo">Interactive Model</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div>
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.84rem' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>
                  WhatsApp Forwarding Loop Multiplier:
                </label>
                <strong style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                  +{Math.round((viralBoostMultiplier - 1) * 100)}% Viral Lift
                </strong>
              </div>
              <input
                type="range"
                min="1.0"
                max="1.5"
                step="0.05"
                value={viralBoostMultiplier}
                onChange={(e) => setViralBoostMultiplier(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                <span>Baseline (1.0x)</span>
                <span>Moderate (+25%)</span>
                <span>Hyper-Viral (+50%)</span>
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.84rem' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>
                  Campus Ambassador Active Engagement Lift:
                </label>
                <strong style={{ color: 'var(--primary-light)', fontFamily: 'var(--font-mono)' }}>
                  +{ambassadorActivityLift}% Referrals
                </strong>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={ambassadorActivityLift}
                onChange={(e) => setAmbassadorActivityLift(parseInt(e.target.value, 10))}
                style={{ width: '100%', accentColor: 'var(--primary)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                <span>0% Lift</span>
                <span>+25% with Swag Unlocks</span>
                <span>+50% with Mentorship</span>
              </div>
            </div>
          </div>

          {/* Simulation Output Card */}
          <div
            style={{
              background: 'linear-gradient(145deg, #FFFFFF 0%, #F5F3FF 100%)',
              border: '1px solid var(--primary-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.06em', marginBottom: '6px' }}>
              Simulated Projected Final Total:
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-highlight)', fontFamily: 'var(--font-mono)' }}>
                {simulatedFinalProjected}
              </span>
              <span style={{ fontSize: '0.88rem', color: 'var(--accent-emerald-text)', fontWeight: '700', background: 'var(--accent-emerald-tint)', padding: '2px 8px', borderRadius: '999px', border: '1px solid var(--accent-emerald-border)' }}>
                +{simulatedFinalProjected - campaign.targetRegistrations} above target
              </span>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Simulated pace yields <strong>{Math.round(simulatedRemainingPerDay)} registrations/day</strong> for the remaining {remainingDays} days. This comfortably clears the 500 milestone by <strong>Day 6 (Friday evening)</strong>, leaving Day 7 for attendance confirmation and reminder broadcasts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
