document.addEventListener('DOMContentLoaded', function() {
  // Global state
  const state = {
    predictions: [],
    dataset: [],
    metrics: null,
    notifications: [],
    currentPage: 1,
    currentDatasetPage: 1,
    itemsPerPage: 10,
    datasetPerPage: 5,
    fraudChart: null
  };

  // Initialize the page
  init();

  async function init() {
    try {
      // Load all data in parallel
      await Promise.all([
        loadPredictions(),
        loadMetrics(),
        loadNotifications(),
        loadDataset()
      ]);

      // Initialize chart after data is loaded
      initChart();
    } catch (error) {
      console.error('Initialization error:', error);
      showError('Failed to load page data');
    }
  }

  // Data loading functions
  async function loadPredictions() {
    showLoading('#predictionsBody');
    try {
      const response = await fetch('/api/audit/predictions');
      if (!response.ok) throw new Error('Failed to load predictions');

      state.predictions = await response.json();
      renderPredictions();
    } catch (error) {
      showError('#predictionsBody', error.message);
    }
  }

  async function loadMetrics() {
    showLoading('.training-metrics');
    try {
      const response = await fetch('/api/audit/metrics');
      if (!response.ok) throw new Error('Failed to load metrics');

      state.metrics = await response.json();
      renderMetrics();
    } catch (error) {
      showError('.training-metrics', error.message);
    }
  }

  async function loadNotifications() {
    showLoading('#systemNotifications');
    try {
      const response = await fetch('/api/audit/notifications');
      if (!response.ok) throw new Error('Failed to load notifications');

      state.notifications = await response.json();
      renderNotifications();
    } catch (error) {
      showError('#systemNotifications', error.message);
    }
  }

  async function loadDataset() {
    showLoading('#datasetBody');
    try {
      const response = await fetch('/api/audit/dataset');
      if (!response.ok) throw new Error('Failed to load dataset');

      state.dataset = await response.json();
      renderDataset();
    } catch (error) {
      showError('#datasetBody', error.message);
    }
  }

  // Rendering functions
  function renderPredictions() {
    const container = document.getElementById('predictionsBody');
    if (!container) return;

    if (state.predictions.length === 0) {
      container.innerHTML =
        '<tr><td colspan="7">No predictions found</td></tr>';
      return;
    }

    const startIdx = (state.currentPage - 1) * state.itemsPerPage;
    const paginated = state.predictions.slice(
      startIdx,
      startIdx + state.itemsPerPage
    );

    container.innerHTML = paginated
      .map(
        pred => `
      <tr>
        <td>${pred.user?.email || 'Unknown'}</td>
        <td>${pred.transactionId}</td>
        <td>${pred.fraudProbability}%</td>
        <td>${pred.defaultRisk}%</td>
        <td>${new Date(pred.timestamp).toLocaleString()}</td>
        <td>${pred.actualOutcome || 'Pending'}</td>
        <td>
          ${
            pred.feedback !== undefined
              ? `
            <span class="feedback-${pred.feedback ? 'correct' : 'incorrect'}">
              <i class="fa-solid fa-${pred.feedback ? 'check' : 'times'}"></i>
            </span>
          `
              : 'No feedback'
          }
        </td>
      </tr>
    `
      )
      .join('');

    // Update pagination
    updatePagination(
      state.predictions.length,
      state.itemsPerPage,
      'predictions'
    );
  }

  function renderMetrics() {
    if (!state.metrics) return;

    document.getElementById('lastTrainingDate').textContent = new Date(
      state.metrics.lastTrainingDate
    ).toLocaleString();
    document.getElementById(
      'trainingRecords'
    ).textContent = state.metrics.trainingRecords.toLocaleString();
    document.getElementById('modelAccuracy').textContent = `${(
      state.metrics.accuracy * 100
    ).toFixed(1)}%`;
    document.getElementById(
      'modelF1Score'
    ).textContent = state.metrics.f1Score.toFixed(3);

    document.getElementById('truePositive').textContent =
      state.metrics.truePositive;
    document.getElementById('falsePositive').textContent =
      state.metrics.falsePositive;
    document.getElementById('falseNegative').textContent =
      state.metrics.falseNegative;
    document.getElementById('trueNegative').textContent =
      state.metrics.trueNegative;
  }

  function renderNotifications() {
    const container = document.getElementById('systemNotifications');
    if (!container) return;

    if (state.notifications.length === 0) {
      container.innerHTML = `
        <div class="notification info">
          <i class="fa-solid fa-info-circle"></i>
          <div class="notification-content">
            <p class="notification-text">No new notifications</p>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = state.notifications
      .map(
        notif => `
      <div class="notification ${notif.type}">
        <i class="fa-solid ${getNotificationIcon(notif.type)}"></i>
        <div class="notification-content">
          <p class="notification-text">${notif.message}</p>
          <p class="notification-time">${formatTimeAgo(notif.timestamp)}</p>
        </div>
      </div>
    `
      )
      .join('');
  }

  function renderDataset() {
    const container = document.getElementById('datasetBody');
    if (!container) return;

    if (state.dataset.length === 0) {
      container.innerHTML =
        '<tr><td colspan="6">No dataset records found</td></tr>';
      return;
    }

    const startIdx = (state.currentDatasetPage - 1) * state.datasetPerPage;
    const paginated = state.dataset.slice(
      startIdx,
      startIdx + state.datasetPerPage
    );

    container.innerHTML = paginated
      .map(
        record => `
      <tr>
        <td>${record._id}</td>
        <td>
          <button class="view-features-btn" data-id="${
            record._id
          }">View Features</button>
        </td>
        <td>${record.isFraud ? 'Fraud' : 'Not Fraud'}</td>
        <td>${record.probability}%</td>
        <td>${new Date(record.createdAt).toLocaleDateString()}</td>
        <td>
          <div class="action-buttons">
            <button class="action-btn edit-btn" data-id="${record._id}">
              <i class="fa-solid fa-pencil"></i>
            </button>
            <button class="action-btn delete-btn" data-id="${record._id}">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `
      )
      .join('');

    // Update pagination
    updatePagination(state.dataset.length, state.datasetPerPage, 'dataset');
  }

  function initChart() {
    const ctx = document.getElementById('fraud-chart').getContext('2d');

    // Sample chart data - replace with your actual data
    state.fraudChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          '0-10%',
          '10-20%',
          '20-30%',
          '30-40%',
          '40-50%',
          '50-60%',
          '60-70%',
          '70-80%',
          '80-90%',
          '90-100%'
        ],
        datasets: [
          {
            label: 'Fraud Probability Distribution',
            data: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
            backgroundColor: 'rgba(255, 99, 132, 0.7)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // Helper functions
  function showLoading(selector) {
    const element = document.querySelector(selector);
    if (element) {
      element.innerHTML = `
        <tr>
          <td colspan="${selector === '#predictionsBody' ? 7 : 6}">
            <i class="fa-solid fa-spinner fa-spin"></i> Loading...
          </td>
        </tr>
      `;
    }
  }

  function showError(selector, message) {
    const element = document.querySelector(selector);
    if (element) {
      element.innerHTML = `
        <tr>
          <td colspan="${
            selector === '#predictionsBody' ? 7 : 6
          }" class="error">
            <i class="fa-solid fa-exclamation-circle"></i> ${message}
          </td>
        </tr>
      `;
    }
  }

  function updatePagination(totalItems, itemsPerPage, type) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const isDataset = type === 'dataset';
    const currentPage = isDataset
      ? state.currentDatasetPage
      : state.currentPage;

    if (isDataset) {
      document.getElementById('currentDatasetPage').textContent = currentPage;
      document.getElementById('totalDatasetPages').textContent = totalPages;
      document.getElementById('prevDatasetPage').disabled = currentPage <= 1;
      document.getElementById('nextDatasetPage').disabled =
        currentPage >= totalPages;
    } else {
      document.getElementById('currentPage').textContent = currentPage;
      document.getElementById('totalPages').textContent = totalPages;
      document.getElementById('prevPage').disabled = currentPage <= 1;
      document.getElementById('nextPage').disabled = currentPage >= totalPages;
    }
  }

  function getNotificationIcon(type) {
    switch (type) {
      case 'warning':
        return 'fa-exclamation-triangle';
      case 'error':
        return 'fa-times-circle';
      case 'info':
        return 'fa-info-circle';
      case 'success':
        return 'fa-check-circle';
      default:
        return 'fa-info-circle';
    }
  }

  function formatTimeAgo(timestamp) {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
      }
    }

    return 'Just now';
  }

  // Event listeners
  document.getElementById('prevPage').addEventListener('click', () => {
    if (state.currentPage > 1) {
      state.currentPage--;
      renderPredictions();
    }
  });

  document.getElementById('nextPage').addEventListener('click', () => {
    const totalPages = Math.ceil(state.predictions.length / state.itemsPerPage);
    if (state.currentPage < totalPages) {
      state.currentPage++;
      renderPredictions();
    }
  });

  document.getElementById('prevDatasetPage').addEventListener('click', () => {
    if (state.currentDatasetPage > 1) {
      state.currentDatasetPage--;
      renderDataset();
    }
  });

  document.getElementById('nextDatasetPage').addEventListener('click', () => {
    const totalPages = Math.ceil(state.dataset.length / state.datasetPerPage);
    if (state.currentDatasetPage < totalPages) {
      state.currentDatasetPage++;
      renderDataset();
    }
  });

  document
    .getElementById('retrainModel')
    .addEventListener('click', async () => {
      const btn = document.getElementById('retrainModel');
      const originalText = btn.innerHTML;

      try {
        btn.disabled = true;
        btn.innerHTML =
          '<i class="fa-solid fa-spinner fa-spin"></i> Retraining...';

        const response = await fetch('/api/audit/retrain', { method: 'POST' });
        if (!response.ok) throw new Error('Failed to start retraining');

        // Poll for completion
        const poll = async () => {
          try {
            const statusRes = await fetch('/api/audit/training-status');
            if (!statusRes.ok) throw new Error('Failed to check status');

            const status = await statusRes.json();
            if (status.complete) {
              showToast('Model retraining completed!');
              await loadMetrics();
              await loadNotifications();
            } else {
              setTimeout(poll, 3000);
            }
          } catch (error) {
            console.error('Polling error:', error);
            showToast('Error checking training status', 'error');
          } finally {
            btn.disabled = false;
            btn.innerHTML = originalText;
          }
        };

        setTimeout(poll, 5000);
      } catch (error) {
        console.error('Retraining error:', error);
        showToast('Failed to start retraining', 'error');
        btn.disabled = false;
        btn.innerHTML = originalText;
      }
    });

  function showToast(message, type = 'success') {
    // Implement your toast notification system
    console.log(`${type}: ${message}`);
  }
});

// Event delegation for dataset action buttons
document.getElementById('datasetBody').addEventListener('click', async e => {
  if (e.target.closest('.view-features-btn')) {
    const recordId = e.target.closest('.view-features-btn').dataset.id;
    // Handle view features action
    console.log(`View features for record ID: ${recordId}`);
  } else if (e.target.closest('.edit-btn')) {
    const recordId = e.target.closest('.edit-btn').dataset.id;
    // Handle edit action
    console.log(`Edit record ID: ${recordId}`);
  } else if (e.target.closest('.delete-btn')) {
    const recordId = e.target.closest('.delete-btn').dataset.id;
    // Handle delete action
    console.log(`Delete record ID: ${recordId}`);
  }
});
