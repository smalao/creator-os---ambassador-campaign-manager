// ============================================================
// Creator OS – Ambassador Campaign Manager
// Full application logic with localStorage persistence
// ============================================================

// --- State ---
let state = {
  campaigns: [],
  currentView: 'dashboard',
  searchQuery: '',
  statusFilter: null,
  editingCampaign: null,
  editingTask: null,
};

// --- Persistence ---
function loadState() {
  try {
    const saved = localStorage.getItem('creatorOS_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      state.campaigns = parsed.campaigns || [];
    }
    if (state.campaigns.length === 0) {
      state.campaigns = getSeedData();
      saveState();
    }
  } catch {
    state.campaigns = getSeedData();
  }
}

function saveState() {
  localStorage.setItem('creatorOS_state', JSON.stringify({ campaigns: state.campaigns }));
}

function getSeedData() {
  const today = new Date();
  const fmt = (d) => d.toISOString().split('T')[0];
  const daysAgo = (n) => { const d = new Date(today); d.setDate(d.getDate() - n); return fmt(d); };
  const daysFromNow = (n) => { const d = new Date(today); d.setDate(d.getDate() + n); return fmt(d); };

  return [
    {
      id: genId(),
      name: 'Aave Governance Push',
      protocol: 'Aave',
      chain: 'Ethereum',
      status: 'active',
      startDate: daysAgo(10),
      endDate: daysFromNow(20),
      rewardPool: 2500,
      rewardToken: 'USDC',
      description: 'Promote Aave governance proposals and drive community participation through Twitter threads and video content.',
      tags: ['DeFi', 'Governance'],
      tasks: [
        { id: genId(), title: 'Write Twitter thread on proposal #142', status: 'completed', deadline: daysAgo(3), proofLink: 'https://twitter.com/example/status/123', rewardEstimate: 300, notes: 'Got 2.4k impressions' },
        { id: genId(), title: 'Create YouTube explainer video', status: 'in-progress', deadline: daysFromNow(5), proofLink: '', rewardEstimate: 800, notes: 'Script done, editing in progress' },
        { id: genId(), title: 'Host Twitter Space with core team', status: 'pending', deadline: daysFromNow(12), proofLink: '', rewardEstimate: 500, notes: '' },
        { id: genId(), title: 'Write governance recap blog post', status: 'pending', deadline: daysFromNow(18), proofLink: '', rewardEstimate: 400, notes: '' },
      ]
    },
    {
      id: genId(),
      name: 'Arbitrum Community Growth',
      protocol: 'Arbitrum',
      chain: 'Arbitrum One',
      status: 'active',
      startDate: daysAgo(5),
      endDate: daysFromNow(25),
      rewardPool: 4000,
      rewardToken: 'ARB',
      description: 'Drive awareness for Arbitrum ecosystem projects through educational content and community engagement.',
      tags: ['L2', 'Community'],
      tasks: [
        { id: genId(), title: 'Infographic: Arbitrum vs other L2s', status: 'completed', deadline: daysAgo(1), proofLink: 'https://twitter.com/example/status/456', rewardEstimate: 500, notes: 'Well received, 5k impressions' },
        { id: genId(), title: 'Write Medium article on ecosystem', status: 'in-progress', deadline: daysFromNow(3), proofLink: '', rewardEstimate: 600, notes: 'Draft 80% complete' },
        { id: genId(), title: 'Create onboarding guide for new users', status: 'pending', deadline: daysFromNow(10), proofLink: '', rewardEstimate: 700, notes: '' },
      ]
    },
    {
      id: genId(),
      name: 'Lido Staking Awareness',
      protocol: 'Lido',
      chain: 'Ethereum',
      status: 'completed',
      startDate: daysAgo(40),
      endDate: daysAgo(5),
      rewardPool: 1800,
      rewardToken: 'LDO',
      description: 'Completed campaign to promote Lido liquid staking benefits to retail users.',
      tags: ['Staking', 'DeFi'],
      tasks: [
        { id: genId(), title: 'Twitter thread on stETH benefits', status: 'completed', deadline: daysAgo(30), proofLink: 'https://twitter.com/example/status/789', rewardEstimate: 600, notes: 'Great engagement' },
        { id: genId(), title: 'YouTube tutorial: How to stake with Lido', status: 'completed', deadline: daysAgo(20), proofLink: 'https://youtube.com/watch?v=example', rewardEstimate: 800, notes: '1.2k views in first week' },
        { id: genId(), title: 'Community AMA participation', status: 'completed', deadline: daysAgo(10), proofLink: 'https://discord.gg/example', rewardEstimate: 400, notes: 'Answered 15 questions' },
      ]
    },
    {
      id: genId(),
      name: 'Optimism RetroPGF Round',
      protocol: 'Optimism',
      chain: 'OP Mainnet',
      status: 'active',
      startDate: daysAgo(2),
      endDate: daysFromNow(30),
      rewardPool: 3200,
      rewardToken: 'OP',
      description: 'Content campaign to educate community about RetroPGF funding and how to participate.',
      tags: ['Public Goods', 'L2'],
      tasks: [
        { id: genId(), title: 'Explainer thread: What is RetroPGF?', status: 'in-progress', deadline: daysFromNow(3), proofLink: '', rewardEstimate: 400, notes: 'Researching past rounds' },
        { id: genId(), title: 'Video walkthrough of application process', status: 'pending', deadline: daysFromNow(10), proofLink: '', rewardEstimate: 900, notes: '' },
        { id: genId(), title: 'Interview 3 past RetroPGF recipients', status: 'pending', deadline: daysFromNow(20), proofLink: '', rewardEstimate: 1000, notes: '' },
        { id: genId(), title: 'Create voting guide infographic', status: 'pending', deadline: daysFromNow(25), proofLink: '', rewardEstimate: 500, notes: '' },
      ]
    }
  ];
}

// --- Utilities ---
function genId() {
  return 'id_' + Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateShort(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function daysUntil(dateStr) {
  if (!dateStr) return Infinity;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + 'T00:00:00');
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

function isOverdue(dateStr, status) {
  return status !== 'completed' && daysUntil(dateStr) < 0;
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// --- Stats Computation ---
function getStats() {
  const campaigns = state.campaigns;
  const allTasks = campaigns.flatMap(c => c.tasks);
  const activeCampaigns = campaigns.filter(c => c.status === 'active');
  const completedTasks = allTasks.filter(t => t.status === 'completed');
  const totalRewardEst = allTasks.reduce((sum, t) => sum + (t.rewardEstimate || 0), 0);
  const earnedReward = completedTasks.reduce((sum, t) => sum + (t.rewardEstimate || 0), 0);
  const overdueTasks = allTasks.filter(t => isOverdue(t.deadline, t.status));
  const inProgressTasks = allTasks.filter(t => t.status === 'in-progress');
  const pendingTasks = allTasks.filter(t => t.status === 'pending');
  const completionRate = allTasks.length > 0 ? Math.round((completedTasks.length / allTasks.length) * 100) : 0;

  return {
    totalCampaigns: campaigns.length,
    activeCampaigns: activeCampaigns.length,
    totalTasks: allTasks.length,
    completedTasks: completedTasks.length,
    inProgressTasks: inProgressTasks.length,
    pendingTasks: pendingTasks.length,
    overdueTasks: overdueTasks.length,
    totalRewardEst,
    earnedReward,
    completionRate,
  };
}

// --- Navigation ---
function navigateTo(view) {
  state.currentView = view;
  state.statusFilter = null;
  state.searchQuery = '';
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';
  updateNavActive(view);
  render();
}

function updateNavActive(view) {
  document.querySelectorAll('[data-nav]').forEach(btn => {
    btn.classList.remove('active', 'text-brand-700');
    btn.classList.add('text-surface-600');
  });
  const activeBtn = document.querySelector(`[data-nav="${view}"]`);
  if (activeBtn) {
    activeBtn.classList.add('active');
    activeBtn.classList.remove('text-surface-600');
  }
}

function filterByStatus(status) {
  state.currentView = 'tasks';
  state.statusFilter = status;
  updateNavActive('tasks');
  render();
}

function handleSearch(query) {
  state.searchQuery = query.toLowerCase().trim();
  render();
}

// --- Sidebar Toggle ---
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.toggle('-translate-x-full');
  overlay.classList.toggle('hidden');
}

// --- Rendering ---
function render() {
  const stats = getStats();
  document.getElementById('campaignCount').textContent = stats.totalCampaigns;
  document.getElementById('taskCount').textContent = stats.totalTasks;
  document.getElementById('overdueCount').textContent = stats.overdueTasks;

  const container = document.getElementById('pageContent');
  const titles = { dashboard: 'Dashboard', campaigns: 'Campaigns', tasks: 'All Tasks', rewards: 'Rewards Overview', campaignDetail: 'Campaign Details' };
  document.getElementById('pageTitle').textContent = titles[state.currentView] || 'Dashboard';

  switch (state.currentView) {
    case 'dashboard': container.innerHTML = renderDashboard(stats); break;
    case 'campaigns': container.innerHTML = renderCampaigns(); break;
    case 'tasks': container.innerHTML = renderAllTasks(); break;
    case 'rewards': container.innerHTML = renderRewards(); break;
    case 'campaignDetail': container.innerHTML = renderCampaignDetail(); break;
    default: container.innerHTML = renderDashboard(stats);
  }
}

// --- Dashboard ---
function renderDashboard(stats) {
  const upcomingTasks = state.campaigns
    .filter(c => c.status === 'active')
    .flatMap(c => c.tasks.map(t => ({ ...t, campaignName: c.name, campaignId: c.id })))
    .filter(t => t.status !== 'completed')
    .sort((a, b) => {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
    })
    .slice(0, 6);

  const recentCampaigns = [...state.campaigns]
    .filter(c => c.status === 'active')
    .slice(0, 3);

  return `
    <div class="fade-in space-y-6">
      <!-- Stats Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        ${statCard('Active Campaigns', stats.activeCampaigns, stats.totalCampaigns + ' total', 'brand', `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>`)}
        ${statCard('Task Progress', stats.completionRate + '%', stats.completedTasks + '/' + stats.totalTasks + ' done', 'emerald', `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`)}
        ${statCard('Est. Earned', '$' + stats.earnedReward.toLocaleString(), '$' + stats.totalRewardEst.toLocaleString() + ' potential', 'amber', `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`)}
        ${statCard('Overdue', stats.overdueTasks, stats.inProgressTasks + ' in progress', stats.overdueTasks > 0 ? 'red' : 'surface', `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`)}
      </div>

      <!-- Two Columns -->
      <div class="grid lg:grid-cols-5 gap-6">
        <!-- Upcoming Tasks -->
        <div class="lg:col-span-3">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-sm font-semibold text-surface-800">Upcoming Tasks</h2>
            <button onclick="navigateTo('tasks')" class="text-xs text-brand-600 hover:text-brand-700 font-medium">View all &rarr;</button>
          </div>
          <div class="bg-white rounded-xl border border-surface-200 shadow-sm overflow-hidden">
            ${upcomingTasks.length === 0 ? emptyState('No upcoming tasks', 'Add tasks to your active campaigns to see them here.') : `
              <div class="divide-y divide-surface-100">
                ${upcomingTasks.map(t => taskRow(t, true)).join('')}
              </div>
            `}
          </div>
        </div>

        <!-- Active Campaigns -->
        <div class="lg:col-span-2">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-sm font-semibold text-surface-800">Active Campaigns</h2>
            <button onclick="navigateTo('campaigns')" class="text-xs text-brand-600 hover:text-brand-700 font-medium">View all &rarr;</button>
          </div>
          <div class="space-y-3">
            ${recentCampaigns.length === 0 ? `<div class="bg-white rounded-xl border border-surface-200 shadow-sm">${emptyState('No active campaigns', 'Create your first campaign to get started.')}</div>` : recentCampaigns.map(c => campaignMiniCard(c)).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function statCard(label, value, sub, color, icon) {
  const colorMap = {
    brand: { bg: 'bg-brand-50', text: 'text-brand-600', icon: 'text-brand-500' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: 'text-emerald-500' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', icon: 'text-amber-500' },
    red: { bg: 'bg-red-50', text: 'text-red-600', icon: 'text-red-500' },
    surface: { bg: 'bg-surface-50', text: 'text-surface-600', icon: 'text-surface-500' },
  };
  const c = colorMap[color] || colorMap.surface;
  return `
    <div class="stat-card bg-white rounded-xl border border-surface-200 shadow-sm p-4">
      <div class="flex items-start justify-between mb-3">
        <div class="${c.bg} ${c.icon} p-2 rounded-lg">${icon}</div>
      </div>
      <p class="text-2xl font-bold text-surface-900">${value}</p>
      <p class="text-xs text-surface-500 mt-0.5 font-medium">${escapeHtml(label)}</p>
      <p class="text-[11px] text-surface-400 mt-1">${escapeHtml(sub)}</p>
    </div>
  `;
}

function taskRow(task, showCampaign) {
  const overdue = isOverdue(task.deadline, task.status);
  const days = daysUntil(task.deadline);
  let deadlineLabel = '';
  let deadlineColor = 'text-surface-500';
  if (task.status === 'completed') {
    deadlineLabel = 'Done';
    deadlineColor = 'text-emerald-600';
  } else if (overdue) {
    deadlineLabel = Math.abs(days) + 'd overdue';
    deadlineColor = 'text-red-500';
  } else if (days === 0) {
    deadlineLabel = 'Today';
    deadlineColor = 'text-amber-600';
  } else if (days === 1) {
    deadlineLabel = 'Tomorrow';
    deadlineColor = 'text-amber-600';
  } else if (days <= 7) {
    deadlineLabel = days + 'd left';
    deadlineColor = 'text-amber-600';
  } else {
    deadlineLabel = formatDateShort(task.deadline);
  }

  const statusBadge = getStatusBadge(task.status);

  return `
    <div class="task-row flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors" onclick="cycleTaskStatus('${task.campaignId || ''}', '${task.id}')">
      <button class="flex-shrink-0" title="Toggle status">
        ${task.status === 'completed' 
          ? `<div class="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"><svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg></div>`
          : task.status === 'in-progress'
          ? `<div class="w-5 h-5 rounded-full border-2 border-amber-400 bg-amber-50 flex items-center justify-center"><div class="w-2 h-2 rounded-full bg-amber-400"></div></div>`
          : `<div class="w-5 h-5 rounded-full border-2 border-surface-300"></div>`
        }
      </button>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium ${task.status === 'completed' ? 'text-surface-400 line-through' : 'text-surface-800'} truncate">${escapeHtml(task.title)}</p>
        ${showCampaign && task.campaignName ? `<p class="text-[11px] text-surface-400 mt-0.5 truncate">${escapeHtml(task.campaignName)}</p>` : ''}
      </div>
      ${task.rewardEstimate ? `<span class="hidden sm:inline text-xs font-medium text-surface-500">$${task.rewardEstimate}</span>` : ''}
      ${task.proofLink ? `<a href="${escapeHtml(task.proofLink)}" target="_blank" rel="noopener" onclick="event.stopPropagation()" class="hidden sm:flex items-center text-brand-500 hover:text-brand-700" title="View proof"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg></a>` : ''}
      <span class="text-xs font-medium ${deadlineColor} whitespace-nowrap">${deadlineLabel}</span>
    </div>
  `;
}

function campaignMiniCard(c) {
  const totalTasks = c.tasks.length;
  const doneTasks = c.tasks.filter(t => t.status === 'completed').length;
  const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const totalReward = c.tasks.reduce((s, t) => s + (t.rewardEstimate || 0), 0);

  return `
    <div class="campaign-card bg-white rounded-xl border border-surface-200 shadow-sm p-4 cursor-pointer" onclick="viewCampaign('${c.id}')">
      <div class="flex items-start justify-between mb-2">
        <div class="min-w-0 flex-1">
          <h3 class="text-sm font-semibold text-surface-800 truncate">${escapeHtml(c.name)}</h3>
          <p class="text-[11px] text-surface-400 mt-0.5">${escapeHtml(c.protocol)} &middot; ${escapeHtml(c.chain)}</p>
        </div>
        ${getStatusBadge(c.status)}
      </div>
      <div class="flex items-center gap-2 mt-3">
        <div class="flex-1 h-1.5 bg-surface-100 rounded-full overflow-hidden">
          <div class="progress-bar h-full rounded-full ${pct === 100 ? 'bg-emerald-500' : 'bg-brand-500'}" style="width: ${pct}%"></div>
        </div>
        <span class="text-[11px] font-medium text-surface-500">${pct}%</span>
      </div>
      <div class="flex items-center justify-between mt-2.5 text-[11px] text-surface-400">
        <span>${doneTasks}/${totalTasks} tasks</span>
        <span class="font-medium text-surface-600">~$${totalReward.toLocaleString()} ${escapeHtml(c.rewardToken || '')}</span>
      </div>
    </div>
  `;
}

// --- Campaigns Page ---
function renderCampaigns() {
  let campaigns = [...state.campaigns];
  if (state.searchQuery) {
    campaigns = campaigns.filter(c =>
      c.name.toLowerCase().includes(state.searchQuery) ||
      c.protocol.toLowerCase().includes(state.searchQuery) ||
      c.chain.toLowerCase().includes(state.searchQuery) ||
      (c.tags || []).some(t => t.toLowerCase().includes(state.searchQuery))
    );
  }

  const active = campaigns.filter(c => c.status === 'active');
  const completed = campaigns.filter(c => c.status === 'completed');
  const paused = campaigns.filter(c => c.status === 'paused');

  return `
    <div class="fade-in space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-surface-500">${campaigns.length} campaign${campaigns.length !== 1 ? 's' : ''} total</p>
        </div>
      </div>

      ${active.length > 0 ? `
        <div>
          <h2 class="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Active (${active.length})</h2>
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            ${active.map(c => campaignFullCard(c)).join('')}
          </div>
        </div>
      ` : ''}

      ${paused.length > 0 ? `
        <div>
          <h2 class="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Paused (${paused.length})</h2>
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            ${paused.map(c => campaignFullCard(c)).join('')}
          </div>
        </div>
      ` : ''}

      ${completed.length > 0 ? `
        <div>
          <h2 class="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Completed (${completed.length})</h2>
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            ${completed.map(c => campaignFullCard(c)).join('')}
          </div>
        </div>
      ` : ''}

      ${campaigns.length === 0 ? `<div class="bg-white rounded-xl border border-surface-200 shadow-sm">${emptyState('No campaigns found', state.searchQuery ? 'Try a different search term.' : 'Click "New Campaign" to create one.')}</div>` : ''}
    </div>
  `;
}

function campaignFullCard(c) {
  const totalTasks = c.tasks.length;
  const doneTasks = c.tasks.filter(t => t.status === 'completed').length;
  const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const totalReward = c.tasks.reduce((s, t) => s + (t.rewardEstimate || 0), 0);
  const earnedReward = c.tasks.filter(t => t.status === 'completed').reduce((s, t) => s + (t.rewardEstimate || 0), 0);
  const overdueTasks = c.tasks.filter(t => isOverdue(t.deadline, t.status)).length;
  const daysLeft = daysUntil(c.endDate);

  return `
    <div class="campaign-card bg-white rounded-xl border border-surface-200 shadow-sm overflow-hidden cursor-pointer" onclick="viewCampaign('${c.id}')">
      <div class="p-4">
        <div class="flex items-start justify-between mb-1">
          <h3 class="text-sm font-semibold text-surface-800 leading-snug pr-2">${escapeHtml(c.name)}</h3>
          ${getStatusBadge(c.status)}
        </div>
        <p class="text-[11px] text-surface-400 mb-3">${escapeHtml(c.protocol)} &middot; ${escapeHtml(c.chain)}</p>

        ${c.tags && c.tags.length > 0 ? `
          <div class="flex flex-wrap gap-1 mb-3">
            ${c.tags.map(tag => `<span class="tag-pill text-[10px] font-medium px-2 py-0.5 rounded-full bg-brand-50 text-brand-600">${escapeHtml(tag)}</span>`).join('')}
          </div>
        ` : ''}

        <div class="flex items-center gap-2 mb-2">
          <div class="flex-1 h-1.5 bg-surface-100 rounded-full overflow-hidden">
            <div class="progress-bar h-full rounded-full ${pct === 100 ? 'bg-emerald-500' : 'bg-brand-500'}" style="width: ${pct}%"></div>
          </div>
          <span class="text-[11px] font-semibold text-surface-500">${pct}%</span>
        </div>

        <div class="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3 text-[11px]">
          <div class="flex justify-between">
            <span class="text-surface-400">Tasks</span>
            <span class="font-medium text-surface-700">${doneTasks}/${totalTasks}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-surface-400">Earned</span>
            <span class="font-medium text-surface-700">$${earnedReward.toLocaleString()}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-surface-400">Pool</span>
            <span class="font-medium text-surface-700">$${totalReward.toLocaleString()} ${escapeHtml(c.rewardToken || '')}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-surface-400">Deadline</span>
            <span class="font-medium ${daysLeft < 0 ? 'text-red-500' : daysLeft <= 7 ? 'text-amber-600' : 'text-surface-700'}">${c.status === 'completed' ? 'Ended' : daysLeft < 0 ? 'Expired' : daysLeft + 'd left'}</span>
          </div>
        </div>

        ${overdueTasks > 0 ? `
          <div class="mt-3 flex items-center gap-1.5 text-[11px] text-red-500 font-medium">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.072 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
            ${overdueTasks} overdue task${overdueTasks > 1 ? 's' : ''}
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// --- Campaign Detail ---
function viewCampaign(campaignId) {
  state.editingCampaign = campaignId;
  state.currentView = 'campaignDetail';
  document.getElementById('pageTitle').textContent = 'Campaign Details';
  render();
}

function renderCampaignDetail() {
  const c = state.campaigns.find(c => c.id === state.editingCampaign);
  if (!c) return `<div class="bg-white rounded-xl border border-surface-200 shadow-sm">${emptyState('Campaign not found', 'This campaign may have been deleted.')}</div>`;

  const totalTasks = c.tasks.length;
  const doneTasks = c.tasks.filter(t => t.status === 'completed').length;
  const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const totalReward = c.tasks.reduce((s, t) => s + (t.rewardEstimate || 0), 0);
  const earnedReward = c.tasks.filter(t => t.status === 'completed').reduce((s, t) => s + (t.rewardEstimate || 0), 0);

  let filteredTasks = [...c.tasks];
  if (state.searchQuery) {
    filteredTasks = filteredTasks.filter(t => t.title.toLowerCase().includes(state.searchQuery));
  }

  return `
    <div class="fade-in space-y-6">
      <!-- Back -->
      <button onclick="navigateTo('campaigns')" class="flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-700 font-medium transition-colors">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
        Back to Campaigns
      </button>

      <!-- Header -->
      <div class="bg-white rounded-xl border border-surface-200 shadow-sm p-5 sm:p-6">
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div class="min-w-0">
            <div class="flex items-center gap-2.5 mb-1">
              <h2 class="text-lg font-bold text-surface-900">${escapeHtml(c.name)}</h2>
              ${getStatusBadge(c.status)}
            </div>
            <p class="text-sm text-surface-500">${escapeHtml(c.protocol)} &middot; ${escapeHtml(c.chain)}</p>
            ${c.description ? `<p class="text-sm text-surface-600 mt-2 leading-relaxed">${escapeHtml(c.description)}</p>` : ''}
            ${c.tags && c.tags.length > 0 ? `
              <div class="flex flex-wrap gap-1.5 mt-3">
                ${c.tags.map(tag => `<span class="tag-pill text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-600">${escapeHtml(tag)}</span>`).join('')}
              </div>
            ` : ''}
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <button onclick="openModal('editCampaign', '${c.id}')" class="text-sm font-medium px-3 py-1.5 rounded-lg border border-surface-200 text-surface-600 hover:bg-surface-50 transition-colors">Edit</button>
            <button onclick="deleteCampaign('${c.id}')" class="text-sm font-medium px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors">Delete</button>
          </div>
        </div>

        <!-- Stats Row -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-surface-100">
          <div>
            <p class="text-[11px] text-surface-400 font-medium uppercase tracking-wider">Duration</p>
            <p class="text-sm font-semibold text-surface-800 mt-0.5">${formatDateShort(c.startDate)} – ${formatDateShort(c.endDate)}</p>
          </div>
          <div>
            <p class="text-[11px] text-surface-400 font-medium uppercase tracking-wider">Progress</p>
            <div class="flex items-center gap-2 mt-1">
              <div class="flex-1 h-1.5 bg-surface-100 rounded-full overflow-hidden">
                <div class="progress-bar h-full rounded-full ${pct === 100 ? 'bg-emerald-500' : 'bg-brand-500'}" style="width: ${pct}%"></div>
              </div>
              <span class="text-xs font-semibold text-surface-600">${pct}%</span>
            </div>
          </div>
          <div>
            <p class="text-[11px] text-surface-400 font-medium uppercase tracking-wider">Earned</p>
            <p class="text-sm font-semibold text-emerald-600 mt-0.5">$${earnedReward.toLocaleString()}</p>
          </div>
          <div>
            <p class="text-[11px] text-surface-400 font-medium uppercase tracking-wider">Total Pool</p>
            <p class="text-sm font-semibold text-surface-800 mt-0.5">$${totalReward.toLocaleString()} ${escapeHtml(c.rewardToken || '')}</p>
          </div>
        </div>
      </div>

      <!-- Tasks -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-surface-800">Tasks (${filteredTasks.length})</h3>
          <button onclick="openModal('task', '${c.id}')" class="flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
            Add Task
          </button>
        </div>
        <div class="bg-white rounded-xl border border-surface-200 shadow-sm overflow-hidden">
          ${filteredTasks.length === 0 ? emptyState('No tasks yet', 'Add a task to start tracking your work.') : `
            <div class="divide-y divide-surface-100">
              ${filteredTasks.map(t => taskDetailRow(t, c.id)).join('')}
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}

function taskDetailRow(task, campaignId) {
  const overdue = isOverdue(task.deadline, task.status);
  const days = daysUntil(task.deadline);
  let deadlineLabel = '';
  let deadlineColor = 'text-surface-500';
  if (task.status === 'completed') {
    deadlineLabel = formatDateShort(task.deadline);
    deadlineColor = 'text-surface-400';
  } else if (overdue) {
    deadlineLabel = Math.abs(days) + 'd overdue';
    deadlineColor = 'text-red-500 font-semibold';
  } else if (days === 0) {
    deadlineLabel = 'Due today';
    deadlineColor = 'text-amber-600 font-semibold';
  } else if (days === 1) {
    deadlineLabel = 'Due tomorrow';
    deadlineColor = 'text-amber-600';
  } else if (days <= 7) {
    deadlineLabel = days + ' days left';
    deadlineColor = 'text-amber-600';
  } else {
    deadlineLabel = formatDateShort(task.deadline);
  }

  return `
    <div class="task-row px-4 py-3.5 transition-colors">
      <div class="flex items-start gap-3">
        <button class="flex-shrink-0 mt-0.5" onclick="cycleTaskStatus('${campaignId}', '${task.id}')" title="Toggle status">
          ${task.status === 'completed' 
            ? `<div class="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"><svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg></div>`
            : task.status === 'in-progress'
            ? `<div class="w-5 h-5 rounded-full border-2 border-amber-400 bg-amber-50 flex items-center justify-center"><div class="w-2 h-2 rounded-full bg-amber-400"></div></div>`
            : `<div class="w-5 h-5 rounded-full border-2 border-surface-300 hover:border-surface-400 transition-colors"></div>`
          }
        </button>
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <p class="text-sm font-medium ${task.status === 'completed' ? 'text-surface-400 line-through' : 'text-surface-800'}">${escapeHtml(task.title)}</p>
            <div class="flex items-center gap-2 flex-shrink-0">
              <button onclick="openModal('editTask', '${campaignId}', '${task.id}')" class="p-1 text-surface-400 hover:text-surface-600 rounded transition-colors" title="Edit task">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
              </button>
              <button onclick="deleteTask('${campaignId}', '${task.id}')" class="p-1 text-surface-400 hover:text-red-500 rounded transition-colors" title="Delete task">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
            <span class="text-[11px] ${deadlineColor}">${deadlineLabel}</span>
            ${task.rewardEstimate ? `<span class="text-[11px] text-surface-500 font-medium">$${task.rewardEstimate} est.</span>` : ''}
            ${task.proofLink ? `<a href="${escapeHtml(task.proofLink)}" target="_blank" rel="noopener" class="inline-flex items-center gap-1 text-[11px] text-brand-500 hover:text-brand-700 font-medium"><svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>Proof</a>` : ''}
          </div>
          ${task.notes ? `<p class="text-[11px] text-surface-400 mt-1.5 leading-relaxed">${escapeHtml(task.notes)}</p>` : ''}
        </div>
      </div>
    </div>
  `;
}

// --- All Tasks Page ---
function renderAllTasks() {
  let tasks = state.campaigns.flatMap(c => c.tasks.map(t => ({ ...t, campaignName: c.name, campaignId: c.id, campaignStatus: c.status })));

  if (state.statusFilter === 'overdue') {
    tasks = tasks.filter(t => isOverdue(t.deadline, t.status));
  } else if (state.statusFilter) {
    tasks = tasks.filter(t => t.status === state.statusFilter);
  }

  if (state.searchQuery) {
    tasks = tasks.filter(t =>
      t.title.toLowerCase().includes(state.searchQuery) ||
      t.campaignName.toLowerCase().includes(state.searchQuery)
    );
  }

  // Sort: overdue first, then by deadline
  tasks.sort((a, b) => {
    const aOverdue = isOverdue(a.deadline, a.status) ? 0 : 1;
    const bOverdue = isOverdue(b.deadline, b.status) ? 0 : 1;
    if (aOverdue !== bOverdue) return aOverdue - bOverdue;
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (a.status !== 'completed' && b.status === 'completed') return -1;
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    return new Date(a.deadline) - new Date(b.deadline);
  });

  const filterLabel = state.statusFilter === 'overdue' ? 'Overdue' : state.statusFilter === 'in-progress' ? 'In Progress' : state.statusFilter === 'completed' ? 'Completed' : 'All';

  return `
    <div class="fade-in space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-2 flex-wrap">
          <button onclick="state.statusFilter = null; render()" class="text-xs font-medium px-2.5 py-1 rounded-lg ${!state.statusFilter ? 'bg-brand-600 text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'} transition-colors">All</button>
          <button onclick="state.statusFilter = 'pending'; render()" class="text-xs font-medium px-2.5 py-1 rounded-lg ${state.statusFilter === 'pending' ? 'bg-surface-700 text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'} transition-colors">Pending</button>
          <button onclick="state.statusFilter = 'in-progress'; render()" class="text-xs font-medium px-2.5 py-1 rounded-lg ${state.statusFilter === 'in-progress' ? 'bg-amber-500 text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'} transition-colors">In Progress</button>
          <button onclick="state.statusFilter = 'completed'; render()" class="text-xs font-medium px-2.5 py-1 rounded-lg ${state.statusFilter === 'completed' ? 'bg-emerald-500 text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'} transition-colors">Completed</button>
          <button onclick="state.statusFilter = 'overdue'; render()" class="text-xs font-medium px-2.5 py-1 rounded-lg ${state.statusFilter === 'overdue' ? 'bg-red-500 text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'} transition-colors">Overdue</button>
        </div>
        <p class="text-xs text-surface-400 font-medium">${tasks.length} task${tasks.length !== 1 ? 's' : ''}</p>
      </div>

      <div class="bg-white rounded-xl border border-surface-200 shadow-sm overflow-hidden">
        ${tasks.length === 0 ? emptyState('No tasks found', 'Try changing the filter or search term.') : `
          <div class="divide-y divide-surface-100">
            ${tasks.map(t => taskRow(t, true)).join('')}
          </div>
        `}
      </div>
    </div>
  `;
}

// --- Rewards Page ---
function renderRewards() {
  const campaignRewards = state.campaigns.map(c => {
    const total = c.tasks.reduce((s, t) => s + (t.rewardEstimate || 0), 0);
    const earned = c.tasks.filter(t => t.status === 'completed').reduce((s, t) => s + (t.rewardEstimate || 0), 0);
    const pending = total - earned;
    return { ...c, totalReward: total, earnedReward: earned, pendingReward: pending };
  });

  const totalEarned = campaignRewards.reduce((s, c) => s + c.earnedReward, 0);
  const totalPending = campaignRewards.reduce((s, c) => s + c.pendingReward, 0);
  const totalPool = campaignRewards.reduce((s, c) => s + c.totalReward, 0);

  // Group by token
  const tokenMap = {};
  campaignRewards.forEach(c => {
    const token = c.rewardToken || 'USD';
    if (!tokenMap[token]) tokenMap[token] = { earned: 0, pending: 0, total: 0 };
    tokenMap[token].earned += c.earnedReward;
    tokenMap[token].pending += c.pendingReward;
    tokenMap[token].total += c.totalReward;
  });

  return `
    <div class="fade-in space-y-6">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-white rounded-xl border border-surface-200 shadow-sm p-5">
          <p class="text-[11px] font-semibold text-surface-400 uppercase tracking-wider">Total Earned</p>
          <p class="text-2xl font-bold text-emerald-600 mt-1">$${totalEarned.toLocaleString()}</p>
          <p class="text-xs text-surface-400 mt-1">From completed tasks</p>
        </div>
        <div class="bg-white rounded-xl border border-surface-200 shadow-sm p-5">
          <p class="text-[11px] font-semibold text-surface-400 uppercase tracking-wider">Pending</p>
          <p class="text-2xl font-bold text-amber-600 mt-1">$${totalPending.toLocaleString()}</p>
          <p class="text-xs text-surface-400 mt-1">From remaining tasks</p>
        </div>
        <div class="bg-white rounded-xl border border-surface-200 shadow-sm p-5">
          <p class="text-[11px] font-semibold text-surface-400 uppercase tracking-wider">Total Pool</p>
          <p class="text-2xl font-bold text-surface-800 mt-1">$${totalPool.toLocaleString()}</p>
          <p class="text-xs text-surface-400 mt-1">Across all campaigns</p>
        </div>
      </div>

      <!-- By Token -->
      <div>
        <h2 class="text-sm font-semibold text-surface-800 mb-3">Rewards by Token</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          ${Object.entries(tokenMap).map(([token, data]) => `
            <div class="bg-white rounded-xl border border-surface-200 shadow-sm p-4">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-7 h-7 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-[10px] font-bold">${escapeHtml(token.slice(0, 3))}</div>
                <span class="text-sm font-semibold text-surface-800">${escapeHtml(token)}</span>
              </div>
              <div class="space-y-1 text-[11px]">
                <div class="flex justify-between"><span class="text-surface-400">Earned</span><span class="font-medium text-emerald-600">$${data.earned.toLocaleString()}</span></div>
                <div class="flex justify-between"><span class="text-surface-400">Pending</span><span class="font-medium text-amber-600">$${data.pending.toLocaleString()}</span></div>
                <div class="flex justify-between"><span class="text-surface-400">Total</span><span class="font-medium text-surface-700">$${data.total.toLocaleString()}</span></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Campaign Breakdown -->
      <div>
        <h2 class="text-sm font-semibold text-surface-800 mb-3">Campaign Breakdown</h2>
        <div class="bg-white rounded-xl border border-surface-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-surface-100">
                  <th class="text-left px-4 py-3 text-[11px] font-semibold text-surface-400 uppercase tracking-wider">Campaign</th>
                  <th class="text-left px-4 py-3 text-[11px] font-semibold text-surface-400 uppercase tracking-wider">Token</th>
                  <th class="text-right px-4 py-3 text-[11px] font-semibold text-surface-400 uppercase tracking-wider">Earned</th>
                  <th class="text-right px-4 py-3 text-[11px] font-semibold text-surface-400 uppercase tracking-wider">Pending</th>
                  <th class="text-right px-4 py-3 text-[11px] font-semibold text-surface-400 uppercase tracking-wider">Total</th>
                  <th class="text-right px-4 py-3 text-[11px] font-semibold text-surface-400 uppercase tracking-wider">Progress</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-surface-100">
                ${campaignRewards.map(c => {
                  const pct = c.totalReward > 0 ? Math.round((c.earnedReward / c.totalReward) * 100) : 0;
                  return `
                    <tr class="hover:bg-surface-50 cursor-pointer transition-colors" onclick="viewCampaign('${c.id}')">
                      <td class="px-4 py-3">
                        <p class="font-medium text-surface-800">${escapeHtml(c.name)}</p>
                        <p class="text-[11px] text-surface-400">${escapeHtml(c.protocol)}</p>
                      </td>
                      <td class="px-4 py-3 text-surface-600">${escapeHtml(c.rewardToken || 'USD')}</td>
                      <td class="px-4 py-3 text-right font-medium text-emerald-600">$${c.earnedReward.toLocaleString()}</td>
                      <td class="px-4 py-3 text-right font-medium text-amber-600">$${c.pendingReward.toLocaleString()}</td>
                      <td class="px-4 py-3 text-right font-medium text-surface-700">$${c.totalReward.toLocaleString()}</td>
                      <td class="px-4 py-3 text-right">
                        <div class="flex items-center justify-end gap-2">
                          <div class="w-16 h-1.5 bg-surface-100 rounded-full overflow-hidden">
                            <div class="progress-bar h-full rounded-full ${pct === 100 ? 'bg-emerald-500' : 'bg-brand-500'}" style="width: ${pct}%"></div>
                          </div>
                          <span class="text-[11px] font-medium text-surface-500 w-8 text-right">${pct}%</span>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}

// --- Helpers ---
function getStatusBadge(status) {
  const map = {
    'active': { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Active' },
    'completed': { bg: 'bg-surface-100', text: 'text-surface-600', dot: 'bg-surface-400', label: 'Completed' },
    'paused': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Paused' },
    'pending': { bg: 'bg-surface-100', text: 'text-surface-500', dot: 'bg-surface-400', label: 'Pending' },
    'in-progress': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', label: 'In Progress' },
  };
  const s = map[status] || map['pending'];
  return `<span class="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.bg} ${s.text}"><span class="w-1.5 h-1.5 rounded-full ${s.dot}"></span>${s.label}</span>`;
}

function emptyState(title, subtitle) {
  return `
    <div class="flex flex-col items-center justify-center py-12 px-4">
      <div class="w-12 h-12 bg-surface-100 rounded-xl flex items-center justify-center mb-3">
        <svg class="w-6 h-6 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
      </div>
      <p class="text-sm font-medium text-surface-700">${title}</p>
      <p class="text-xs text-surface-400 mt-1">${subtitle}</p>
    </div>
  `;
}

// --- Task Status Cycling ---
function cycleTaskStatus(campaignId, taskId) {
  const campaign = state.campaigns.find(c => c.id === campaignId);
  if (!campaign) {
    // Try finding task across all campaigns
    for (const c of state.campaigns) {
      const t = c.tasks.find(t => t.id === taskId);
      if (t) {
        const order = ['pending', 'in-progress', 'completed'];
        const idx = order.indexOf(t.status);
        t.status = order[(idx + 1) % order.length];
        saveState();
        render();
        return;
      }
    }
    return;
  }
  const task = campaign.tasks.find(t => t.id === taskId);
  if (!task) return;
  const order = ['pending', 'in-progress', 'completed'];
  const idx = order.indexOf(task.status);
  task.status = order[(idx + 1) % order.length];
  saveState();
  render();
}

// --- Modal System ---
function openModal(type, campaignId, taskId) {
  const overlay = document.getElementById('modalOverlay');
  const content = document.getElementById('modalContent');
  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  if (type === 'campaign') {
    content.innerHTML = renderCampaignForm();
  } else if (type === 'editCampaign') {
    const c = state.campaigns.find(c => c.id === campaignId);
    content.innerHTML = renderCampaignForm(c);
  } else if (type === 'task') {
    content.innerHTML = renderTaskForm(campaignId);
  } else if (type === 'editTask') {
    const c = state.campaigns.find(c => c.id === campaignId);
    const t = c ? c.tasks.find(t => t.id === taskId) : null;
    content.innerHTML = renderTaskForm(campaignId, t);
  }
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.add('hidden');
  document.body.style.overflow = '';
}

function renderCampaignForm(existing) {
  const isEdit = !!existing;
  return `
    <div class="p-6">
      <div class="flex items-center justify-between mb-5">
        <h3 class="text-base font-bold text-surface-900">${isEdit ? 'Edit Campaign' : 'New Campaign'}</h3>
        <button onclick="closeModal()" class="p-1 text-surface-400 hover:text-surface-600 rounded-lg transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <form onsubmit="saveCampaign(event, '${isEdit ? existing.id : ''}')" class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-surface-600 mb-1">Campaign Name *</label>
          <input id="f_name" type="text" required value="${isEdit ? escapeHtml(existing.name) : ''}" class="w-full px-3 py-2 text-sm border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition-all" placeholder="e.g. Aave Governance Push">
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-surface-600 mb-1">Protocol *</label>
            <input id="f_protocol" type="text" required value="${isEdit ? escapeHtml(existing.protocol) : ''}" class="w-full px-3 py-2 text-sm border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition-all" placeholder="e.g. Aave">
          </div>
          <div>
            <label class="block text-xs font-medium text-surface-600 mb-1">Chain *</label>
            <input id="f_chain" type="text" required value="${isEdit ? escapeHtml(existing.chain) : ''}" class="w-full px-3 py-2 text-sm border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition-all" placeholder="e.g. Ethereum">
          </div>
        </div>
        <div>
          <label class="block text-xs font-medium text-surface-600 mb-1">Description</label>
          <textarea id="f_description" rows="2" class="w-full px-3 py-2 text-sm border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition-all resize-none" placeholder="Brief campaign description...">${isEdit ? escapeHtml(existing.description || '') : ''}</textarea>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-surface-600 mb-1">Start Date</label>
            <input id="f_startDate" type="date" value="${isEdit ? existing.startDate : new Date().toISOString().split('T')[0]}" class="w-full px-3 py-2 text-sm border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition-all">
          </div>
          <div>
            <label class="block text-xs font-medium text-surface-600 mb-1">End Date</label>
            <input id="f_endDate" type="date" value="${isEdit ? existing.endDate : ''}" class="w-full px-3 py-2 text-sm border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition-all">
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-surface-600 mb-1">Reward Token</label>
            <input id="f_rewardToken" type="text" value="${isEdit ? escapeHtml(existing.rewardToken || '') : ''}" class="w-full px-3 py-2 text-sm border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition-all" placeholder="e.g. USDC, ARB, OP">
          </div>
          <div>
            <label class="block text-xs font-medium text-surface-600 mb-1">Status</label>
            <select id="f_status" class="w-full px-3 py-2 text-sm border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition-all bg-white">
              <option value="active" ${isEdit && existing.status === 'active' ? 'selected' : ''}>Active</option>
              <option value="paused" ${isEdit && existing.status === 'paused' ? 'selected' : ''}>Paused</option>
              <option value="completed" ${isEdit && existing.status === 'completed' ? 'selected' : ''}>Completed</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block text-xs font-medium text-surface-600 mb-1">Tags <span class="text-surface-400 font-normal">(comma separated)</span></label>
          <input id="f_tags" type="text" value="${isEdit ? (existing.tags || []).join(', ') : ''}" class="w-full px-3 py-2 text-sm border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition-all" placeholder="e.g. DeFi, Governance, L2">
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" onclick="closeModal()" class="px-4 py-2 text-sm font-medium text-surface-600 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors">Cancel</button>
          <button type="submit" class="btn-primary px-4 py-2 text-sm font-medium bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">${isEdit ? 'Save Changes' : 'Create Campaign'}</button>
        </div>
      </form>
    </div>
  `;
}

function renderTaskForm(campaignId, existing) {
  const isEdit = !!existing;
  return `
    <div class="p-6">
      <div class="flex items-center justify-between mb-5">
        <h3 class="text-base font-bold text-surface-900">${isEdit ? 'Edit Task' : 'New Task'}</h3>
        <button onclick="closeModal()" class="p-1 text-surface-400 hover:text-surface-600 rounded-lg transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <form onsubmit="saveTask(event, '${campaignId}', '${isEdit ? existing.id : ''}')" class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-surface-600 mb-1">Task Title *</label>
          <input id="ft_title" type="text" required value="${isEdit ? escapeHtml(existing.title) : ''}" class="w-full px-3 py-2 text-sm border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition-all" placeholder="e.g. Write Twitter thread on governance">
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-surface-600 mb-1">Deadline</label>
            <input id="ft_deadline" type="date" value="${isEdit ? existing.deadline || '' : ''}" class="w-full px-3 py-2 text-sm border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition-all">
          </div>
          <div>
            <label class="block text-xs font-medium text-surface-600 mb-1">Status</label>
            <select id="ft_status" class="w-full px-3 py-2 text-sm border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition-all bg-white">
              <option value="pending" ${isEdit && existing.status === 'pending' ? 'selected' : ''}>Pending</option>
              <option value="in-progress" ${isEdit && existing.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
              <option value="completed" ${isEdit && existing.status === 'completed' ? 'selected' : ''}>Completed</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-surface-600 mb-1">Reward Estimate ($)</label>
            <input id="ft_reward" type="number" min="0" step="1" value="${isEdit ? existing.rewardEstimate || '' : ''}" class="w-full px-3 py-2 text-sm border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition-all" placeholder="e.g. 500">
          </div>
          <div>
            <label class="block text-xs font-medium text-surface-600 mb-1">Proof Link</label>
            <input id="ft_proof" type="url" value="${isEdit ? escapeHtml(existing.proofLink || '') : ''}" class="w-full px-3 py-2 text-sm border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition-all" placeholder="https://...">
          </div>
        </div>
        <div>
          <label class="block text-xs font-medium text-surface-600 mb-1">Notes</label>
          <textarea id="ft_notes" rows="2" class="w-full px-3 py-2 text-sm border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition-all resize-none" placeholder="Any additional details...">${isEdit ? escapeHtml(existing.notes || '') : ''}</textarea>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" onclick="closeModal()" class="px-4 py-2 text-sm font-medium text-surface-600 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors">Cancel</button>
          <button type="submit" class="btn-primary px-4 py-2 text-sm font-medium bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">${isEdit ? 'Save Changes' : 'Add Task'}</button>
        </div>
      </form>
    </div>
  `;
}

// --- CRUD Operations ---
function saveCampaign(event, existingId) {
  event.preventDefault();
  const name = document.getElementById('f_name').value.trim();
  const protocol = document.getElementById('f_protocol').value.trim();
  const chain = document.getElementById('f_chain').value.trim();
  const description = document.getElementById('f_description').value.trim();
  const startDate = document.getElementById('f_startDate').value;
  const endDate = document.getElementById('f_endDate').value;
  const rewardToken = document.getElementById('f_rewardToken').value.trim();
  const status = document.getElementById('f_status').value;
  const tagsRaw = document.getElementById('f_tags').value.trim();
  const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];

  if (existingId) {
    const c = state.campaigns.find(c => c.id === existingId);
    if (c) {
      c.name = name;
      c.protocol = protocol;
      c.chain = chain;
      c.description = description;
      c.startDate = startDate;
      c.endDate = endDate;
      c.rewardToken = rewardToken;
      c.status = status;
      c.tags = tags;
    }
  } else {
    state.campaigns.push({
      id: genId(),
      name,
      protocol,
      chain,
      status,
      startDate,
      endDate,
      rewardPool: 0,
      rewardToken,
      description,
      tags,
      tasks: [],
    });
  }

  saveState();
  closeModal();
  render();
}

function deleteCampaign(id) {
  if (!confirm('Delete this campaign and all its tasks? This cannot be undone.')) return;
  state.campaigns = state.campaigns.filter(c => c.id !== id);
  saveState();
  navigateTo('campaigns');
}

function saveTask(event, campaignId, existingTaskId) {
  event.preventDefault();
  const title = document.getElementById('ft_title').value.trim();
  const deadline = document.getElementById('ft_deadline').value;
  const status = document.getElementById('ft_status').value;
  const rewardEstimate = parseInt(document.getElementById('ft_reward').value) || 0;
  const proofLink = document.getElementById('ft_proof').value.trim();
  const notes = document.getElementById('ft_notes').value.trim();

  const campaign = state.campaigns.find(c => c.id === campaignId);
  if (!campaign) return;

  if (existingTaskId) {
    const t = campaign.tasks.find(t => t.id === existingTaskId);
    if (t) {
      t.title = title;
      t.deadline = deadline;
      t.status = status;
      t.rewardEstimate = rewardEstimate;
      t.proofLink = proofLink;
      t.notes = notes;
    }
  } else {
    campaign.tasks.push({
      id: genId(),
      title,
      status,
      deadline,
      proofLink,
      rewardEstimate,
      notes,
    });
  }

  saveState();
  closeModal();
  render();
}

function deleteTask(campaignId, taskId) {
  if (!confirm('Delete this task?')) return;
  const campaign = state.campaigns.find(c => c.id === campaignId);
  if (!campaign) return;
  campaign.tasks = campaign.tasks.filter(t => t.id !== taskId);
  saveState();
  render();
}

// --- Keyboard Shortcuts ---
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});

// --- Init ---
loadState();
render();