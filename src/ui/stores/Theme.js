import { types } from "mobx-state-tree";

export const themes = {
  'weyland': { // light
    primary_color: '#ffffff',
    secondary_color: '#C2C2C2',
    tertiary_color: '#e0e0e0',
    text_color: '#000000',
    outline_color: '#aaaaaa',
    accent_color: '#3fa3a3'
  },
  'yutani': { // dark
    primary_color: '#000000',
    secondary_color: '#202020',
    tertiary_color: '#303030',
    text_color: '#ffffff',
    outline_color: '#474747',
    accent_color: '#3fa3a3'
  },
  'powershell': { // blue
    primary_color: '#012456',
    secondary_color: '#304E78',
    tertiary_color: '#233767',
    text_color: '#ffffff',
    outline_color: '#51578B',
    accent_color: '#ffff00'
  },
  'sarah': {
    primary_color: '#0D5439',
    secondary_color: '#9D6C71',
    tertiary_color: '#5b6b5c',
    text_color: '#C9A6A6',
    outline_color: '#aaaaaa',
    accent_color: '#D3945A'
  },
};

const Theme = types
    .model("Theme", {
        ...themes.weyland
    })
    .actions(self => ({
      setTheme: (theme) => {
        self.primary_color = theme.primary_color;
        self.secondary_color = theme.secondary_color;
        self.tertiary_color = theme.tertiary_color;
        self.text_color = theme.text_color;
        self.outline_color = theme.outline_color;
        self.accent_color = theme.accent_color;
      },
      setPrimaryColor: color => self.primary_color = color,
      setSecondaryColor: color => self.secondary_color = color,
      setTertiaryColor: color => self.tertiary_color = color,
      setTextColor: color => self.text_color = color,
      setOutlineColor: color => self.outline_color = color,
      setAccentColor: color => self.accent_color = color
    }))

export default Theme;