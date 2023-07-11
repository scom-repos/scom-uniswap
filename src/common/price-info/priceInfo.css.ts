import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

export const borderStyle = Styles.style({
  borderRadius: 8,
  border: `2px solid ${Theme.input.background}`,
  padding: '0.5rem 1rem'
})