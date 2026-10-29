import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CAMPAIGN_INFO,
  OUTREACH_TEMPLATES,
  getInitialDailyMetrics,
  getInitialChannels,
  getInitialAmbassadors,
  getInitialReferralCodes,
  getInitialExperiments,
  getInitialRegistrations,
} from '../data/defaultData';

const GrowthDataContext = createContext();

const STORAGE_KEYS = {
  DAILY_METRICS: 'campusai_growth_daily_metrics_v2',
  CHANNELS: 'campusai_growth_channels_v2',
  AMBASSADORS: 'campusai_growth_ambassadors_v2',
  REFERRAL_CODES: 'campusai_growth_referral_codes_v2',
  EXPERIMENTS: 'campusai_growth_experiments_v2',
  REGISTRATIONS: 'campusai_growth_registrations_v2',
};

// Clipboard copy with resilient fallback
export const copyTextToClipboard = async (text) => {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    console.warn('Clipboard API error, attempting fallback', err);
  }

  // Fallback for non-secure contexts or permission restrictions
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Copy fallback failed', err);
    return false;
  }
};

export const GrowthDataProvider = ({ children }) => {
  // Navigation & UI state
  const [activeTab, setActiveTab] = useState('overview');
  const [filterChannel, setFilterChannel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSimModalOpen, setIsSimModalOpen] = useState(false);
  const [isQuickRegOpen, setIsQuickRegOpen] = useState(false);
  const [activeReferralCode, setActiveReferralCode] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const ref = params.get('ref') || params.get('referral');
        if (ref) {
          const clean = ref.trim().toUpperCase();
          localStorage.setItem('campusai_ref_code', clean);
          return clean;
        }
        return localStorage.getItem('campusai_ref_code') || '';
      }
    } catch {}
    return '';
  });
  const [toast, setToast] = useState(null);

  // Load from localStorage or fallback to deep cloned initial defaults
  const [dailyMetrics, setDailyMetrics] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DAILY_METRICS);
      return saved ? JSON.parse(saved) : getInitialDailyMetrics();
    } catch {
      return getInitialDailyMetrics();
    }
  });

  const [channels, setChannels] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHANNELS);
      return saved ? JSON.parse(saved) : getInitialChannels();
    } catch {
      return getInitialChannels();
    }
  });

  const [ambassadors, setAmbassadors] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AMBASSADORS);
      return saved ? JSON.parse(saved) : getInitialAmbassadors();
    } catch {
      return getInitialAmbassadors();
    }
  });

  const [referralCodes, setReferralCodes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REFERRAL_CODES);
      return saved ? JSON.parse(saved) : getInitialReferralCodes();
    } catch {
      return getInitialReferralCodes();
    }
  });

  const [experiments, setExperiments] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXPERIMENTS);
      return saved ? JSON.parse(saved) : getInitialExperiments();
    } catch {
      return getInitialExperiments();
    }
  });

  const [registrations, setRegistrations] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
      return saved ? JSON.parse(saved) : getInitialRegistrations();
    } catch {
      return getInitialRegistrations();
    }
  });

  // Query parameter attribution & tab detection on initial mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.location?.search) {
        const params = new URLSearchParams(window.location.search);
        
        // Tab parameter handling with legacy normalization
        const tabParam = params.get('tab');
        if (tabParam) {
          const lower = tabParam.toLowerCase();
          if (lower === 'channels' || lower === 'studio' || lower === 'acquisition') {
            setActiveTab('acquisition');
          } else if (lower === 'ambassadors' || lower === 'referrals') {
            setActiveTab('referrals');
          } else if (lower === 'progress' || lower === 'overview') {
            setActiveTab('overview');
          } else if (lower === 'experiments') {
            setActiveTab('experiments');
          } else if (lower === 'registrations') {
            setActiveTab('registrations');
          }
        }

        const refParam = params.get('ref') || params.get('referral');
        if (refParam) {
          const cleanParam = refParam.trim().toUpperCase();
          setActiveReferralCode(cleanParam);

          // Track referral link click once per session to prevent inflate loops
          const sessionTrackKey = `campusai_click_tracked_${cleanParam}`;
          if (!sessionStorage.getItem(sessionTrackKey)) {
            sessionStorage.setItem(sessionTrackKey, 'true');
            setReferralCodes((prev) =>
              prev.map((rc) => {
                if (rc.code.toUpperCase() === cleanParam) {
                  const newClicks = rc.clicks + 1;
                  const conv = `${((rc.signups / newClicks) * 100).toFixed(1)}%`;
                  return { ...rc, clicks: newClicks, conv };
                }
                return rc;
              })
            );

            // Also increment ambassador channel clicks
            setChannels((prev) =>
              prev.map((ch) => {
                if (ch.id === 'ambassadors') {
                  const newClicks = ch.clicks + 1;
                  const conv = parseFloat(((ch.registrations / newClicks) * 100).toFixed(1));
                  return { ...ch, clicks: newClicks, conversionRate: conv };
                }
                return ch;
              })
            );

            showToast(`🔗 Referral link activated! Attributed to: ${cleanParam}`, 'info');
          }
        }
      }
    } catch (e) {
      console.warn('URL parsing error', e);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DAILY_METRICS, JSON.stringify(dailyMetrics));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [dailyMetrics]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHANNELS, JSON.stringify(channels));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [channels]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AMBASSADORS, JSON.stringify(ambassadors));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [ambassadors]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REFERRAL_CODES, JSON.stringify(referralCodes));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [referralCodes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EXPERIMENTS, JSON.stringify(experiments));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [experiments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [registrations]);

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3800);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Derived metrics calculations
  const totalRegistrations = channels.reduce((sum, ch) => sum + ch.registrations, 0);
  const totalSpend = channels.reduce((sum, ch) => sum + ch.spend, 0);
  const blendedCac = totalRegistrations > 0 ? (totalSpend / totalRegistrations).toFixed(2) : '0.00';
  const velocity = (totalRegistrations / CAMPAIGN_INFO.currentDay).toFixed(1);
  const remainingRegistrations = Math.max(0, CAMPAIGN_INFO.targetRegistrations - totalRegistrations);
  const remainingDays = Math.max(1, CAMPAIGN_INFO.totalDays - CAMPAIGN_INFO.currentDay);
  const neededDailyVelocity = (remainingRegistrations / remainingDays).toFixed(1);
  const projectedFinal = Math.round(totalRegistrations + parseFloat(velocity) * remainingDays);
  const progressPercent = Math.min(100, Math.round((totalRegistrations / CAMPAIGN_INFO.targetRegistrations) * 100));
  const budgetPercent = Math.min(100, Math.round((totalSpend / CAMPAIGN_INFO.totalBudget) * 100));

  // Add registration with duplicate email prevention and consistent multi-channel updates
  const addRegistration = ({ name, email, college, channelId, referralCode }) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (name || '').trim();
    const cleanCollege = (college || '').trim();
    const cleanRef = (referralCode || activeReferralCode || '').trim().toUpperCase();

    // 1. Audit check: Duplicate email prevention
    const existingIndex = registrations.findIndex(
      (r) => (r.email || '').trim().toLowerCase() === cleanEmail
    );
    if (existingIndex !== -1) {
      const existing = registrations[existingIndex];
      showToast(`⚠️ Student "${existing.name}" (${cleanEmail}) is already registered! Duplicate prevented.`, 'warning');
      return { success: false, reason: 'duplicate_email', message: 'Email already registered.' };
    }

    // Determine target channel: if referral code provided, attribute to ambassadors channel
    const targetChannelId = cleanRef ? 'ambassadors' : (channelId || 'whatsapp-groups');
    const matchedChannelObj = channels.find((c) => c.id === targetChannelId) || channels[0];

    // 2. Create new registration entry
    const newReg = {
      id: `reg-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      college: cleanCollege,
      channel: cleanRef ? `Ambassador (${cleanRef})` : matchedChannelObj.name,
      referralCode: cleanRef || null,
      time: 'Just now',
      verified: true,
      timestamp: new Date().toISOString(),
    };

    setRegistrations((prev) => [newReg, ...prev]);

    // 3. Update channel stats
    setChannels((prev) =>
      prev.map((ch) => {
        if (ch.id === targetChannelId) {
          const newRegs = ch.registrations + 1;
          const newClicks = Math.max(newRegs, ch.clicks + 1);
          const newConv = parseFloat(((newRegs / newClicks) * 100).toFixed(1));
          const newCac = ch.spend > 0 ? parseFloat((ch.spend / newRegs).toFixed(2)) : 0;
          return {
            ...ch,
            registrations: newRegs,
            clicks: newClicks,
            conversionRate: newConv,
            cac: newCac,
          };
        }
        return ch;
      })
    );

    // 4. Update daily metrics: Day 4 actual + 1, and all days >= 4 cumulative + 1 to keep trajectory monotonic
    setDailyMetrics((prev) =>
      prev.map((m) => {
        if (m.day === CAMPAIGN_INFO.currentDay) {
          return { ...m, actual: m.actual + 1, cumulative: m.cumulative + 1 };
        }
        if (m.day > CAMPAIGN_INFO.currentDay) {
          return { ...m, cumulative: m.cumulative + 1 };
        }
        return m;
      })
    );

    // 5. Update ambassador & referral code if code matches
    if (cleanRef) {
      setAmbassadors((prev) =>
        prev.map((amb) => {
          if (amb.code.toUpperCase() === cleanRef) {
            const newRefs = amb.referrals + 1;
            let newTier = amb.tier;
            let newReward = amb.rewardUnlocked;
            if (newRefs >= 30) {
              newTier = 'Elite Ambassador';
              newReward = 'Exclusive NxtWave Fellow Badge + VIP Mentorship + Full Swag Pack';
            } else if (newRefs >= 20) {
              newTier = 'Gold Ambassador';
              newReward = 'VIP AI Mentorship + NxtWave Swag Box';
            } else if (newRefs >= 15) {
              newTier = 'Silver Ambassador';
              newReward = '1-on-1 AI Resume Review + Letter of Recommendation';
            } else if (newRefs >= 5) {
              newTier = 'Bronze Ambassador';
              newReward = 'Exclusive AI Prompt Toolkit & Certificate';
            }
            return {
              ...amb,
              referrals: newRefs,
              tier: newTier,
              rewardUnlocked: newReward,
            };
          }
          return amb;
        })
      );

      setReferralCodes((prev) => {
        const exists = prev.some((rc) => rc.code.toUpperCase() === cleanRef);
        if (exists) {
          return prev.map((rc) => {
            if (rc.code.toUpperCase() === cleanRef) {
              const newSignups = rc.signups + 1;
              const newClicks = Math.max(newSignups, rc.clicks + 1);
              const newConv = `${((newSignups / newClicks) * 100).toFixed(1)}%`;
              return { ...rc, signups: newSignups, clicks: newClicks, conv: newConv };
            }
            return rc;
          });
        } else {
          // If a custom or external code was used, register it into referral tracking
          const dynamicRef = {
            code: cleanRef,
            owner: `Promoter (${cleanRef})`,
            college: cleanCollege || 'Direct Referral',
            clicks: 1,
            signups: 1,
            conv: '100.0%',
            date: `Day ${CAMPAIGN_INFO.currentDay}`,
          };
          return [dynamicRef, ...prev];
        }
      });
    }

    // Trigger celebratory confetti effect
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#6366F1', '#10B981', '#06B6D4', '#F59E0B'],
      });
    } catch {
      // ignore
    }

    showToast(`🎉 Registration confirmed for ${cleanName}! All dashboard metrics updated.`);
    return { success: true, registration: newReg };
  };

  // Add growth experiment
  const addExperiment = ({ title, channel, hypothesis, impact, confidence, ease, owner }) => {
    const impNum = Math.min(10, Math.max(1, Number(impact) || 5));
    const confNum = Math.min(10, Math.max(1, Number(confidence) || 5));
    const easeNum = Math.min(10, Math.max(1, Number(ease) || 5));
    const iceScore = impNum * confNum * easeNum;

    const newExp = {
      id: `exp-${Date.now()}`,
      title: (title || '').trim(),
      channel: channel || 'WhatsApp',
      hypothesis: (hypothesis || '').trim(),
      impact: impNum,
      confidence: confNum,
      ease: easeNum,
      iceScore,
      status: 'In Progress',
      stage: 'Testing',
      lift: 'Tracking initial cohort',
      keyLearning: 'Experiment active. Measuring early clickthrough rate and signups.',
      owner: (owner || 'Growth Team').trim(),
      date: `Day ${CAMPAIGN_INFO.currentDay}`,
    };

    setExperiments((prev) => [newExp, ...prev]);
    showToast(`🧪 Experiment "${newExp.title}" added with ICE score ${iceScore}!`);
    return newExp;
  };

  // Update experiment status
  const updateExperimentStatus = (id, newStatus) => {
    setExperiments((prev) =>
      prev.map((exp) => {
        if (exp.id === id) {
          let stage = exp.stage;
          if (newStatus === 'Winner') stage = 'Implemented';
          if (newStatus === 'In Progress' || newStatus === 'Running') stage = 'Testing';
          if (newStatus === 'Backlog') stage = 'Planned';
          if (newStatus === 'Invalidated') stage = 'Archived';
          return { ...exp, status: newStatus, stage };
        }
        return exp;
      })
    );
    showToast(`Experiment status updated to "${newStatus}"`);
  };

  // Create unique referral code & optional ambassador entry
  const addReferralCode = ({ ownerName, college, customCode, isAmbassador = true }) => {
    const cleanOwner = (ownerName || '').trim();
    const cleanCollege = (college || 'Campus General').trim();
    const rawCode = (customCode || `AI-${cleanOwner.split(' ')[0] || 'GROWTH'}`)
      .toUpperCase()
      .replace(/[^A-Z0-9-]/g, '');
    const baseCode = rawCode.startsWith('AI-') ? rawCode : `AI-${rawCode}`;

    // Guarantee code uniqueness
    let finalCode = baseCode;
    let counter = 2;
    while (
      referralCodes.some((rc) => rc.code.toUpperCase() === finalCode.toUpperCase()) ||
      ambassadors.some((amb) => amb.code.toUpperCase() === finalCode.toUpperCase())
    ) {
      finalCode = `${baseCode}-${counter}`;
      counter++;
    }

    const newRef = {
      code: finalCode,
      owner: cleanOwner,
      college: cleanCollege,
      clicks: 0,
      signups: 0,
      conv: '0.0%',
      date: `Day ${CAMPAIGN_INFO.currentDay}`,
    };

    setReferralCodes((prev) => [newRef, ...prev]);

    if (isAmbassador) {
      const initials = cleanOwner
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      const newAmb = {
        id: `amb-${Date.now()}`,
        name: cleanOwner,
        college: cleanCollege,
        year: 'Student Evangelist',
        code: finalCode,
        referrals: 0,
        target: 15,
        tier: 'Rising Star',
        rewardUnlocked: 'Welcome AI Starter Kit',
        status: 'Active',
        avatar: initials || 'AM',
      };
      setAmbassadors((prev) => [newAmb, ...prev]);
    }

    if (finalCode !== baseCode) {
      showToast(`✨ Code existed, generated unique tag: ${finalCode}`, 'info');
    } else {
      showToast(`✨ Generated referral code: ${finalCode}`);
    }
    return finalCode;
  };

  // Reset to seed demo data
  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEYS.DAILY_METRICS);
    localStorage.removeItem(STORAGE_KEYS.CHANNELS);
    localStorage.removeItem(STORAGE_KEYS.AMBASSADORS);
    localStorage.removeItem(STORAGE_KEYS.REFERRAL_CODES);
    localStorage.removeItem(STORAGE_KEYS.EXPERIMENTS);
    localStorage.removeItem(STORAGE_KEYS.REGISTRATIONS);

    setDailyMetrics(getInitialDailyMetrics());
    setChannels(getInitialChannels());
    setAmbassadors(getInitialAmbassadors());
    setReferralCodes(getInitialReferralCodes());
    setExperiments(getInitialExperiments());
    setRegistrations(getInitialRegistrations());
    setFilterChannel('all');
    setSearchQuery('');
    setActiveReferralCode('');

    showToast('🔄 Reset all data to default NxtWave campaign simulation defaults.', 'info');
  };

  return (
    <GrowthDataContext.Provider
      value={{
        campaign: CAMPAIGN_INFO,
        dailyMetrics,
        channels,
        ambassadors,
        referralCodes,
        experiments,
        registrations,
        outreachTemplates: OUTREACH_TEMPLATES,
        // Computed stats
        totalRegistrations,
        totalSpend,
        blendedCac,
        velocity,
        remainingRegistrations,
        remainingDays,
        neededDailyVelocity,
        projectedFinal,
        progressPercent,
        budgetPercent,
        // UI Navigation & Attribution
        activeTab,
        setActiveTab,
        filterChannel,
        setFilterChannel,
        searchQuery,
        setSearchQuery,
        isSimModalOpen,
        setIsSimModalOpen,
        isQuickRegOpen,
        setIsQuickRegOpen,
        activeReferralCode,
        setActiveReferralCode,
        toast,
        showToast,
        // Actions
        addRegistration,
        addExperiment,
        updateExperimentStatus,
        addReferralCode,
        resetToDefaults,
        copyTextToClipboard,
      }}
    >
      {children}
    </GrowthDataContext.Provider>
  );
};

export const useGrowthData = () => {
  const context = useContext(GrowthDataContext);
  if (!context) {
    throw new Error('useGrowthData must be used within a GrowthDataProvider');
  }
  return context;
};
