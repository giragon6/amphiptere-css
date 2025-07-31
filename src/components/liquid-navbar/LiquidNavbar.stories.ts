import { Meta } from '@storybook/web-components-vite';
import './liquid-navbar.js';

const meta: Meta = {
  title: 'Components/LiquidNavbar',
  tags: ['autodocs'],
  component: 'liquid-navbar',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `A vertical navigation bar Web Component with SVG morphing and modular CSS. This navbar provides a liquid feel with the background "parting" around a navitem when it's hovered.\n
**Features:**
- Add navigation items, including an optional logo/image at the top and a trailing element at the bottom
- Styling customizable via CSS variables
- Responsive and interactive
- Storybook controls for most parameters for in-depth preview

**Planned:**
- Better responsiveness for different navbar widths and mobile devices
- Better calculation of cutout dimensions for navitems
- More cool effects!

**Usage Example:**
\`\`\`
<liquid-navbar
  logo="/assets/amphiptere-css-logo.svg"
  items='[{"label":"Home","href":"/home","icon":"/assets/home.svg"}]'
  trailing='{"label":"Logout","href":"/logout","icon":"/assets/logout.svg"}'
  width="450"
  height="700"
  style="--navbar-background: linear-gradient(180deg, #232b6b 0%, #6a1e8a 100%); --nav-link-color: #fff;"
></liquid-navbar>
\`\`\`
        `
      }
    }
  },    
  argTypes: {
    showLogo: { control: 'boolean', description: 'Show logo' },
    showTrailing: { control: 'boolean', description: 'Show trailing nav item' },
    showHome: { control: 'boolean', description: 'Show Home item' },
    showAbout: { control: 'boolean', description: 'Show About item' },
    showCareers: { control: 'boolean', description: 'Show Careers item' },
    showTeam: { control: 'boolean', description: 'Show Our Team item' },
    width: { control: 'number', description: 'Navbar width' },
    height: { control: 'number', description: 'Navbar height' },
    topcornercurveradius: { control: 'number', description: 'Top right corner radius' },
    bottomcornercurveradius: { control: 'number', description: 'Bottom right corner radius' },
    '--navbar-background': { control: 'text', description: 'Navbar background (CSS var)' },
    '--navbar-shadow': { control: 'text', description: 'Navbar shadow (CSS var)' },
    '--navbar-logo-width': { control: 'text', description: 'Top logo width (CSS var)' },
    '--nav-link-font-size': { control: 'text', description: 'Nav link font size (CSS var)' },
    '--nav-link-color': { control: 'color', description: 'Nav link color when not hovered (CSS var)' },
    '--nav-link-logo-gap': { control: 'text', description: 'Nav link gap (CSS var)' },
    '--nav-link-font-weight': { control: 'text', description: 'Nav link font weight (CSS var)' },
    '--nav-link-hover-filter': { control: 'text', description: 'Nav link hover filter (use this to change the link and icon color on hover) (CSS var)' },
    '--nav-link-hover-font-weight': { control: 'text', description: 'Nav link font weight on hover (CSS var)' },
    '--nav-link-transition': { control: 'text', description: 'Nav link transition when hovered (CSS var)' },
    '--nav-item-bg': { control: 'color', description: 'Nav item background cell color (CSS var)' },
    '--nav-item-bg-border-rad': { control: 'text', description: 'Nav item background cell border radius (CSS var)' },
    '--nav-item-bg-init-transform': { control: 'text', description: 'Nav item background cell initial transform (CSS var)' },
    '--nav-item-bg-final-transform': { control: 'text', description: 'Nav item background cell final transform (CSS var)' },
    '--nav-item-transition': { control: 'text', description: 'Nav item background transition (CSS var)' },
  },
}; 

export default meta;
 
type Args = {
  showLogo?: boolean;
  showTrailing?: boolean;
  showHome?: boolean;
  showAbout?: boolean;
  showCareers?: boolean;
  showTeam?: boolean;
  width?: number;
  height?: number;
  starty?: number;
  cutoutwidth?: number;
  cutoutheight?: number;
  toprightcutoutcurveradius?: number;
  bottomrightcutoutcurveradius?: number;
  topcornercurveradius?: number;
  bottomcornercurveradius?: number;
  [key: string]: any;
};

const defaultItems = [
  { label: 'Home', href: '/home', icon: '/assets/home.svg' },
  { label: 'About', href: '/about', icon: '/assets/about.svg' },
  { label: 'Careers', href: '/careers', icon: '/assets/careers.svg' },
  { label: 'Our Team', href: '/team', icon: '/assets/team.svg' },
];

const defaultTrailing = { label: 'Logout', href: '/logout', icon: '/assets/logout.svg' };

export const Basic = (args: Args) => {
  const styleVars = Object.keys(args)
    .filter(k => k.startsWith('--'))
    .map(k => `${k}: ${args[k]}`)
    .join('; ');

  type NavItem = { label: string; href: string; icon: string };
  const items: NavItem[] = [];
  if (args.showHome !== false) items.push({ label: 'Home', href: '/home', icon: '/assets/home.svg' });
  if (args.showAbout !== false) items.push({ label: 'About', href: '/about', icon: '/assets/about.svg' });
  if (args.showCareers !== false) items.push({ label: 'Careers', href: '/careers', icon: '/assets/careers.svg' });
  if (args.showTeam !== false) items.push({ label: 'Our Team', href: '/team', icon: '/assets/team.svg' });

  const logoAttr = args.showLogo === false ? '' : 'logo="/assets/amphiptere-css-logo.svg"';
  const trailingAttr = args.showTrailing === false ? '' : `trailing='${JSON.stringify(defaultTrailing)}'`;

  return `
    <liquid-navbar
      ${logoAttr}
      items='${JSON.stringify(items)}'
      ${trailingAttr}
      ${args.width ? `width="${args.width}"` : ''}
      ${args.height ? `height="${args.height}"`: ''}
      ${args.topcornercurveradius ? `topcornercurveradius="${args.topcornercurveradius}"`: ''}
      ${args.bottomcornercurveradius ? `bottomcornercurveradius="${args.bottomcornercurveradius}"`: ''}
      style="${styleVars}"
    ></liquid-navbar>
  `;
};