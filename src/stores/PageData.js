import {observable,computed,decorate} from 'mobx';
import ParameterData from './ParameterData';

export default class PageData {
    // width and height measured in inches
    width = new ParameterData({
        name: 'width',
        value: 11,
    });
    height = new ParameterData({
        name: 'height',
        value: 17,
    });
    margin = new ParameterData({
        name: 'margin',
        value: 15,
    });
    dpi = new ParameterData({
        name: 'dpi',
        value: 300,
    });
}

decorate(PageData, {
    margin: observable,
    width: observable,
    height: observable,
    dpi: observable,
});