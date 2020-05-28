import React from 'react';
import { observer } from 'mobx-react';

import styles from './PanelGroupComponent.module.css';

const PanelGroupComponent = observer(class PanelGroupComponent extends React.Component {
    render() {	
		const { children } = this.props;
          
		return(
			<div className={styles.panel_group}> 	                
				{children}
            </div>
	    );
	}
});

export default PanelGroupComponent; 