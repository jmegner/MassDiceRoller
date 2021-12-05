import React from 'react';
import * as Test from '@testing-library/react';

import App from './App';
import Die from './Die';
import _ from 'lodash';

type RenderResult = Test.RenderResult<typeof Test.queries, HTMLElement>;

function rollDice(
  app: RenderResult,
  numDice: number)
{
  let qtyField = app.getByPlaceholderText('Dice Quantity');
  Test.fireEvent.change(qtyField, {target: {value: numDice}});

  let rollBtn = app.getByText('Roll');
  Test.fireEvent.click(rollBtn);
}

function getRollResults(app: RenderResult) : Map<number,number> {
  let rollResults = new Map<number,number>();

  for (const pip of Die.PipsUp()) {
    const pipCountElem = app.getByTestId('pip' + pip + 'Count');
    const pipCount = parseInt(pipCountElem.textContent as string);
    rollResults.set(pip, pipCount);
  }

  return rollResults;
}

it('app renders without crashing', () => {
  Test.render(<App />);
});

it('roll fills in stat table', () => {
  let app = Test.render(<App />);
  const totalDice = 500;

  rollDice(app, totalDice);

  let pipToStat = new Map<number,number>();

  for (const pip of Die.PipsUp()) {
    const statElem = app.getByTestId('stat' + pip);
    const statVal = parseInt(statElem.textContent as string);
    pipToStat.set(pip, statVal);

    if(pip === Die.PipMin) {
      expect(statVal).toBe(totalDice);
    }
    else {
      expect(statVal).toBeLessThanOrEqual(pipToStat.get(pip - 1) as number);
    }
  }
});

it('roll fills in pip displays', () => {
  let app = Test.render(<App />);
  const totalDice = 501;

  rollDice(app, totalDice);

  let rollResults = getRollResults(app);

  rollResults.forEach((pipCount) => {
    expect(pipCount).toBeGreaterThanOrEqual(0);
  });

  let countSum = _.sum(Array.from(rollResults.values()))
  expect(countSum).toBe(totalDice);
});

it('reroll works', () => {
  let app = Test.render(<App />);
  const totalDice = 503;

  rollDice(app, totalDice);
  let rollResults = getRollResults(app);

  let pipsToReroll = [5];

  pipsToReroll.forEach(pip => {
    const rerollCheckbox = app.container.querySelector('#reroll' + pip) as Element;
    Test.fireEvent.click(rerollCheckbox);
  });

  let rerollBtn = app.getByText('Reroll');
  Test.fireEvent.click(rerollBtn);

  let rerollResults = getRollResults(app);

  for (const pip of Die.PipsUp()) {
    const oldCount = rollResults.get(pip) as number;
    const newCount = rerollResults.get(pip) as number;

    // if not the pip-type rerolled, should not have decreased
    if(pipsToReroll.indexOf(pip) === -1) {
      expect(newCount).toBeGreaterThanOrEqual(oldCount);
    }
    else {
      expect(newCount).toBeLessThanOrEqual(oldCount);
    }
  }

  let countSum = _.sum(Array.from(rerollResults.values()))
  expect(countSum).toBe(totalDice);
});
