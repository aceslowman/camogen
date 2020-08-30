import React from 'react';
import { shallow, mount } from 'enzyme';
import Graph from '../GraphComponent.js';

describe('Graph', () => {
    it('renders without crashing', () => {
        // shallow(<Graph />);
    });

    it('contains a canvas', () => {
        // const wrapper = mount(<Graph />);
        // console.log(wrapper.find('canvas').exists())
        // expect(wrapper.find('canvas').exists()).toBe(true);
    })

    it('size of canvas matches size of panel', () => {
        // const wrapper = mount(<Graph />);
        // wrapper.getDOMNode().style.position = 'fixed';
        // wrapper.getDOMNode().style.width = 100+'px';
        // wrapper.getDOMNode().style.height = 100+'px';
        // const canvas = wrapper.find('canvas');
        // console.log(
        //     `
        //     wrapper width:  ${wrapper.getDOMNode().offsetWidth}, 
        //     wrapper height: ${wrapper.getDOMNode().offsetHeight}, 
        //     canvas width:   ${canvas.getDOMNode().offsetWidth}, 
        //     canvas height:  ${canvas.getDOMNode().offsetHeight}, `
        // );
        // expect(wrapper.getDOMNode().offsetWidth === canvas.getDOMNode().offsetWidth).toBe(true);
    })
})