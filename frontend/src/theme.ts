export const theme = {
  colors: {
    primary: '#FFCC00',
    onPrimary: '#000000',
    secondary: '#E13301',
    onSecondary: '#FFF8E4',
    background: '#FFFFFF',
    surfaceLight: '#F5F5F5',
    surfaceDark: '#EFEFEF',
    content: '#000000'
  },
  radius: {
    md: '12px',
    lg: '16px',
    xl: '20px'
  },
  shadow: {
    soft: '0 18px 45px -25px rgba(0,0,0,0.3)',
    card: '0 12px 30px -18px rgba(0,0,0,0.25)'
  }
};

const toCssVar = (key: string) => `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;

export const applyTheme = () => {
  const root = document.documentElement;
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(toCssVar(`color-${key}`), value);
  });
  Object.entries(theme.radius).forEach(([key, value]) => {
    root.style.setProperty(toCssVar(`radius-${key}`), value);
  });
  Object.entries(theme.shadow).forEach(([key, value]) => {
    root.style.setProperty(toCssVar(`shadow-${key}`), value);
  });
};
