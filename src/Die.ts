import _ from 'lodash';

export default class Die {
  static readonly PipMin = 1; 
  static readonly PipMax = 6; 

  static PipsUp() {
    return _.range(Die.PipMin, Die.PipMax + 1);
  }

  static PipsDown() {
    return _.rangeRight(Die.PipMin, Die.PipMax + 1);
  }
}