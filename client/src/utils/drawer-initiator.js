class NavbarComponent extends HTMLElement {
  constructor() {
    super();
    this.handleLogout = this.handleLogout.bind(this);
    this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
    this.handleNavigation = this.handleNavigation.bind(this);
  }

  toggleMobileMenu(event, forceClose = false) {
    if (event) event.stopPropagation();

    const mobileMenu = this.querySelector('#mobile-menu');
    if (!mobileMenu) {
      console.error('Mobile menu element not found');
      return;
    }

    const isHidden = mobileMenu.classList.contains('hidden');

    if (forceClose || !isHidden) {
      document.body.style.overflow = '';
      mobileMenu.classList.add('hidden');
    } else {
      document.body.style.overflow = 'hidden';
      mobileMenu.classList.remove('hidden');
    }
  }

  handleNavigation(e) {
    if (e.target.tagName === 'A' && !e.target.getAttribute('href').startsWith('http')) {
      e.preventDefault();
      const url = e.target.getAttribute('href').replace('#', '');
      window.history.pushState(null, null, url);
      const app = window.App;
      if (app) {
        app.renderPage();
      }
      this.toggleMobileMenu(null, true);
    }
  }

  connectedCallback() {
    const menuButton = this.querySelector('#mobile-menu-button');
    menuButton?.addEventListener('click', this.toggleMobileMenu);

    const navLinks = this.querySelectorAll('#mobile-menu a');
    navLinks.forEach((link) => link.addEventListener('click', this.handleNavigation));
  }

  disconnectedCallback() {
    const menuButton = this.querySelector('#mobile-menu-button');
    menuButton?.removeEventListener('click', this.toggleMobileMenu);
  }
}

customElements.define('navbar-component', NavbarComponent);

const DrawerInitiator = {
  init({ button, drawer, overlay, closeOnOutsideClick = true, closeOnEscape = true }) {
    this._button = button;
    this._drawer = drawer;
    this._overlay = overlay;

    this._toggleDrawer = this._toggleDrawer.bind(this);
    this._handleOutsideClick = this._handleOutsideClick.bind(this);
    this._handleEscape = this._handleEscape.bind(this);

    this._button.addEventListener('click', this._toggleDrawer);

    if (closeOnOutsideClick && this._overlay) {
      this._overlay.addEventListener('click', this._toggleDrawer);
    }

    if (closeOnEscape) {
      document.addEventListener('keydown', this._handleEscape);
    }
  },

  _toggleDrawer() {
    const isHidden = this._drawer.classList.contains('hidden');
    document.body.style.overflow = isHidden ? 'hidden' : '';
    this._drawer.classList.toggle('hidden');
    this._overlay?.classList.toggle('hidden');
  },

  _handleOutsideClick(event) {
    if (!this._drawer.contains(event.target)) {
      this._toggleDrawer();
    }
  },

  _handleEscape(event) {
    if (event.key === 'Escape' && !this._drawer.classList.contains('hidden')) {
      this._toggleDrawer();
    }
  },
};

export default DrawerInitiator;
