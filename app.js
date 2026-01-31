(function () {
  const root = document.documentElement;
  const body = document.body;
  const toggle = document.getElementById('themeToggle');
  const toastEl = document.getElementById('toast');
  const githubUrlInput = document.getElementById('githubUrl');
  const modeSelect = document.getElementById('mode');
  const branchNameInput = document.getElementById('branchName');
  const convertBtn = document.getElementById('convertBtn');
  const clearBtn = document.getElementById('clearBtn');
  const resultContainer = document.getElementById('result');

  // Initialize Theme
  const savedTheme = localStorage.getItem('btg-theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    body.classList.add('dark');
  }

  function updateThemeAria() {
    const isDark = body.classList.contains('dark');
    toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
  }
  updateThemeAria();

  toggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    const isDark = body.classList.contains('dark');
    localStorage.setItem('btg-theme', isDark ? 'dark' : 'light');
    updateThemeAria();
  });

  toggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle.click();
    }
  });

  // Toast Helper
  let toastTimeout;
  function showToast(msg) {
    clearTimeout(toastTimeout);
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    toastTimeout = setTimeout(() => toastEl.classList.remove('show'), 2500);
  }

  // URL Logic
  function sanitizeUrl(url) {
    return (url || '').trim().split('#')[0];
  }

  function buildRawUrl(url, useCommit, branch) {
    try {
      if (!url.includes('github.com') || !url.includes('/blob/')) return null;
      const after = url.split('github.com/')[1];
      if (!after) return null;
      
      const parts = after.split('/').filter(Boolean);
      // Expected: owner, repo, blob, ref, path...
      if (parts.length < 5 || parts[2] !== 'blob') return null;
      
      const user = parts[0];
      const repo = parts[1];
      const ref = parts[3];
      const path = parts.slice(4).join('/');
      
      if (!user || !repo || !path) return null;
      
      const finalRef = useCommit ? ref : (branch || 'main');
      return `https://raw.githubusercontent.com/${encodeURIComponent(user)}/${encodeURIComponent(repo)}/${encodeURIComponent(finalRef)}/${encodeURI(path)}`;
    } catch (e) {
      return null;
    }
  }

  function renderResult(rawUrl) {
    if (!rawUrl) {
      resultContainer.style.display = 'block';
      resultContainer.innerHTML = `
        <div class="small" style="color:#ef4444; font-weight:600; display:flex; align-items:center; gap:8px;">
          <span>❌</span> Please enter a valid GitHub blob URL.
        </div>
      `;
      return;
    }

    resultContainer.style.display = 'block';
    const refType = modeSelect.value === 'commit' ? 'commit' : 'branch';
    
    resultContainer.innerHTML = `
      <div class="output-header">
        <div class="output-title">Raw URL</div>
        <div class="output-info">Points to: <span>${refType}</span></div>
      </div>
      <input id="rawLink" class="raw-input" value="${rawUrl}" readonly aria-label="Raw URL">
      <div class="output-actions">
        <button id="copyBtn" class="btn copy">📋 Copy</button>
        <a id="openBtn" class="btn secondary" href="${rawUrl}" target="_blank" rel="noopener noreferrer">Open</a>
        <button id="shareBtn" class="btn secondary">Share</button>
      </div>
    `;

    const copyBtn = document.getElementById('copyBtn');
    const rawLink = document.getElementById('rawLink');
    const shareBtn = document.getElementById('shareBtn');

    copyBtn.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(rawLink.value);
        } else {
          rawLink.select();
          document.execCommand('copy');
        }
        showToast('✅ Copied to clipboard');
      } catch (e) {
        showToast('❌ Copy failed');
      }
    });

    shareBtn.addEventListener('click', async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Raw GitHub URL',
            text: rawLink.value,
            url: rawLink.value
          });
        } catch (e) {
          // Ignored
        }
      } else {
        try {
          await navigator.clipboard.writeText(rawLink.value);
          showToast('✅ Link copied (Share not supported)');
        } catch (e) {
          showToast('❌ Share failed');
        }
      }
    });
    
    // Auto-focus the raw link input for easy copying
    rawLink.focus();
    rawLink.select();
  }

  // Event Listeners
  convertBtn.addEventListener('click', () => {
    const url = sanitizeUrl(githubUrlInput.value);
    const useCommit = modeSelect.value === 'commit';
    const branch = branchNameInput.value || 'main';
    const raw = buildRawUrl(url, useCommit, branch);
    renderResult(raw);
  });

  githubUrlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      convertBtn.click();
    }
  });

  clearBtn.addEventListener('click', () => {
    githubUrlInput.value = '';
    resultContainer.style.display = 'none';
    githubUrlInput.focus();
  });
})();
