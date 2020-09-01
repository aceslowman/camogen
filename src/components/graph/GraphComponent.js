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
		const ctx = canvas_ref.current.getContext('2d');
		const wrapper_bounds = wrapper_ref.current.getBoundingClientRect();		
		let _labels = [];

		canvas_ref.current.width  = wrapper_ref.current.offsetWidth;
		canvas_ref.current.height = wrapper_ref.current.offsetHeight;
		
		let queue = props.data.calculateCoordinates();
		props.data.calculateCoordinateBounds();
		props.data.calculateBranches();

		let spacing = {
			x: ((wrapper_bounds.width) / (props.data.coord_bounds.x+1)),
			y: ((wrapper_bounds.height) / (props.data.coord_bounds.y+1))
		};

		// draws grids
		let draw_grid = false;
		if(draw_grid) {
			for (let i = 1; i <= props.data.coord_bounds.x; i++) {
				for (let j = 1; j <= props.data.coord_bounds.y; j++) {
					// ctx.lineWidth = 1;
					ctx.strokeStyle = theme.accent_color;
					ctx.beginPath();
					ctx.setLineDash([3, 3]);
					ctx.moveTo(canvas_ref.current.width - (i * spacing.x), 0);
					ctx.lineTo(canvas_ref.current.width - (i * spacing.x), canvas_ref.current.height);
					// ctx.closePath();
					ctx.stroke();

					// ctx.lineWidth = 1;
					ctx.strokeStyle = theme.accent_color;
					ctx.beginPath();
					ctx.setLineDash([3, 3]);
					ctx.moveTo(0, canvas_ref.current.height - (j * spacing.y));
					ctx.lineTo(canvas_ref.current.width, canvas_ref.current.height - (j * spacing.y));
					// ctx.closePath();
					ctx.stroke();
				}
			}
			ctx.setLineDash([]);
		}		

		ctx.save();
		ctx.translate(spacing.x/2,-spacing.y/2);
		queue.forEach((node,i) => {
			let x = node.coordinates.x 
			let y = node.coordinates.y;

			if (x) x *= spacing.x;
			if (y) y *= spacing.y;

			// inverts on y-axis
			y = wrapper_ref.current.offsetHeight - y;
			
			for(let parent of node.parents) {			
				let cx = parent.coordinates.x;
				let cy = parent.coordinates.y;

				if(cx) cx *= spacing.x;
				if(cy) cy *= spacing.y;				

				// inverts on y-axis
				cy = wrapper_ref.current.offsetHeight - cy;				

				// left/right cable
				ctx.lineWidth = 2;
				ctx.strokeStyle = branch_colors[parent.branch_index];
				ctx.beginPath();
				ctx.moveTo(x, y-30);
				ctx.lineTo(cx, y-30);
				ctx.closePath();
				ctx.stroke();

				// top downward cable
				ctx.beginPath();
				ctx.moveTo(cx, y-30);
				ctx.lineTo(cx, cy-30);
				ctx.closePath();
				ctx.stroke();

				// fill cable (fixes gap)
				ctx.strokeStyle = branch_colors[node.branch_index];
				ctx.beginPath();
				ctx.moveTo(x, y + 15);
				ctx.lineTo(x, cy + 15);
				ctx.closePath();
				ctx.stroke();

				// direction triangle
				ctx.fillStyle = branch_colors[parent.branch_index];
				ctx.beginPath();
				ctx.moveTo(cx - 6, cy + (spacing.y*0.4));
				ctx.lineTo(cx + 6, cy + (spacing.y*0.4));
				ctx.lineTo(cx, cy + 6 + (spacing.y*0.4));
				ctx.closePath();
				ctx.fill();
			}	

			_labels.push((
				<div
					key={i}
					className={`${styles.label} ${props.data.selected === node ? styles.selected : ''}`}
					onClick={() => handleLabelClick(node)}
					style={{						
						left: x + (spacing.x/2) - 15,
						top:  y - (spacing.y/2) - 15
					}}
				>					
					<label
						title={node.name}
						style={{	
							backgroundColor: props.data.selectedNode === node ? theme.accent_color : theme.primary_color,
							borderColor: theme.text_color,
							color: props.data.selectedNode === node ? theme.primary_color : theme.text_color,
						}}
					>{node.name}</label>
				</div>
			));
		});

		setLabels(_labels)
	}
	
	const resize = useResizeObserver(drawGraph, wrapper_ref);

	const handleLabelClick = (node) => {
		node.select();
		node.edit();
	}
	
	useLayoutEffect(() => {
		drawGraph();	
	},[
		props.data, 
		props.data.selectedNode,
		props.data.updateFlag,
		props.data.root, // helped with clear() rerender
		// drawGraph,
	]);

	useEffect(() => {
		let unsubscribe = tinykeys(window, {
			"ArrowDown": () => {
				if (props.data.selectedNode.children[0])
					props.data.selectedNode = props.data.selectedNode.children[0]
			},
			"ArrowLeft": () => {
				if (props.data.selectedNode.children[0]) {
					let idx = props.data.selectedNode.children[0].parents.indexOf(props.data.selectedNode);
					idx--;

					if (idx >= 0) {
						props.data.selectedNode = props.data.selectedNode.children[0].parents[idx];
					}
				}
			},
			"ArrowRight": () => {
				if (props.data.selectedNode.children[0]) {
					let idx = props.data.selectedNode.children[0].parents.indexOf(props.data.selectedNode);
					idx++;

					if(idx <= props.data.selectedNode.children[0].parents.length - 1)
						props.data.selectedNode = props.data.selectedNode.children[0].parents[idx];		
				}
			},
			"ArrowUp": () => {
				if(props.data.selectedNode.parents[0])
					props.data.selectedNode = props.data.selectedNode.parents[0]
			},
			"Delete": () => {
				console.log('delete')
				props.data.removeSelected();
			}
		})

		return () => {
			unsubscribe();
		}
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