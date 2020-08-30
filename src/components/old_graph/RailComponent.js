import React from 'react';
import styles from './RailComponent.module.css';

const RailComponent = (props) => {
    const { label, children, data } = props;

    let q1 = {};
    let q2 = {};
    let q3 = {};
    let q4 = {};
    
    const configureRails = () => {
        let bottomLeft = data.children[0] && data.children[0].parents.indexOf(data) > 0;
        let bottomRight = data.children[0] && data.children[0].parents.indexOf(data) < data.children[0].parents.length - 1;

        let middleLower = data.children && data.children[0] !== null;
        let middleUpper = data.parents.length && data.parents[0] && data.parents[0].data !== null;

        let branch_colors = ['red', 'yellow', 'green', 'purple'];
        let color = data.branch_index !== null ? branch_colors[data.branch_index] : 'gray';

        let defaultBorder = '1px dotted gray';
        let activeBorder = `2px solid ${color}`;
        let thickerBorder = `4px solid ${color}`;

        q1 = {
            // borderLeft: ? activeBorder : defaultBorder,
            borderRight: middleUpper ? activeBorder : defaultBorder,
            // borderTop: ? activeBorder : defaultBorder,
            // borderBottom: ? activeBorder : defaultBorder,
        }

        q2 = {
            borderLeft: middleUpper ? activeBorder : defaultBorder,
            // borderRight: ? activeBorder : defaultBorder,
            // borderTop: ? activeBorder : defaultBorder,
            // borderBottom: ? activeBorder : defaultBorder,
        }

        q3 = {
            // borderLeft: ? activeBorder : defaultBorder,
            borderRight: middleLower ? activeBorder : defaultBorder,
            // borderTop: ? activeBorder : defaultBorder,
            borderBottom: bottomLeft ? thickerBorder : defaultBorder,
        }

        q4 = {
            borderLeft: middleLower ? activeBorder : defaultBorder,
            // borderRight: ? '' : defaultBorder,
            // borderTop: ? '' : defaultBorder,
            borderBottom: bottomRight ? thickerBorder : defaultBorder,
        }
    }

    const handleClick = () => {
        props.data.select(true);
        props.data.edit();
    }

    if(data) configureRails();

    return(
        <div className={styles.rail_wrapper}> 	
            <div 
                className={styles.rails}                    
                style={{
                    // borderColor: data.selected ? '#39FF14' : 'white',
                    // borderStyle: data.selected ? 'solid' : 'dashed',
                }}
            >
                <div style={q1}></div>
                <div style={q2}></div>
                <div style={q3}></div>
                <div style={q4}></div>
            </div>		

            <label onClick={handleClick} style={{
                backgroundColor: data.selected ? '#39FF14' : 'black',
                color: data.selected ? 'black' : 'white'
            }}>
                {label ? label : 'EMPTY SLOT'}
                {/* {!app.isPackaged && (<p><small>{data.uuid}</small></p>)} */}
            </label> 

            <div className={styles.content}>
                {children}
            </div>
                            
        </div>
    );
}

export default RailComponent;