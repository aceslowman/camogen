import React, { useContext } from "react";
import MainContext from "../../MainContext";
import { GenericPanel, TextComponent, ToolbarComponent } from "maco-ui";

import styles from "./MessagesComponent.module.css";
import { observer } from "mobx-react";

const Messages = observer(props => {
  const store = useContext(MainContext).store;
  const data = store.messages;
  const log = data.log;

  const toolbar = (
    <ToolbarComponent
      items={{
        Clear: {
          id: "Clear",
          label: "clear",
          onClick: () => data.clear()
        }
      }}
    />
  );

  return (
    <GenericPanel panel={props.panel} toolbar={toolbar}>
      <TextComponent>
        <ul className={styles.loglist}>
          {log
            .slice()
            .reverse()
            .map((e, i) => {
              return (
                <li key={i} className={styles[e.type]}>
                  <span
                    className={styles.timestamp}
                  >{`${e.timestamp.toLocaleString()}: `}</span>
                  <br />
                  {`${e.message}`}
                </li>
              );
            })}
        </ul>
      </TextComponent>
    </GenericPanel>
  );
});

export default Messages;
