import React, { useContext } from "react";
import MainContext from "../../MainContext";
import {
  ControlGroupComponent,
  GenericPanel,
  InputColor,
  InputSelect,
  TextComponent,
  Themes
} from "maco-ui";

import { observer } from "mobx-react";

const Preferences = observer(props => {
  const store = useContext(MainContext).store;
  const { ui } = store;

  return (
    <GenericPanel panel={props.panel}>
      <TextComponent>Hello World</TextComponent>
      <ControlGroupComponent name="theme">
        <InputSelect
          options={[
            { label: "weyland", value: "weyland" },
            { label: "yutani", value: "yutani" },
            { label: "powershell", value: "powershell" },
            { label: "sarah", value: "sarah" }
          ]}
          onChange={t => ui.theme.setTheme(Themes[t])}
        />
      </ControlGroupComponent>

      <ControlGroupComponent name="color">
        <InputColor
          // showValue
          label="primary"
          value={ui.theme.primary_color}
          onChange={v => ui.theme.setPrimaryColor(v)}
        />
        <InputColor
          // showValue
          label="secondary"
          value={ui.theme.secondary_color}
          onChange={v => ui.theme.setSecondaryColor(v)}
        />
        <InputColor
          // showValue
          label="tertiary"
          value={ui.theme.tertiary_color}
          onChange={v => ui.theme.setTertiaryColor(v)}
        />
        <InputColor
          // showValue
          label="text"
          value={ui.theme.text_color}
          onChange={v => ui.theme.setTextColor(v)}
        />
        <InputColor
          // showValue
          label="accent"
          value={ui.theme.accent_color}
          onChange={v => ui.theme.setAccentColor(v)}
        />
        <InputColor
          // showValue
          label="outline"
          value={ui.theme.outline_color}
          onChange={v => ui.theme.setOutlineColor(v)}
        />
      </ControlGroupComponent>
    </GenericPanel>
  );
});

export default Preferences;
