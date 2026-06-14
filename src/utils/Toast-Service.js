// Toast notification service
// Usage: showToast.success('Post created!'), showToast.error('Failed to delete')

let toastContainer = null;
let toastQueue = [];

const getToastContainer = () => {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
};

const createToastElement = (message, type = 'info', duration = 3000) => {
  const toast = document.createElement('div');
  const bgColor = {
    success: 'bg-green-500/90',
    error: 'bg-red-500/90',
    warning: 'bg-amber-500/90',
    info: 'bg-blue-500/90',
  }[type] || 'bg-blue-500/90';

  const icon = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  }[type] || 'ℹ';

  toast.className = `
    ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg 
    flex items-center gap-2 pointer-events-auto
    animate-in fade-in slide-in-from-top-2 duration-300
    backdrop-blur-sm border border-white/20
  `;

  toast.innerHTML = `
    <span class="text-lg font-bold">${icon}</span>
    <span class="text-sm font-medium">${message}</span>
  `;

  setTimeout(() => {
    toast.classList.add('animate-out', 'fade-out', 'slide-out-to-top-2');
    setTimeout(() => toast.remove(), 300);
  }, duration);

  return toast;
};

export const showToast = {
  success: (message, duration = 3000) => {
    const container = getToastContainer();
    const toast = createToastElement(message, 'success', duration);
    container.appendChild(toast);
  },

  error: (message, duration = 4000) => {
    const container = getToastContainer();
    const toast = createToastElement(message, 'error', duration);
    container.appendChild(toast);
  },

  warning: (message, duration = 3500) => {
    const container = getToastContainer();
    const toast = createToastElement(message, 'warning', duration);
    container.appendChild(toast);
  },

  info: (message, duration = 3000) => {
    const container = getToastContainer();
    const toast = createToastElement(message, 'info', duration);
    container.appendChild(toast);
  },

  loading: (message) => {
    const container = getToastContainer();
    const toast = document.createElement('div');
    toast.className = `
      bg-blue-500/90 text-white px-4 py-3 rounded-lg shadow-lg 
      flex items-center gap-2 pointer-events-auto
      backdrop-blur-sm border border-white/20
    `;
    toast.innerHTML = `
      <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      <span class="text-sm font-medium">${message}</span>
    `;
    container.appendChild(toast);
    return toast;
  },

  remove: (toastElement) => {
    if (toastElement) {
      toastElement.classList.add('animate-out', 'fade-out');
      setTimeout(() => toastElement.remove(), 300);
    }
  },
};

export default showToast;
