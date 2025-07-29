
import styles from './liquid-navbar.css?inline';
import getNavbarRect from './get-navbar-svg';
import * as d3 from 'd3';
import { interpolatePath } from 'd3-interpolate-path';

class LiquidNavbar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._navItems = [];
    this._logo = '';
    this._trailing = null;
    this._rectParams = {
      rectWidth: 150,
      rectHeight: 700,
      startY: 200,
      cutoutWidth: 70,
      cutoutHeight: 45,
      topRightCutoutCurveRadius: 30,
      bottomRightCutoutCurveRadius: 30,
      topCornerCurveRadius: 0,
      bottomCornerCurveRadius: 40
    };
    this.render();
  }

  static get observedAttributes() {
    return [
      'logo', 'items', 'trailing',
      'rectwidth', 'rectheight', 'starty', 'cutoutwidth', 'cutoutheight',
      'toprightcutoutcurveradius', 'bottomrightcutoutcurveradius',
      'topcornercurveradius', 'bottomcornercurveradius'
    ];
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
      } else if ([
        'rectwidth', 'rectheight', 'starty', 'cutoutwidth', 'cutoutheight',
        'toprightcutoutcurveradius', 'bottomrightcutoutcurveradius',
        'topcornercurveradius', 'bottomcornercurveradius'
      ].includes(name)) {
        this._rectParams = {
          ...this._rectParams,
          [this._toCamelCase(name)]: newValue !== null ? parseFloat(newValue) : this._rectParams[this._toCamelCase(name)]
        };
      }
      this.render();
    }
  }

  _toCamelCase(attr) {
    switch (attr) {
      case "rectwidth":
        return "rectWidth";
      case "rectheight":
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
    [
      'rectwidth', 'rectheight', 'starty', 'cutoutwidth', 'cutoutheight',
      'toprightcutoutcurveradius', 'bottomrightcutoutcurveradius',
      'topcornercurveradius', 'bottomcornercurveradius'
    ].forEach(attr => {
      if (this.hasAttribute(attr)) {
        this._rectParams[this._toCamelCase(attr)] = parseFloat(this.getAttribute(attr));
      }
    }); 
    this.render();
  }

  animatePath(fromPath, toPath, svgPathElement, duration = 400) {
    const excludeSegment = (a, b) => {
      console.log(d3.select(svgPathElement).attr('d')); 
      return a.x == b.x;
    };
    const interpolator = interpolatePath(fromPath, toPath, { excludeSegment });
    d3.select(svgPathElement)
      .transition()
      .duration(duration)
      .attrTween('d', () => t => interpolator(t));
  }

  render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = '';
    const style = document.createElement('style');
    style.textContent = styles;

    const initialPath = getNavbarRect(this._rectParams);

    const wrapper = document.createElement('nav');
    wrapper.className = 'vertical-navbar';
    wrapper.style = `width: ${this._rectParams.rectWidth}px`;
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
      const navDrawPath = this.shadowRoot.querySelector('#navbarDrawPath');
      const margin = 5; 
      const cutoutCurveRad = 40;
      const cutoutHeight = 65;
      navItems.forEach(item => {
        item.addEventListener('mouseover', () => {
          const itemRect = item.getBoundingClientRect();
          const targetParams = { 
            ...this._rectParams, 
            cutoutWidth: itemRect.width, 
            cutoutHeight: cutoutHeight, 
            topRightCutoutCurveRadius: cutoutCurveRad, 
            bottomRightCutoutCurveRadius: cutoutCurveRad, 
            startY: itemRect.top - margin 
          };
          const targetPath = getNavbarRect(targetParams);
          this.animatePath(navDrawPath.getAttribute('d'), targetPath, navDrawPath, 500);
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
          this.animatePath(navDrawPath.getAttribute('d'), flushPath, navDrawPath, 500);
        })
      });
    });
  }
}

customElements.define('liquid-navbar', LiquidNavbar);