import {observable,computed,decorate} from 'mobx';
import ParameterData from './ParameterData';

export default class PageData {
    // width and height measured in inches
    width = new ParameterData({
        name: 'width',
        value: 8.5,
    });

    height = new ParameterData({
        name: 'height',
        value: 14,
    });

    isSingle = new ParameterData({
        name: 'isSingle',
        value: false,
    });

    isPortrait = new ParameterData({
        name: 'isPortrait',
        value: false,
    });

    marginTop = new ParameterData({
        name: 'marginTop',
        value: (459 / 16) * 2,
    });
    
    marginBottom = new ParameterData({
        name: 'marginBottom',
        value: (459 / 16) * 3,
    });

    marginLeft = new ParameterData({
        name: 'marginLeft',
        value: (459 / 16) * 5,
    });

    marginRight = new ParameterData({
        name: 'marginRight',
        value: (459 / 16) * 1,
    });
    
    dpi = new ParameterData({
        name: 'dpi',
        value: 300,
    });

    count = new ParameterData({
        name: 'page count',
        value: 64,
    });
}

decorate(PageData, {
    marginTop: observable,
    marginBottom: observable,
    marginLeft: observable,
    marginRight: observable,
    width: observable,
    height: observable,
    isSingle: observable,
    isPortrait: observable,
    dpi: observable,
    count: observable,
});