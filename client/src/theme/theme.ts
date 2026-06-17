import type { ThemeConfig } from 'antd';

const PRIMARY = '#389e0d';
const PRIMARY_BG = '#f6ffed';

export const theme: ThemeConfig = {
  cssVar: true,
  hashed: false,
  token: {
    colorPrimary: PRIMARY,
    colorSuccess: '#52c41a',
    colorLink: PRIMARY,
    borderRadius: 6,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  components: {
    Menu: {
      itemSelectedColor: PRIMARY,
      itemSelectedBg: PRIMARY_BG,
    },
  },
};
