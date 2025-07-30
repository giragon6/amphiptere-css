import { Meta } from '@storybook/web-components-vite';
import './liquid-navbar.js';

const meta: Meta = {
  title: 'Components/LiquidNavbar',
  tags: ['autodocs'],
  component: 'liquid-navbar',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
     
export const Basic = () => `
  <liquid-navbar
    logo="/assets/amphiptere-css-logo.svg"
    items='[
      {"label":"Home","href":"/home","icon":"/assets/home.svg"},
      {"label":"About","href":"/about","icon":"/assets/about.svg"},
      {"label":"Careers","href":"/careers","icon":"/assets/careers.svg"},
      {"label":"Our Team","href":"/team","icon":"/assets/team.svg"}
    ]'
    trailing='{"label":"Logout","href":"/logout","icon":"/assets/logout.svg"}',
    bottomcornercurveradius="40",
    rectwidth="250"
  ></liquid-navbar>
`;