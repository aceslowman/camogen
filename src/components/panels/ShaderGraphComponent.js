import React, { useContext } from 'react';
import MainContext from '../../MainContext';
import GraphComponent from '../graph/GraphComponent';

// import styles from './ShaderGraphComponent.module.css'

import {
	PanelComponent,
} from 'maco-ui';
import { observer } from 'mobx-react';

const ShaderGraph = observer((props) => {
	const store = useContext(MainContext).store;

	return(
		<PanelComponent 
			collapsed={props.collapsed}
			title="Shader Graph"				
			onRemove={()=>store.workspace.removePanel('Shader Graph')}
			defaultSize={props.defaultSize}
		>				
			<GraphComponent 
				data={props.data}
				coord_bounds={props.coord_bounds}
				selectedNode={props.selectedNode}
			/>

			{ props.data && props.data.updateFlag }
		</PanelComponent>
	)  
});

export default ShaderGraph;