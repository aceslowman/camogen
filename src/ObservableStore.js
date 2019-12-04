import { observable, computed, action, decorate, autorun } from 'mobx';

class ObservableStore {
  test = 0;

  constructor() {
  	autorun(() => console.log(this.report));

  	setInterval(() => {this.test++}, 1000);
  }

  get nodeCount() {
    // return this.test.length;
  }
}

decorate(ObservableStore, {
  test: observable,
  nodeCount: computed
});

const observableStore = new ObservableStore();

export default observableStore;