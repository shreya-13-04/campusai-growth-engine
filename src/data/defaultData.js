// Default seed data for CampusAI Growth Engine
// Campaign: "Build Your First AI Project in 60 Minutes"
// Target: 500 registrations in 7 days | Budget: ₹2,000

export const CAMPAIGN_INFO = {
  id: "nxtwave-ai-60m",
  title: "Build Your First AI Project in 60 Minutes",
  subTitle: "Free Interactive Hands-On AI Workshop for Engineering & Tech Students",
  organizer: "NxtWave Student Growth Initiative",
  targetRegistrations: 500,
  currentDay: 4,
  totalDays: 7,
  totalBudget: 2000, // ₹2,000 INR
  workshopDate: "Saturday, 6:00 PM - 7:00 PM IST",
  workshopPlatform: "YouTube Live + Hands-on CodeLab",
  learningOutcome: "Build & deploy a live AI Resume Summarizer using OpenAI / Claude API",
  prerequisites: "Basic Python or JavaScript (Beginner friendly)",
  isDemoSimulation: true,
};

export const INITIAL_DAILY_METRICS = [
  { day: 1, label: "Day 1 (Mon)", target: 50, actual: 48, spend: 200, cumulative: 48, targetCum: 50 },
  { day: 2, label: "Day 2 (Tue)", target: 70, actual: 82, spend: 350, cumulative: 130, targetCum: 120 },
  { day: 3, label: "Day 3 (Wed)", target: 80, actual: 96, spend: 390, cumulative: 226, targetCum: 200 },
  { day: 4, label: "Day 4 (Today)", target: 85, actual: 116, spend: 300, cumulative: 342, targetCum: 285 },
  { day: 5, label: "Day 5 (Tomorrow)", target: 85, actual: 0, spend: 0, cumulative: 342, targetCum: 370, isFuture: true },
  { day: 6, label: "Day 6 (Fri)", target: 70, actual: 0, spend: 0, cumulative: 342, targetCum: 440, isFuture: true },
  { day: 7, label: "Day 7 (Workshop Day)", target: 60, actual: 0, spend: 0, cumulative: 342, targetCum: 500, isFuture: true },
];

export const INITIAL_CHANNELS = [
  {
    id: "whatsapp-groups",
    name: "WhatsApp College & Batch Groups",
    category: "Organic Viral Loops",
    clicks: 720,
    registrations: 128,
    spend: 0,
    conversionRate: 17.8,
    cac: 0,
    color: "#25D366",
    status: "Top Performer",
    growthTactic: "1-click group forward kit with curiosity-driven teaser clip + free AI project starter kit link.",
  },
  {
    id: "ambassadors",
    name: "Campus Ambassador Network",
    category: "Peer-to-Peer",
    clicks: 580,
    registrations: 104,
    spend: 450,
    conversionRate: 17.9,
    cac: 4.33,
    color: "#6366F1",
    status: "High ROI",
    growthTactic: "12 student ambassadors across 9 campuses with personal referral codes + milestone rewards.",
  },
  {
    id: "tech-clubs",
    name: "College Clubs (Discord/Slack/Teams)",
    category: "Community Partnership",
    clicks: 310,
    registrations: 46,
    spend: 0,
    conversionRate: 14.8,
    cac: 0,
    color: "#5865F2",
    status: "High Intent",
    growthTactic: "Partnerships with student chapters (ACM, IEEE, CSI, GDG) for verified attendance certificates.",
  },
  {
    id: "instagram-boost",
    name: "Instagram Targeted Micro-Boost",
    category: "Paid Social",
    clicks: 440,
    registrations: 38,
    spend: 590,
    conversionRate: 8.6,
    cac: 15.53,
    color: "#E1306C",
    status: "Controlled Spend",
    growthTactic: "₹150/day reel boost showing 15-second time-lapse of building the AI project from scratch.",
  },
  {
    id: "linkedin-student",
    name: "LinkedIn Student Creator Posts",
    category: "Organic Social",
    clicks: 155,
    registrations: 16,
    spend: 0,
    conversionRate: 10.3,
    cac: 0,
    color: "#0A66C2",
    status: "Good Credibility",
    growthTactic: "Foundational posts on why building real AI projects beats passive video course watching.",
  },
  {
    id: "campus-posters",
    name: "Campus Notice Boards & Lab QR Posters",
    category: "Offline to Online",
    clicks: 85,
    registrations: 10,
    spend: 200,
    conversionRate: 11.8,
    cac: 20.0,
    color: "#F59E0B",
    status: "Niche Reach",
    growthTactic: "40 high-contrast A4 posters placed in CS computer labs and canteen tables with direct QR scan.",
  },
];

export const INITIAL_AMBASSADORS = [
  {
    id: "amb-1",
    name: "Aditya Sharma",
    college: "Vignana Bharathi Institute (VBIT), Hyderabad",
    year: "3rd Year CSE",
    code: "AI-ADITYA",
    referrals: 28,
    target: 30,
    tier: "Gold Ambassador",
    rewardUnlocked: "VIP AI Mentorship + NxtWave Swag Box",
    status: "Active",
    avatar: "AS",
  },
  {
    id: "amb-2",
    name: "Sneha Patel",
    college: "SRM Institute of Science & Tech, Chennai",
    year: "2nd Year IT",
    code: "AI-SNEHA",
    referrals: 22,
    target: 30,
    tier: "Gold Ambassador",
    rewardUnlocked: "VIP AI Mentorship Session",
    status: "Active",
    avatar: "SP",
  },
  {
    id: "amb-3",
    name: "Rohan Kulkarni",
    college: "College of Engineering Pune (COEP)",
    year: "3rd Year AI & DS",
    code: "AI-ROHAN",
    referrals: 18,
    target: 20,
    tier: "Silver Ambassador",
    rewardUnlocked: "AI Starter Pack + Letter of Recommendation",
    status: "Active",
    avatar: "RK",
  },
  {
    id: "amb-4",
    name: "Ananya Roy",
    college: "KIIT University, Bhubaneswar",
    year: "2nd Year CSE",
    code: "AI-ANANYA",
    referrals: 14,
    target: 20,
    tier: "Silver Ambassador",
    rewardUnlocked: "AI Starter Pack + Certificate",
    status: "Active",
    avatar: "AR",
  },
  {
    id: "amb-5",
    name: "Karthik Reddy",
    college: "Chaitanya Bharathi Institute (CBIT), Hyderabad",
    year: "3rd Year ECE",
    code: "AI-KARTHIK",
    referrals: 11,
    target: 15,
    tier: "Bronze Ambassador",
    rewardUnlocked: "Exclusive AI Prompt Toolkit",
    status: "Active",
    avatar: "KR",
  },
  {
    id: "amb-6",
    name: "Meera Nair",
    college: "RV College of Engineering (RVCE), Bengaluru",
    year: "2nd Year ISE",
    code: "AI-MEERA",
    referrals: 9,
    target: 15,
    tier: "Bronze Ambassador",
    rewardUnlocked: "Exclusive AI Prompt Toolkit",
    status: "Active",
    avatar: "MN",
  },
  {
    id: "amb-7",
    name: "Tanmay Joshi",
    college: "Delhi Technological University (DTU)",
    year: "1st Year CSE",
    code: "AI-TANMAY",
    referrals: 7,
    target: 15,
    tier: "Bronze Ambassador",
    rewardUnlocked: "Ambassador Badge & Certificate",
    status: "Active",
    avatar: "TJ",
  },
  {
    id: "amb-8",
    name: "Divya Menon",
    college: "Amrita Vishwa Vidyapeetham, Coimbatore",
    year: "3rd Year AI",
    code: "AI-DIVYA",
    referrals: 5,
    target: 10,
    tier: "Rising Star",
    rewardUnlocked: "Ambassador Badge & Certificate",
    status: "Active",
    avatar: "DM",
  },
];

export const INITIAL_REFERRAL_CODES = [
  { code: "AI-ADITYA", owner: "Aditya Sharma", college: "VBIT Hyderabad", clicks: 142, signups: 28, conv: "19.7%", date: "Day 1" },
  { code: "AI-SNEHA", owner: "Sneha Patel", college: "SRM Chennai", clicks: 118, signups: 22, conv: "18.6%", date: "Day 1" },
  { code: "AI-ROHAN", owner: "Rohan Kulkarni", college: "COEP Pune", clicks: 95, signups: 18, conv: "18.9%", date: "Day 2" },
  { code: "AI-ANANYA", owner: "Ananya Roy", college: "KIIT Bhubaneswar", clicks: 76, signups: 14, conv: "18.4%", date: "Day 2" },
  { code: "AI-KARTHIK", owner: "Karthik Reddy", college: "CBIT Hyderabad", clicks: 62, signups: 11, conv: "17.7%", date: "Day 2" },
  { code: "AI-MEERA", owner: "Meera Nair", college: "RVCE Bengaluru", clicks: 49, signups: 9, conv: "18.3%", date: "Day 3" },
  { code: "AI-CAMPUS50", owner: "General Campus Promo", college: "Multi-Campus", clicks: 88, signups: 15, conv: "17.0%", date: "Day 1" },
];

export const INITIAL_EXPERIMENTS = [
  {
    id: "exp-1",
    title: "1-Click WhatsApp Group Forwarding Kit with Curiosity Hook",
    channel: "WhatsApp",
    hypothesis: "Providing students a pre-formatted forward message with project GIF will triple forward rates compared to static text.",
    impact: 9,
    confidence: 8,
    ease: 9,
    iceScore: 648,
    status: "Winner",
    stage: "Implemented",
    lift: "+42% viral coefficient",
    keyLearning: "Using an eye-catching hook ('Don't waste 6 months on generic tutorials...') increased CTR by 2.4x.",
    owner: "Growth Team",
    date: "Day 1",
  },
  {
    id: "exp-2",
    title: "Milestone-Based Swag & Mentorship Tiers for Ambassadors",
    channel: "Ambassador Network",
    hypothesis: "Offering clear 5 / 15 / 30 referral unlocks will motivate the middle 60% of ambassadors to stay active past day 2.",
    impact: 9,
    confidence: 9,
    ease: 8,
    iceScore: 648,
    status: "Winner",
    stage: "Implemented",
    lift: "+68% active ambassadors",
    keyLearning: "Guaranteed 1-on-1 resume review milestone at 15 referrals was 3x more attractive than cash incentives.",
    owner: "Community Lead",
    date: "Day 2",
  },
  {
    id: "exp-3",
    title: "Instagram 15-Sec Reel: 'Building AI in 15 Lines of Code'",
    channel: "Instagram Paid",
    hypothesis: "Screen-recording of building an AI resume evaluator in 15 lines of code will yield < ₹15 CPL for 18-22 CS undergrads.",
    impact: 7,
    confidence: 6,
    ease: 7,
    iceScore: 294,
    status: "Running",
    stage: "Testing",
    lift: "CPL at ₹15.53 (Target: ₹14.00)",
    keyLearning: "High intent students clicked; need shorter caption and clearer free registration callout in first 3 seconds.",
    owner: "Performance Marketer",
    date: "Day 3",
  },
  {
    id: "exp-4",
    title: "Notice Board Posters with QR Code for 'Free AI Prompt Kit'",
    channel: "Offline / Lab Posters",
    hypothesis: "Curiosity headline QR code near college coding labs will bridge offline foot traffic into online signups.",
    impact: 6,
    confidence: 7,
    ease: 8,
    iceScore: 336,
    status: "Running",
    stage: "Testing",
    lift: "10 registrations from 40 posters",
    keyLearning: "Works best directly above desktop monitors in computer laboratories during practical hours.",
    owner: "Campus Ops",
    date: "Day 3",
  },
  {
    id: "exp-5",
    title: "College Tech Club (ACM/IEEE) Co-Host Certificate Endorsement",
    channel: "College Clubs",
    hypothesis: "Offering co-branded joint participation certificate to club members will drive entire batch signups in 1 day.",
    impact: 8,
    confidence: 8,
    ease: 6,
    iceScore: 384,
    status: "In Progress",
    stage: "Rolling Out",
    lift: "Expected +60 registrations",
    keyLearning: "Club leads responded enthusiastically when offered credit as community organizers.",
    owner: "Partnerships",
    date: "Day 4",
  },
  {
    id: "exp-6",
    title: "Personalized HOD / Faculty WhatsApp Endorsement Template",
    channel: "WhatsApp / Academic",
    hypothesis: "Students forwarding an academic-friendly notice for faculty to share in class groups will yield 30%+ conversion.",
    impact: 8,
    confidence: 5,
    ease: 5,
    iceScore: 200,
    status: "Backlog",
    stage: "Planning",
    lift: "Projected high authority trust",
    keyLearning: "Need conservative academic language without marketing jargon.",
    owner: "Growth Team",
    date: "Day 4",
  },
  {
    id: "exp-7",
    title: "Cold LinkedIn DMs to Random CS/IT Students",
    channel: "LinkedIn Direct",
    hypothesis: "Direct cold messaging 200 student profiles will yield 20+ quick registrations.",
    impact: 4,
    confidence: 4,
    ease: 5,
    iceScore: 80,
    status: "Invalidated",
    stage: "Stopped",
    lift: "Only 2 signups / high friction",
    keyLearning: "Cold DMs felt spammy and took too much manual time. Dropped in favor of WhatsApp peer loops.",
    owner: "Outreach Lead",
    date: "Day 2",
  },
];

export const INITIAL_REGISTRATIONS = [
  { id: "reg-1", name: "Rahul Verma", email: "rahul.v@vbit.ac.in", college: "VBIT Hyderabad", channel: "Ambassador (AI-ADITYA)", time: "10 mins ago", verified: true },
  { id: "reg-2", name: "Pooja Hegde", email: "pooja.h@srmist.edu.in", college: "SRM Chennai", channel: "WhatsApp Groups", time: "18 mins ago", verified: true },
  { id: "reg-3", name: "Adarsh Tiwari", email: "adarsh.t@coep.ac.in", college: "COEP Pune", channel: "Ambassador (AI-ROHAN)", time: "32 mins ago", verified: true },
  { id: "reg-4", name: "Simran Kaur", email: "simran.k@dtu.ac.in", college: "DTU Delhi", channel: "Tech Clubs (Discord)", time: "45 mins ago", verified: true },
  { id: "reg-5", name: "Nikhil Rao", email: "nikhil.r@rvce.edu.in", college: "RVCE Bengaluru", channel: "Instagram Boost", time: "1 hour ago", verified: true },
  { id: "reg-6", name: "Aniket Sen", email: "aniket.s@kiit.ac.in", college: "KIIT Bhubaneswar", channel: "Ambassador (AI-ANANYA)", time: "1 hour ago", verified: true },
  { id: "reg-7", name: "Swati Deshpande", email: "swati.d@vjti.ac.in", college: "VJTI Mumbai", channel: "WhatsApp Groups", time: "2 hours ago", verified: true },
  { id: "reg-8", name: "Gaurav Sharma", email: "gaurav.s@cbit.ac.in", college: "CBIT Hyderabad", channel: "Campus Posters/QR", time: "3 hours ago", verified: true },
  { id: "reg-9", name: "Bhavana Reddy", email: "bhavana.r@vbit.ac.in", college: "VBIT Hyderabad", channel: "Ambassador (AI-ADITYA)", time: "3 hours ago", verified: true },
  { id: "reg-10", name: "Kunal Mehra", email: "kunal.m@amrita.edu", college: "Amrita Coimbatore", channel: "LinkedIn Student Post", time: "4 hours ago", verified: true },
];

export const OUTREACH_TEMPLATES = [
  {
    id: "wa-peer-fomo",
    name: "WhatsApp Peer Forward (FOMO & Urgency)",
    channel: "WhatsApp",
    tone: "Urgent & High Impact",
    bestFor: "College class/batch WhatsApp groups and hostel floors",
    template: `⚡ *Only 158 seats left!* 

Hey {{studentName}}! If you haven't seen this yet, NxtWave is doing a free hands-on workshop:
🚀 *"Build Your First AI Project in 60 Minutes"*

📅 *When:* {{workshopDate}}
💻 *Cost:* 100% FREE (Online Live)
🎯 *What we build:* A working AI Resume Evaluator using live APIs (Looks crazy good on your GitHub & Resume).

No heavy prior AI experience needed, complete step-by-step guidance.

👉 *Claim your free student pass here:*
{{referralLink}}

Share this in your {{collegeName}} batch group before the 500 seat limit locks out! ⏱️`,
  },
  {
    id: "wa-value-first",
    name: "WhatsApp Value-First & Career Focus",
    channel: "WhatsApp",
    tone: "Skill & Career Value",
    bestFor: "Direct 1-on-1 messages to coding friends and project partners",
    template: `Hey {{studentName}} 👋 

Quick question — have you built any real-world AI projects for your resume yet? Most recruiters in 2026 filter for hands-on API proof-of-work rather than just video certificates.

There is a free 60-minute practical masterclass happening this week:
🔥 *"Build Your First AI Project in 60 Minutes"*

What you get:
✅ Complete project source code + live deployment
✅ Official Certificate of Participation
✅ Hands-on AI prompt engineering walkthrough

🎟️ *Register for Free:* {{referralLink}}
Host: NxtWave Student Growth Initiative
Let's both attend and add this to our projects section! Let me know once registered!`,
  },
  {
    id: "club-announcement",
    name: "Tech Club / Discord / Slack Announcement",
    channel: "Discord/Slack",
    tone: "Community & Official",
    bestFor: "ACM, IEEE, CSI, GDG student club channels",
    template: `📢 **COMMUNITY WORKSHOP ANNOUNCEMENT** 📢

Attention {{collegeName}} tech community! 🤖

We are hosting a high-impact, zero-cost practical session in partnership with NxtWave:
**Build Your First AI Project in 60 Minutes**

🗓️ **Date & Time:** {{workshopDate}}
💻 **Format:** Live Interactive CodeLab
🎯 **Takeaway:** Deploy a functional AI application to production in 1 hour.
📜 **Incentives:** Verifiable Project Certificate & Open-Source Starter Kit

This is specially tailored for 1st-4th year engineering students looking to stand out in upcoming placement drives.

🔗 **Exclusive Student Registration Link:**
{{referralLink}}

*Note: Registrations are capped at 500 attendees across campuses to ensure code-along server capacity.*`,
  },
  {
    id: "insta-story-dm",
    name: "Instagram Story & DM Prompt Hook",
    channel: "Instagram",
    tone: "Casual & Visual",
    bestFor: "Instagram DMs, Story reply triggers, and broadcast channels",
    template: `Stop scrolling! ✋ If you're studying at {{collegeName}} and want a real AI project on your resume this semester:

Check out this 60-minute free workshop: "Build Your First AI Project in 60 Minutes" 🚀

👉 You build a live AI application from scratch
👉 No boring theory, straight code-along
👉 Free student access (Zero cost)

Tap here to grab your pass before slots close:
{{referralLink}}

Drop a '🔥' after you register!`,
  },
  {
    id: "email-academic",
    name: "Formal Email / Placement Cell / CR Notice",
    channel: "Email",
    tone: "Formal & Academic",
    bestFor: "Class representatives (CR), faculty notices, placement coordinators",
    template: `Subject: Invitation: Free Hands-on Workshop on Building AI Projects ({{workshopDate}})

Dear Students / {{studentName}},

We are pleased to share an opportunity for students at {{collegeName}} to participate in an interactive skill-building masterclass:

Workshop Title: "Build Your First AI Project in 60 Minutes"
Date & Time: {{workshopDate}}
Eligibility: Engineering & Computer Science Students (All semesters)
Registration Fee: Nil (Complimentary Educational Access)

Key Outcomes:
1. Understanding modern LLM API architectures
2. Hands-on development of a portfolio-ready AI tool
3. Verified Certificate of Completion from NxtWave

Students are advised to complete their free registration at the earliest via the official portal:
{{referralLink}}

Best regards,
Campus AI Student Initiative
NxtWave Growth Engine`,
  },
];

export const getInitialDailyMetrics = () => JSON.parse(JSON.stringify(INITIAL_DAILY_METRICS));
export const getInitialChannels = () => JSON.parse(JSON.stringify(INITIAL_CHANNELS));
export const getInitialAmbassadors = () => JSON.parse(JSON.stringify(INITIAL_AMBASSADORS));
export const getInitialReferralCodes = () => JSON.parse(JSON.stringify(INITIAL_REFERRAL_CODES));
export const getInitialExperiments = () => JSON.parse(JSON.stringify(INITIAL_EXPERIMENTS));
export const getInitialRegistrations = () => JSON.parse(JSON.stringify(INITIAL_REGISTRATIONS));
