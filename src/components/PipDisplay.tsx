import React from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

interface Props {
    pip: number,
    count: number,
    wantReroll: boolean,
    pipsToRerollChangeHandler: (pip: number, newValue: boolean) => void,
}

const PipDisplay: React.FC<Props> = (props: Props) => {
  const onChangeHandler = () => props.pipsToRerollChangeHandler(props.pip, !props.wantReroll);
  return ( 
    <Container>
      <Row>
        <Col style={{textAlign: 'center'}}>
          <Image
            src={process.env.PUBLIC_URL + '/images/pips' + props.pip + '.svg'}
            alt={'pip ' + props.pip}
            style={{ width: '50px', height: '50px' }}
          />
        </Col>
      </Row>
      <Row>
        <Col style={{textAlign: 'center'}}>
          {props.count}
        </Col>
      </Row>
      <Row>
        <Col style={{textAlign: 'center'}}>
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

export default PipDisplay;