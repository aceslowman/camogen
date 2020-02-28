import {observable,computed,decorate} from 'mobx';

export default class PageData {
    // width and height measured in inches
    width  = 11;
    height = 17;
    margin = 15;
    dpi    = 300;
}

decorate(PageData, {
    margin: observable,
    width: observable,
    height: observable,
    dpi: observable,
});