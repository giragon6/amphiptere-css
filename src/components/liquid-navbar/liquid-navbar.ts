// @ts-ignore
import styles from './liquid-navbar.css?inline';
import getNavbarRect, { RectParams } from './get-navbar-svg';
import animatePath from './animate-path';
  
type NavElement = {
  label: string,
  href: string,
  icon: string // path to icon asset
}
    
class LiquidNavbar extends HTMLElement {
  static observedAttrs = [
    'logo', 'items', 'trailing',
    'width', 'height', 'starty', 'cutoutwidth', 'cutoutheight',
    'toprightcutoutcurveradius', 'bottomrightcutoutcurveradius',
    'topcornercurveradius', 'bottomcornercurveradius'
  ];
  _navItems: NavElement[];
  _logo: string | null; // path to logo asset
  _trailing: NavElement | null;
  _rectParams: RectParams;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._navItems = [];
    this._logo = '';
    this._trailing = null;
    this._rectParams = {
      rectWidth: 250,
      rectHeight: 700,
      startY: 200,
      cutoutWidth: 0,
      cutoutHeight: 0,
      topRightCutoutCurveRadius: 0,
      bottomRightCutoutCurveRadius: 0,
      topCornerCurveRadius: 0,
      bottomCornerCurveRadius: 40
    };
    this.render();
  }

  static get observedAttributes() {
    return LiquidNavbar.observedAttrs;
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
      } else if (LiquidNavbar.observedAttrs.includes(name)) {
        console.log(this._toParamName(name))
        this._rectParams = {
          ...this._rectParams,
          [this._toParamName(name)]: newValue !== null ? parseFloat(newValue) : this._rectParams[this._toParamName(name)]
        };
        console.log(this._rectParams)
      }
      this.render();
    }
  }

  _toParamName(attr) {
    switch (attr) {
      case "width":
        return "rectWidth";
      case "height":
        return "rectHeight";
      case "starty":
        return "startY";
      case "cutoutwidth":
        return "cutoutWidth";
      case "cutoutheight":
        return "cutoutHeight";
      case "toprightcutoutcurveradius":
        return "topRightCutoutCurveRadius";
      case "bottomrightcutoutcurveradius":
        return "bottomRightCutoutCurveRadius";
      case "topcornercurveradius":
        return "topCornerCurveRadius";
      case "bottomcornercurveradius":
        return "bottomCornerCurveRadius";
      default:
        return attr.replace(/([-_][a-z])/g, g => g[1].toUpperCase());
    }
  }

  set items(val) {
    this.setAttribute('items', JSON.stringify(val));
  }
  get items() {
    return this._navItems;
  }

  set logo(val) {
    this.setAttribute('logo', val ?? '');
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
    if (this.hasAttribute('logo')) this._logo = this.getAttribute('logo');
    if (this.hasAttribute('items')) {
      try {
        this._navItems = JSON.parse(this.getAttribute('items') ?? '');
      } catch {
        this._navItems = [];
      }
    }
    if (this.hasAttribute('trailing')) {
      try {
        this._trailing = JSON.parse(this.getAttribute('trailing') ?? '');
      } catch {
        this._trailing = null;
      }
    }
    LiquidNavbar.observedAttrs.forEach(attr => {
      if (this.hasAttribute(attr)) {
        this._rectParams[this._toParamName(attr)] = parseFloat(this.getAttribute(attr)!);
      }
    });
    this.render();
  }

  render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = '';
    const style = document.createElement('style');
    style.textContent = styles;

    const initialPath = getNavbarRect(this._rectParams);

    const wrapper = document.createElement('nav');
    wrapper.className = 'vertical-navbar';
    wrapper.style = `width: ${this._rectParams.rectWidth}px; height: ${this._rectParams.rectHeight}px;`;
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
            <div class="nav-item-bg"></div>
          </li>
        `).join('') : ''}
        <div class="nav-item trailing">
          ${this._trailing ? `
            <a class="nav-link" href="${this._trailing.href || '#'}">
              <span class="nav-icon">${this._trailing.icon ? `<img src="${this._trailing.icon}" alt="${this._trailing.label}" width="22" height="22" />` : ''}</span>
              <span>${this._trailing.label || ''}</span>
            </a>
            <div class="nav-item-bg"></div>
          ` : ''}
        </div>
      </ul>
    `;

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(wrapper);

    requestAnimationFrame(() => {
      if (!this.shadowRoot) return;
      const navItems = this.shadowRoot.querySelectorAll('.nav-link');
      const navDrawPath = this.shadowRoot.querySelector('#navbarDrawPath');
      if (!navDrawPath) return;
      const cutoutCurveRad = 40;
      navItems.forEach(item => {
        item.addEventListener('mouseover', () => {
          const itemRect = item.getBoundingClientRect();
          const cutoutHeight = itemRect.height + 50;
          const safeMargin = (cutoutHeight - itemRect.height) / 2 + cutoutCurveRad;
          const targetParams = {
            ...this._rectParams, 
            cutoutWidth: this._rectParams.rectWidth - itemRect.left + itemRect.width * 0.35, 
            cutoutHeight: cutoutHeight,
            topRightCutoutCurveRadius: cutoutCurveRad,
            bottomRightCutoutCurveRadius: cutoutCurveRad,
            topRightCutoutCurveHeight: (itemRect.top < safeMargin) ? 0 : cutoutCurveRad,
            bottomRightCutoutCurveHeight: (this._rectParams.rectHeight - itemRect.bottom < safeMargin) ? 0 : cutoutCurveRad, 
            startY: itemRect.top - itemRect.height,
            topCornerCurveHeight: Math.min(itemRect.top - (cutoutHeight - itemRect.height) / 2, this._rectParams.topCornerCurveHeight ?? this._rectParams.topCornerCurveRadius),
            bottomCornerCurveHeight: Math.min(this._rectParams.rectHeight - itemRect.bottom - (cutoutHeight - itemRect.height) / 2, this._rectParams.bottomCornerCurveHeight ?? this._rectParams.bottomCornerCurveRadius)
          };
          const targetPath = getNavbarRect(targetParams);
          animatePath(navDrawPath.getAttribute('d'), targetPath, navDrawPath, 350);
        })
        item.addEventListener('mouseleave', () => {
          const itemRect = item.getBoundingClientRect();
          const flushParams = { 
            ...this._rectParams, 
            cutoutWidth: 0,
            cutoutHeight: 0,
            topRightCutoutCurveRadius: 0,
            bottomRightCutoutCurveRadius: 0, 
            startY: itemRect.top + itemRect.height / 2 
          };
          const flushPath = getNavbarRect(flushParams);
          animatePath(navDrawPath.getAttribute('d'), flushPath, navDrawPath, 350);
        })
      });
    });  
  }
}

customElements.define('liquid-navbar', LiquidNavbar);
export { LiquidNavbar };