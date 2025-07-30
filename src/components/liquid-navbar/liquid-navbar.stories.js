import './liquid-navbar.js';

export default {
  title: 'Components/LiquidNavbar',
  component: 'liquid-navbar',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Basic = () => `
  <liquid-navbar
    logo="/assets/amphiptere-css-logo.svg"
    items='[
      {"label":"Home","href":"/home","icon":"/assets/home.svg"},
      {"label":"Jobs","href":"/jobs","icon":"/assets/jobs.svg"}
    ]'
    trailing='{"label":"Logout","href":"/logout","icon":"/assets/logout.svg"}',
    rectwidth="200",
    rectheight="700",
    bottomcornercurveradius="40"
  ></liquid-navbar>
`;