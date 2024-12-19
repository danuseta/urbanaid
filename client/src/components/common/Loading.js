class LoadingSpinner {
  constructor() {
    if (!document.getElementById('loading-spinner')) {
      this._createLoadingElement();
    }
  }

  _createLoadingElement() {
    const loadingElement = document.createElement('div');
    loadingElement.id = 'loading-spinner';
    loadingElement.classList.add('hidden');

    loadingElement.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.3s ease;
            opacity: 1; 
        `;
    loadingElement.innerHTML = `
            <div class="loading-content">
                <div class="animate-spin w-16 h-16 border-4 border-gray-300 border-t-teal-600 rounded-full"></div>
                <p class="mt-4 text-gray-600">Loading...</p>
            </div>
        `;
    document.body.appendChild(loadingElement);
  }

  show() {
    const loadingElement = document.getElementById('loading-spinner');
    if (loadingElement) {
      loadingElement.classList.remove('hidden');
      loadingElement.style.opacity = '1';
      loadingElement.style.pointerEvents = 'auto';
      document.body.style.overflow = 'hidden';
    }
  }

  hide() {
    const loadingElement = document.getElementById('loading-spinner');
    if (loadingElement) {

      loadingElement.style.opacity = '0';
      loadingElement.classList.add('hidden');
      document.body.style.overflow = '';

      setTimeout(() => {
        loadingElement.style.display = 'none';
      }, 300);
    } else {
    }
  }
}

const Loading = new LoadingSpinner();
export default Loading;