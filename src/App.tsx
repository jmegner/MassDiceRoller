import React, {useState} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ResultTable from './components/ResultTable';
import { MersenneTwister19937, Random } from 'random-js';
import * as _ from 'lodash';

export default function App() {
  const [rng] = useState(new Random(MersenneTwister19937.autoSeed()));
  const [diceQuantity, setDiceQuantity] = useState(600);
  const [rolledDiceCounts, setRolledDiceCounts] = useState(new Map<number,number>());
  const [pipsToReroll, setPipsToReroll] = useState(new Set<number>())

  const randomRollResult = (rng: Random, diceQuantity: number): Map<number,number> => {
    let rawRolls = rng.dice(6, diceQuantity);
    let rollResultCounts = new Map<number,number>();

    for(let roll of rawRolls) {
      rollResultCounts.set(roll, (rollResultCounts.get(roll) || 0) + 1);
    }
    return rollResultCounts;
  };

  const combineRollResults = (rolls1: Map<number,number>, rolls2: Map<number,number>) => {
    let pips = _.union(Array.from(rolls1.keys()), Array.from(rolls2.keys()));
    let combinedRolls = new Map<number,number>();

    for(let pip of pips) {
      combinedRolls.set(pip, (rolls1.get(pip) ?? 0) + (rolls2.get(pip) ?? 0) );
    }

    return combinedRolls;
  };

  const handleDiceQuantityChange = (event: any) => {
    setDiceQuantity(event.target.value);
  };

  const handleRollClick = () => {
    setRolledDiceCounts(randomRollResult(rng, diceQuantity));
  };

  const handlePipsToRerollChange = (pip: number, newValue: boolean) => {
    const pipsToRerollNewState = new Set<number>(pipsToReroll);
    newValue ? pipsToRerollNewState.add(pip) : pipsToRerollNewState.delete(pip)
    setPipsToReroll(pipsToRerollNewState);
  };

  const handleRerollClick = () => {
    let numDiceToReroll = 0;
    let newRolledDiceCounts = new Map<number,number>();

    // TODO: some central spot to have PipMin=1 and PipMax=6
    for(let pip = 1; pip <= 6; pip++) {
      let diceForThisPip = rolledDiceCounts.get(pip) ?? 0;

      if(pipsToReroll.has(pip)) {
        numDiceToReroll += diceForThisPip;
        newRolledDiceCounts.set(pip, 0);
      }
      else {
        newRolledDiceCounts.set(pip, diceForThisPip);
      }
    }

    newRolledDiceCounts = combineRollResults(
      newRolledDiceCounts,
       randomRollResult(rng, numDiceToReroll));

    setRolledDiceCounts(newRolledDiceCounts);
  };

  return (
    <Container className="p-3">
      <h1 className="header">
        MassDiceRoller
      </h1>
      <Row>
        <Col>
          <input placeholder="Dice Quantity" value={diceQuantity} onChange={handleDiceQuantityChange} />
          <Button className="m-2" onClick={handleRollClick}>Roll</Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <ResultTable isExactResult={false} displayMin={1} displayMax={3} diceCounts={rolledDiceCounts} />
        </Col>
        <Col>
          <ResultTable isExactResult={false} displayMin={4} displayMax={6} diceCounts={rolledDiceCounts} />
        </Col>
      </Row>
      <Row>
        <Col>
          <ResultTable
            isExactResult={true}
            displayMin={1}
            displayMax={3}
            diceCounts={rolledDiceCounts}
            pipsToReroll={pipsToReroll}
            pipsToRerollChangeHandler={handlePipsToRerollChange}
            />
        </Col>
        <Col>
          <ResultTable
            isExactResult={true}
            displayMin={4}
            displayMax={6}
            diceCounts={rolledDiceCounts}
            pipsToReroll={pipsToReroll}
            pipsToRerollChangeHandler={handlePipsToRerollChange}
            />
        </Col>
      </Row>
      <Row>
        <Button className="m-2" onClick={handleRerollClick}>Reroll</Button>
      </Row>
      <Row>
        <a href="https://github.com/KatyAHG/MassDiceRoller">GitHub repo</a>
      </Row>
    </Container>
  );
};