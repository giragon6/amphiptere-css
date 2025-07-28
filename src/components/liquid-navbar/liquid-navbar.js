
import styles from './liquid-navbar.css?inline';
import getNavbarRect from './get-navbar-svg';

class LiquidNavbar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._navItems = [];
    this._logo = '';
    this._trailing = null;
    this.render();
  }

  static get observedAttributes() {
    return ['logo', 'items', 'trailing'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === 'logo') {
        this._logo = newValue;
      } else if (name === 'items') {
        try {
          this._navItems = JSON.parse(newValue);
        } catch {
          this._navItems = [];
        }
      } else if (name === 'trailing') {
        try {
          this._trailing = JSON.parse(newValue);
        } catch {
          this._trailing = null;
        }
      }
      this.render();
    }
  }

  set items(val) {
    this.setAttribute('items', JSON.stringify(val));
  }
  get items() {
    return this._navItems;
  }

  set logo(val) {
    this.setAttribute('logo', val);
  }
  get logo() {
    return this._logo;
  }

  set trailing(val) {
    this.setAttribute('trailing', JSON.stringify(val));
  }
  get trailing() {
    return this._trailing;
  }

  connectedCallback() {
    // Initial render if attributes are present
    if (this.hasAttribute('logo')) this._logo = this.getAttribute('logo');
    if (this.hasAttribute('items')) {
      try {
        this._navItems = JSON.parse(this.getAttribute('items'));
      } catch {
        this._navItems = [];
      }
    }
    if (this.hasAttribute('trailing')) {
      try {
        this._trailing = JSON.parse(this.getAttribute('trailing'));
      } catch {
        this._trailing = null;
      }
    }
    this.render();
  }

  render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = '';
    const style = document.createElement('style');
    style.textContent = styles;

    const initialPath = getNavbarRect({
      rectWidth: 150,
      rectHeight: 800,
      startY: 200,
      cutoutWidth: 70,
      cutoutHeight: 45,
      topRightCutoutCurveRadius: 30,
      bottomRightCutoutCurveRadius: 30,
      topCornerCurveRadius: 0,
      bottomCornerCurveRadius: 40
    });

    console.log(initialPath)

    const wrapper = document.createElement('nav');
    wrapper.className = 'vertical-navbar';
    wrapper.innerHTML = `
      <svg height="0" width="0">
        <clipPath id="navbarPath">
          <path
            d="${initialPath}"
            id="navbarDrawPath"
          />
        </clipPath> 
      </svg>
      <div class="navbar-backdrop"></div>
      <ul class="navbar-nav">
        <div class="navbar-logo">
          ${this._logo ? `<img id="navbar-logo-img" src="${this._logo}" alt="Logo" />` : ''}
        </div>
        ${Array.isArray(this._navItems) ? this._navItems.map(item => `
          <li class="nav-item">
            <a class="nav-link" href="${item.href || '#'}">
              <span class="nav-icon">${item.icon ? `<img src="${item.icon}" alt="${item.label}" width="22" height="22" />` : ''}</span>
              <span>${item.label || ''}</span>
            </a>
          </li>
        `).join('') : ''}
      </ul>
      <div class="nav-item trailing">
        ${this._trailing ? `
          <a class="nav-link" href="${this._trailing.href || '#'}">
            <span class="nav-icon">${this._trailing.icon ? `<img src="${this._trailing.icon}" alt="${this._trailing.label}" width="22" height="22" />` : ''}</span>
            <span>${this._trailing.label || ''}</span>
          </a>
        ` : ''}
      </div>
    `;

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(wrapper);

    requestAnimationFrame(() => {
      const navItems = this.shadowRoot.querySelectorAll('.nav-link');
      const navPath = this.shadowRoot.querySelector('#navbarPath');
      // const navDrawPath = this.shadowRoot.querySelector('#navbarDrawPath');

      navItems.forEach(item => {
        const topCutout = 276.618;
        const itemRect = item.getBoundingClientRect();
        const centerItemOffset = itemRect.top - topCutout;
        item.addEventListener('mouseover', () => {
          // You can update the path here if you want dynamic cutouts
        });
        item.addEventListener('mouseleave', () => {
          navPath.setAttribute('transform', `translate(0, 0)`);
        });
      });
    });
  }
}

customElements.define('liquid-navbar', LiquidNavbar);