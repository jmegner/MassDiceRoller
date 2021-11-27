import React from 'react';

import { Table } from 'react-bootstrap';

interface Props {
    isExactResult?: boolean;
    displayMin: number;
    displayMax: number;
    diceCounts: Map<number,number>
    pipsToReroll?: Set<number>,
    pipsToRerollChangeHandler?: (pip: number, newValue: boolean) => void,
}

const ResultTable: React.FC<Props> = (props: Props) => {
  let rows: any[] = [];
  let runningSum = 0;

  for (let pip = 6; pip >= props.displayMin; pip--) {
      let diceCount = props.diceCounts.get(pip) || 0;
      runningSum += diceCount;
      let relevantQuantity = props.isExactResult ? diceCount : runningSum;
      let pipSuffix = props.isExactResult ? "s" : "+";
      let rerollIsChecked = props.pipsToReroll === undefined ? false : props.pipsToReroll.has(pip);
      let onChangeHandler = () => {
        if(props.pipsToRerollChangeHandler === undefined) {
          return;
        }

        props.pipsToRerollChangeHandler(pip, !rerollIsChecked);
      };
      let rerollCheckBox
        = props.isExactResult
        ? <td><input type="checkbox" id={"reroll" + pip} checked={rerollIsChecked} onChange={onChangeHandler} /></td>
        : <></>;

      if(pip <= props.displayMax) {
        rows.push(<tr key={pip}><td>{pip}{pipSuffix}</td><td>{relevantQuantity}</td>{rerollCheckBox}</tr>)
      }
  }

  rows.reverse();
  
  let quantityTypeName = props.isExactResult ? "Exact" : "Stat";
  let rerollHeader = props.isExactResult ? <th>Reroll?</th> : <></>;

  return ( 
      <Table striped>
          <thead>
              <tr>
                  <th>{quantityTypeName}</th>
                  <th>Qty</th>
                  {rerollHeader}
              </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>

      </Table>
  );
}

export default ResultTable;