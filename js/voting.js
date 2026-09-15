/**
 * Voting System for "Philosopher of the Year 2025"
 * 
 * Anti-fraud protection:
 * 1. Server-side IP + fingerprint tracking
 * 2. Browser fingerprint (canvas, screen, timezone, language, fonts)
 * 3. localStorage backup
 * 4. Time-based restrictions (voting ends on specified date)
 * 5. Vote hash verification
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    apiUrl: '/api/vote.php',
    resultsUrl: '/api/results.php',
    votingEndDate: new Date('2026-01-11T23:59:59+03:00'),
    storageKey: 'philosopher_vote_2025',
    fingerprintKey: 'philosopher_fp_2025',
    candidates: [
      { id: 'mazin', name: 'Виктор Мазин', role: 'Психоаналитик, основатель Музея сновидений Фрейда' },
      { id: 'mitrofanova', name: 'Алла Митрофанова', role: 'Философ, куратор, ведущая «Философского кафе»' },
      { id: 'pogrebnyak', name: 'Александр Погребняк', role: 'Автор курса «Архитекторы смысла»' },
      { id: 'radeev', name: 'Артём Радеев', role: 'Организатор философских событий Петербурга' },
      { id: 'sekatskiy', name: 'Александр Секацкий', role: 'Философ и медийный спикер' }
    ]
  };

  /**
   * Generate browser fingerprint using multiple signals
   */
  async function generateFingerprint() {
    const components = [];

    try {
      // Screen info
      components.push(screen.width + 'x' + screen.height);
      components.push(screen.colorDepth);
      components.push(screen.pixelDepth);

      // Timezone
      components.push(Intl.DateTimeFormat().resolvedOptions().timeZone);
      components.push(new Date().getTimezoneOffset());

      // Language
      components.push(navigator.language);
      components.push(navigator.languages ? navigator.languages.join(',') : '');

      // Platform
      components.push(navigator.platform);
      components.push(navigator.hardwareConcurrency || 'unknown');

      // Canvas fingerprint
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 200;
        canvas.height = 50;
        
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText('Philosopher2025', 2, 15);
        ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
        ctx.fillText('VoteSystem', 4, 17);
        
        components.push(canvas.toDataURL());
      } catch (e) {
        components.push('canvas-error');
      }

      // WebGL info
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          if (debugInfo) {
            components.push(gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL));
            components.push(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
          }
        }
      } catch (e) {
        components.push('webgl-error');
      }

      // Audio fingerprint (simplified)
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        components.push(audioContext.sampleRate);
        audioContext.close();
      } catch (e) {
        components.push('audio-error');
      }

      // Create hash from all components
      const data = components.join('|||');
      return await hashString(data);
    } catch (e) {
      // Fallback fingerprint
      return 'fallback-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
  }

  /**
   * Create SHA-256 hash of a string
   */
  async function hashString(str) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(str);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      // Fallback for older browsers or insecure contexts
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return 'simple-' + Math.abs(hash).toString(16);
    }
  }

  /**
   * Check if voting period is still active
   */
  function isVotingOpen() {
    return new Date() < CONFIG.votingEndDate;
  }

  /**
   * Get remaining time until voting ends
   */
  function getTimeRemaining() {
    const now = new Date();
    const diff = CONFIG.votingEndDate - now;
    
    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { days, hours, minutes };
  }

  /**
   * Format time remaining as string
   */
  function formatTimeRemaining(time) {
    if (!time) return 'Голосование завершено';
    
    const parts = [];
    if (time.days > 0) {
      const dayWord = time.days === 1 ? 'день' : (time.days < 5 ? 'дня' : 'дней');
      parts.push(`${time.days} ${dayWord}`);
    }
    if (time.hours > 0) {
      const hourWord = time.hours === 1 ? 'час' : (time.hours < 5 ? 'часа' : 'часов');
      parts.push(`${time.hours} ${hourWord}`);
    }
    if (time.minutes > 0 && time.days === 0) {
      const minWord = time.minutes === 1 ? 'минута' : (time.minutes < 5 ? 'минуты' : 'минут');
      parts.push(`${time.minutes} ${minWord}`);
    }
    
    return parts.length > 0 ? parts.join(' ') : 'Менее минуты';
  }

  /**
   * Get stored vote from localStorage (backup)
   */
  function getStoredVote() {
    try {
      const data = localStorage.getItem(CONFIG.storageKey);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Store vote locally (backup)
   */
  function storeVoteLocally(candidateId) {
    try {
      localStorage.setItem(CONFIG.storageKey, JSON.stringify({
        candidateId: candidateId,
        timestamp: new Date().toISOString()
      }));
    } catch (e) {
      console.warn('Could not store vote locally:', e);
    }
  }

  /**
   * Check voting status from server (non-blocking)
   */
  async function checkServerStatus(fingerprint) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`${CONFIG.apiUrl}?fingerprint=${encodeURIComponent(fingerprint)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('Could not check server status:', e);
    }
    return null;
  }

  /**
   * Submit vote to server
   */
  async function submitVoteToServer(candidateId, fingerprint) {
    try {
      const response = await fetch(CONFIG.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          candidateId: candidateId,
          fingerprint: fingerprint
        })
      });
      
      const result = await response.json();
      return result;
    } catch (e) {
      console.error('Failed to submit vote:', e);
      return {
        success: false,
        error: 'network_error',
        message: 'Ошибка сети. Попробуйте позже.'
      };
    }
  }

  /**
   * Create voting widget HTML
   */
  function createVotingWidget(containerId, compact = false) {
    const container = document.getElementById(containerId);
    if (!container) return null;

    const wrapper = document.createElement('div');
    wrapper.className = 'voting-widget' + (compact ? ' voting-widget--compact' : '');
    wrapper.innerHTML = `
      <div class="voting-widget__header">
        <h3 class="voting-widget__title">🗳️ Голосование за «Философа года — 2025»</h3>
        <div class="voting-widget__timer">
          <span class="voting-widget__timer-icon">⏱️</span>
          <span class="voting-widget__timer-text">Загрузка...</span>
        </div>
      </div>
      <div class="voting-widget__status"></div>
      <div class="voting-widget__candidates"></div>
      <div class="voting-widget__footer">
        <p class="voting-widget__note">
          <span class="voting-widget__lock">🔒</span>
          Голосовать можно один раз. Голос сохраняется на сервере.
        </p>
        <a href="voting-results.html" class="voting-widget__results-link">📊 Смотреть результаты</a>
      </div>
    `;

    container.appendChild(wrapper);
    return wrapper;
  }

  /**
   * Render candidates list
   */
  function renderCandidates(widget, votedFor = null, votingOpen = true) {
    const container = widget.querySelector('.voting-widget__candidates');
    if (!container) return;

    container.innerHTML = '';

    CONFIG.candidates.forEach(candidate => {
      const isVoted = votedFor === candidate.id;
      const button = document.createElement('button');
      button.className = 'voting-candidate' + (isVoted ? ' voting-candidate--voted' : '');
      button.disabled = !votingOpen || votedFor !== null;
      button.dataset.candidateId = candidate.id;
      
      button.innerHTML = `
        <span class="voting-candidate__check">${isVoted ? '✓' : ''}</span>
        <span class="voting-candidate__info">
          <span class="voting-candidate__name">${candidate.name}</span>
          <span class="voting-candidate__role">${candidate.role}</span>
        </span>
        <span class="voting-candidate__action">${isVoted ? 'Ваш голос' : (votingOpen && !votedFor ? 'Голосовать' : '')}</span>
      `;
      
      container.appendChild(button);
    });
  }

  /**
   * Update status message
   */
  function updateStatus(widget, message, type = 'info') {
    const status = widget.querySelector('.voting-widget__status');
    if (!status) return;
    
    status.innerHTML = message ? `<div class="voting-status voting-status--${type}">${message}</div>` : '';
  }

  /**
   * Update timer display
   */
  function updateTimer(widget) {
    const timerText = widget.querySelector('.voting-widget__timer-text');
    if (!timerText) return;

    const time = getTimeRemaining();
    if (time) {
      timerText.textContent = 'Осталось: ' + formatTimeRemaining(time);
    } else {
      timerText.textContent = 'Голосование завершено';
      widget.classList.add('voting-widget--closed');
    }
  }

  /**
   * Handle vote submission
   */
  async function submitVote(candidateId, widget, fingerprint) {
    // Double-check voting is still open
    if (!isVotingOpen()) {
      updateStatus(widget, 'Голосование завершено', 'error');
      return false;
    }

    // Submit to server
    const result = await submitVoteToServer(candidateId, fingerprint);
    
    if (result.success) {
      // Store locally as backup
      storeVoteLocally(candidateId);
      
      const candidate = CONFIG.candidates.find(c => c.id === candidateId);
      updateStatus(widget, `✓ Спасибо! Вы проголосовали за: ${candidate ? candidate.name : candidateId}`, 'success');
      renderCandidates(widget, candidateId, true);
      return true;
    } else if (result.error === 'already_voted') {
      // Already voted - show their choice
      updateStatus(widget, 'Вы уже проголосовали', 'warning');
      if (result.votedFor) {
        storeVoteLocally(result.votedFor);
        renderCandidates(widget, result.votedFor, true);
      }
      return false;
    } else {
      updateStatus(widget, result.message || 'Ошибка голосования', 'error');
      return false;
    }
  }

  /**
   * Initialize voting widget
   */
  async function initVoting(containerId, compact = false) {
    const widget = createVotingWidget(containerId, compact);
    if (!widget) return;

    // Check voting status FIRST (before async operations)
    const votingOpen = isVotingOpen();
    
    // Get local vote immediately
    const localVote = getStoredVote();
    let votedFor = localVote ? localVote.candidateId : null;

    // Update timer immediately
    updateTimer(widget);
    
    // Render candidates immediately with local data
    renderCandidates(widget, votedFor, votingOpen);

    // Show status based on local data
    if (!votingOpen) {
      updateStatus(widget, 'Голосование завершено. Победитель будет объявлен 12 января.', 'info');
    } else if (votedFor) {
      const candidate = CONFIG.candidates.find(c => c.id === votedFor);
      updateStatus(widget, `✓ Вы проголосовали за: ${candidate ? candidate.name : votedFor}`, 'success');
    }

    // Set up timer update interval
    const timerInterval = setInterval(() => {
      updateTimer(widget);
      if (!isVotingOpen()) {
        clearInterval(timerInterval);
        renderCandidates(widget, votedFor, false);
      }
    }, 60000);

    // Generate fingerprint asynchronously
    const fingerprint = await generateFingerprint();

    // Check server status in background (non-blocking)
    checkServerStatus(fingerprint).then(serverStatus => {
      if (serverStatus && serverStatus.hasVoted && serverStatus.votedFor) {
        // Server says we voted - update UI if different from local
        if (votedFor !== serverStatus.votedFor) {
          votedFor = serverStatus.votedFor;
          storeVoteLocally(votedFor);
          renderCandidates(widget, votedFor, votingOpen);
          const candidate = CONFIG.candidates.find(c => c.id === votedFor);
          updateStatus(widget, `✓ Вы проголосовали за: ${candidate ? candidate.name : votedFor}`, 'success');
        }
      }
    });

    // Add click handlers
    widget.addEventListener('click', async (e) => {
      const button = e.target.closest('.voting-candidate');
      if (!button || button.disabled) return;

      const candidateId = button.dataset.candidateId;
      if (!candidateId) return;

      // Disable all buttons during submission
      const buttons = widget.querySelectorAll('.voting-candidate');
      buttons.forEach(btn => btn.disabled = true);

      // Add loading state
      button.classList.add('voting-candidate--loading');
      updateStatus(widget, 'Отправка голоса...', 'info');
      
      // Submit vote
      const success = await submitVote(candidateId, widget, fingerprint);
      
      if (success) {
        votedFor = candidateId;
      } else {
        // Re-enable buttons if vote failed (and not already voted)
        if (!votedFor) {
          buttons.forEach(btn => btn.disabled = false);
        }
      }

      // Remove loading state
      button.classList.remove('voting-candidate--loading');
    });
  }

  // Export to global scope
  window.PhilosopherVoting = {
    init: initVoting,
    isOpen: isVotingOpen,
    getTimeRemaining: getTimeRemaining
  };

  // Auto-initialize if elements exist on page
  document.addEventListener('DOMContentLoaded', () => {
    const fullWidget = document.getElementById('voting-widget-full');
    const compactWidget = document.getElementById('voting-widget-compact');

    if (fullWidget) {
      initVoting('voting-widget-full', false);
    }
    if (compactWidget) {
      initVoting('voting-widget-compact', true);
    }
  });

})();
