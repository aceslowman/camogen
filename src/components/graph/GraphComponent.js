import React, { useRef, useEffect, useLayoutEffect, useState, useContext } from 'react';
import styles from './GraphComponent.module.css';
import { observer } from 'mobx-react';
import { ThemeContext } from 'maco-ui';
import useResizeObserver from '../hooks/ResizeHook';
import tinykeys from 'tinykeys';

const branch_colors = [
	'#0000FF', // blue
	'#FF0000', // red
	'#FFFF00', // yellow			
	'#00FF00', // neon green
	'#9900FF', // purple
	'#FF6000', // orange
];

const GraphComponent = observer((props) => {
	const theme 	  = useContext(ThemeContext);
	const wrapper_ref = useRef(null);
	const canvas_ref  = useRef(null);
	const [labels, setLabels] = useState([]);

	const drawGraph = () => {
		console.log('rerendering graph')
		const ctx = canvas_ref.current.getContext('2d');
		const wrapper_bounds = wrapper_ref.current.getBoundingClientRect();		
		let _labels = [];

		canvas_ref.current.width  = wrapper_ref.current.offsetWidth;
		canvas_ref.current.height = wrapper_ref.current.offsetHeight;
		
		let spacing = {
			x: (wrapper_bounds.width) / (props.data.coord_bounds.x+1),
			y: (wrapper_bounds.height) / (props.data.coord_bounds.y+1)
		};

		let draw_grid = true;
		if (draw_grid) {
			for (let i = 0; i < canvas_ref.current.width / (spacing.x/2); i++) {
				for (let j = 0; j < canvas_ref.current.height / (spacing.y/2); j++) {
					ctx.lineWidth = 1;
					ctx.strokeStyle = theme.secondary_color;
					ctx.beginPath();
					ctx.setLineDash([3, 3]);
					ctx.moveTo((i * (spacing.x/2)), 0);
					ctx.lineTo((i * (spacing.x/2)), canvas_ref.current.height);
					ctx.closePath();
					ctx.stroke();

					ctx.lineWidth = 1;
					ctx.strokeStyle = theme.secondary_color;
					ctx.beginPath();
					ctx.setLineDash([3, 3]);
					ctx.moveTo(0, j * (spacing.y/2));
					ctx.lineTo(canvas_ref.current.width, j * (spacing.y/2));
					ctx.closePath();
					ctx.stroke();
				}
			}
			ctx.setLineDash([]);
		}
		
		ctx.save();
		ctx.translate(spacing.x/2,-spacing.y/2);
		props.data.nodes.forEach((node,i) => {
			let x = node.coordinates.x 
			let y = node.coordinates.y;

			if (x) x *= spacing.x;
			if (y) y *= spacing.y;

			// inverts on y-axis
			y = wrapper_ref.current.offsetHeight - y;
			
			// for(let parent of node.parents) {
			node.parents.forEach((parent, p_i) => {
				let cx = parent.coordinates.x;
				let cy = parent.coordinates.y;

				if (cx) cx *= spacing.x;
				if (cy) cy *= spacing.y;

				// inverts on y-axis
				cy = wrapper_ref.current.offsetHeight - cy;

				// left/right cable
				ctx.lineWidth = 2;
				ctx.strokeStyle = branch_colors[parent.branch_index];
				ctx.beginPath();
				ctx.moveTo(x, y - (spacing.y / 2));
				ctx.lineTo(cx, y - (spacing.y / 2));
				ctx.closePath();
				ctx.stroke();

				// top downward cable
				ctx.beginPath();
				ctx.moveTo(cx, y - (spacing.y));
				ctx.lineTo(cx, y - (spacing.y/2));
				ctx.closePath();
				ctx.stroke();

				// fill cable (fixes gap)
				// ctx.strokeStyle = branch_colors[node.branch_index];
				// ctx.beginPath();
				// ctx.moveTo(x, y);
				// ctx.lineTo(x, cy - (spacing.y / 2));
				// ctx.closePath();
				// ctx.stroke();

				if(node.parents.length > 0) {
					ctx.strokeStyle = branch_colors[node.branch_index];
					ctx.beginPath();
					ctx.moveTo(x, y);
					ctx.lineTo(x, cy + (spacing.y/2));
					ctx.closePath();
					ctx.stroke();
				}
				
				// direction triangle
				ctx.fillStyle = branch_colors[parent.branch_index];
				ctx.beginPath();
				ctx.moveTo(cx - 8, cy + (spacing.y * 0.25) - 8);
				ctx.lineTo(cx + 8, cy + (spacing.y * 0.25) - 8);
				ctx.lineTo(cx, cy + 8 + (spacing.y * 0.25) - 8);
				ctx.closePath();
				ctx.fill();
			});
				

			let label_border_color = theme.text_color;
			let label_border_style = node.data ? 'solid' : 'dashed';
			let label_text_color = theme.text_color;
			let label_background_color = node.data ? theme.secondary_color : theme.primary_color;
			
			if (props.data.selectedNode === node) {
				label_text_color = theme.primary_color;
				label_background_color = theme.accent_color;
			}

			_labels.push((
				<div
					key={i}
					className={`${styles.label} ${props.data.selectedNode === node ? styles.selected : ''}`}
					onClick={() => handleLabelClick(node)}
					style={{						
						left: x + (spacing.x/2) - 15,
						top:  y - (spacing.y/2) - 15
					}}
				>	
					<label
						title={node.name}
						style={{	
							backgroundColor: label_background_color,
							borderColor: label_border_color,
							borderStyle: label_border_style,
							color: label_text_color,
						}}
					>{node.name}</label>
				</div>
			));
		});

		setLabels(_labels)
	}
	
	useResizeObserver(drawGraph, wrapper_ref);

	const handleLabelClick = (node) => node.select();
		
	useLayoutEffect(() => {
		drawGraph();	
	},[
		props.data.coord_bounds,
		props.data.selectedNode.data,
		props.data.nodes,
		props.data.nodes.size,
		props.data.root, // helped with clear() rerender
	]);

	useEffect(() => {
		let unsubscribe = tinykeys(window, {
			"ArrowDown": () => {
				if (props.data.selectedNode && props.data.selectedNode.children.length)
					props.data.selectedNode.children[0].select()
			},
			"ArrowLeft": () => {
				if (props.data.selectedNode && props.data.selectedNode.children.length) {
					let idx = props.data.selectedNode.children[0].parents.indexOf(props.data.selectedNode);
					idx--;

					if (idx >= 0) {
						props.data.selectedNode.children[0].parents[idx].select();
					}
				}
			},
			"ArrowRight": () => {
				if (props.data.selectedNode && props.data.selectedNode.children.length) {
					let idx = props.data.selectedNode.children[0].parents.indexOf(props.data.selectedNode);
					idx++;

					if(idx <= props.data.selectedNode.children[0].parents.length - 1)
						props.data.selectedNode.children[0].parents[idx].select();		
				}
			},
			"ArrowUp": () => {
				if(props.data.selectedNode && props.data.selectedNode.parents.length)
					props.data.selectedNode.parents[0].select()
			},
			"Delete": () => {
				props.data.removeSelected();
			}
		})

		return () => unsubscribe();
	}, [props.data]);

    return (
		<div 
			ref={wrapper_ref} 
			className={styles.wrapper}
		>
			<canvas 
				ref={canvas_ref}
				className={styles.canvas} 				
			/>
			<div className={styles.labels}>
				{labels}
			</div>
		</div>
    )
});

export default GraphComponent;