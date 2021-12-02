import React from 'react';

import { Table } from 'react-bootstrap';

interface Props {
    displayMin: number;
    displayMax: number;
    diceCounts: Map<number,number>
}

// the 'isExactResult === true' version of this component was like PipDisplays
// in that it showed exact count for a pip-count and had a checkbox for reroll
const ResultTable: React.FC<Props> = (props: Props) => {
  let rows: any[] = [];
  let runningSum = 0;

  for (let pip = 6; pip >= props.displayMin; pip--) {
      let diceCount = props.diceCounts.get(pip) || 0;
      runningSum += diceCount;

      if(pip <= props.displayMax) {
        rows.push(
          <tr key={pip}>
            <td>{pip}+</td>
            <td data-testid={'stat' + pip}>{runningSum}</td>
          </tr>
        );
      }
  }

  rows.reverse();
  
  return (
    <Table striped>
      <thead>
        <tr>
          <th>Stat</th>
          <th>Qty</th>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </Table>
  );
}

export default ResultTable;