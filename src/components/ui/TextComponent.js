import React from 'react';
import MainContext from '../../MainContext';

import styles from './TextComponent.module.css';

export default class TextComponent extends React.PureComponent {
	static contextType = MainContext;

	render() {		
		return(
			<div className={styles.text}>
                {this.props.children}
            </div>	
	    )
	}
};