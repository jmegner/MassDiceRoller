import React from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import * as _ from 'lodash';

interface PipDisplayProps {
    pip: number,
    count: number,
    wantReroll: boolean,
    pipsToRerollChangeHandler: (pip: number, newValue: boolean) => void,
}

const PipDisplay: React.FC<PipDisplayProps> = (props: PipDisplayProps) => {
  const onChangeHandler = () => props.pipsToRerollChangeHandler(props.pip, !props.wantReroll);
  return ( 
    <Container style={{width: '50px'}}>
      <Row>
        <Col className='d-flex justify-content-center align-items-center'>
          <Image
            src={process.env.PUBLIC_URL + '/images/pips' + props.pip + '.svg'}
            alt={'pip ' + props.pip}
            style={{ width: '40px', height: '40px' }}
          />
        </Col>
      </Row>
      <Row>
        <Col className='d-flex justify-content-center align-items-center'>
          {props.count}
        </Col>
      </Row>
      <Row>
        <Col className='d-flex justify-content-center align-items-center'>
          <input
            type="checkbox"
            id={"reroll" + props.pip}
            checked={props.wantReroll} onChange={onChangeHandler}
          />
          </Col>
      </Row>
    </Container>
  );
}

interface Props {
  rolledDiceCounts: Map<number, number>,
  pipsToReroll: Set<number>,
  pipsToRerollChangeHandler: (pip: number, newValue: boolean) => void,
}

const PipDisplays: React.FC<Props> = (props: Props) => {
  let pipDisplays = _.range(1, 6 + 1).map(pipId => <PipDisplay
    pip={pipId}
    count={props.rolledDiceCounts.get(pipId) ?? 0}
    wantReroll={props.pipsToReroll.has(pipId)}
    pipsToRerollChangeHandler={props.pipsToRerollChangeHandler}
    />
    );


  let pipStuff = [];

  for(let row = 0; row < 2; row++) {
    let pipRow: JSX.Element[] = [];

    for(let col = 0; col < 3; col++) {
      pipRow.push(<Col key={'col' + col} className="my-2">{pipDisplays[3 * row + col]}</Col>)
    }

    pipStuff.push(<Row key={'row' + row} className="d-flex justify-content-center">{pipRow}</Row>)
  }

  return <Container style={{width: '250px'}}>{pipStuff}</Container>
}

export default PipDisplays;