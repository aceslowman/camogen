import React from 'react';
import { observer } from 'mobx-react';
import MainContext from '../../MainContext';

import styles from './RailComponent.module.css';

const RailComponent = observer(class RailComponent extends React.Component {
    static contextType = MainContext;

    q1 = {};
    q2 = {};
    q3 = {};
    q4 = {};
    
    configureRails() {
        const { data } = this.props;

        let bottomLeft = data.children[0] && data.children[0].parents.indexOf(data) > 0;
        let bottomRight = data.children[0] && data.children[0].parents.indexOf(data) < data.children[0].parents.length - 1;

        let middleLower = data.children && data.children[0] !== null;
        let middleUpper = data.parents && data.parents[0] && data.parents[0].data !== null;

        let branch_colors = ['red', 'yellow', 'green', 'purple'];
        let color = data.branch_index !== null ? branch_colors[data.branch_index] : 'gray';

        let defaultBorder = '1px dotted gray';
        // let defaultBorder = 'none';
        let activeBorder = `2px solid ${color}`;
        let thickerBorder = `4px solid ${color}`;

        this.q1 = {
            // borderLeft: ? activeBorder : defaultBorder,
            borderRight: middleUpper ? activeBorder : defaultBorder,
            // borderTop: ? activeBorder : defaultBorder,
            // borderBottom: ? activeBorder : defaultBorder,
        }

        this.q2 = {
            borderLeft: middleUpper ? activeBorder : defaultBorder,
            // borderRight: ? activeBorder : defaultBorder,
            // borderTop: ? activeBorder : defaultBorder,
            // borderBottom: ? activeBorder : defaultBorder,
        }

        this.q3 = {
            // borderLeft: ? activeBorder : defaultBorder,
            borderRight: middleLower ? activeBorder : defaultBorder,
            // borderTop: ? activeBorder : defaultBorder,
            borderBottom: bottomLeft ? thickerBorder : defaultBorder,
        }

        this.q4 = {
            borderLeft: middleLower ? activeBorder : defaultBorder,
            // borderRight: ? '' : defaultBorder,
            // borderTop: ? '' : defaultBorder,
            borderBottom: bottomRight ? thickerBorder : defaultBorder,
        }
    }

	render() {	
		const { label, children, data } = this.props;

        this.store = this.context.store;
          
        if(data) this.configureRails();

		return(
			<div className={styles.rail_wrapper}> 	
                <div 
                    className={styles.rails}                    
                    style={{
                        // borderColor: data.selected ? '#39FF14' : 'white',
                        // borderStyle: data.selected ? 'solid' : 'dashed',
                    }}
                >
                    <div style={this.q1}></div>
                    <div style={this.q2}></div>
                    <div style={this.q3}></div>
                    <div style={this.q4}></div>
                </div>		

				<label style={{
                    backgroundColor: data.selected ? '#39FF14' : 'black',
                    color: data.selected ? 'black' : 'white'
                }}>{label ? label : 'EMPTY SLOT'}</label>     

                <div className={styles.content}>
                    {children}
                </div>
								
            </div>
	    );
	}
});

export default RailComponent; 