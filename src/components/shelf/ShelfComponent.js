import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../../MainContext';
import Panel from '../ui/PanelComponent';
import styles from './ShelfComponent.module.css';

export default @observer class ShelfComponent extends React.Component {
    static contextType = MainContext;   	

	render() {	
		this.store = this.context.store;

		return(
			<Panel 
				title="Shelf"			
				className={styles.shelf}
				defaultWidth={300}
                defaultHeight={500}
			>				
				{this.props.children}
			</Panel>
	    )
	}
};