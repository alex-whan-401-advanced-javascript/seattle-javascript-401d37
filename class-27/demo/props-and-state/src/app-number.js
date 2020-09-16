import React from "react";

import "./styles.scss";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      num: 0,
    };
  }

  numChangeHandler = (num) => {
    this.setState({ num });
  };

  render() {
    return (
      <>
        <h1>Number Fun</h1>
        <Number num={this.state.num} otherProp="otherThing" />
        <h3>Playing around {this.state.num}</h3>
        <NumberForm onNumChange={this.numChangeHandler} />
      </>
    );
  }
}

function Number(props) {
  return <h1 data-testid="output">{props.show}</h1>;
}

function NumberForm(props) {
  const _handleSubmit = (e) => {
    e.preventDefault();
    e.target.reset();
  };

  const _handleChange = (e) => {
    props.updateNumber(e.target.value);
  };

  return (
    <form onSubmit={_handleSubmit}>
      <input
        data-testid="num"
        type="number"
        onChange={_handleChange}
        placeholder="0"
      />
    </form>
  );
}

export default App;
