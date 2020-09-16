import React from "react";
import JSONPretty from "react-json-pretty";

import Form from "./form.js";
import People from "./people.js";

import "./styles.scss";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      count: 0,
      results: [],
    };
  }

  toggleLoading = () => {
    // Just says: state.loading is the OPPOSITE of whatever Boolean it was before (this will allow us to CONDITIONALLY RENDER something like results, or a loading spinner, that sort of thing)
    this.setState({ loading: !this.state.loading });
  };

  // When called, it gets the count, and updates the state with the count and results
  handleForm = (count, results) => {
    this.setState({ count, results }); // when state is updated, it should bubble out and React takes care of the rest (i.e. letting those components that care know about it so they can update accordingly)
  };

  // Saying below to FORM: Form, whats your job??
  // Prompt users to GET some Star Wars folks
  // Before they do that fetch, toggle loading
  // Then, fetch the goods
  // Once fetch is complete, toggle loading
  // Once submitted, call the handler when you submit the form, and we'll give you the prompt

  render() {
    return (
      <>
        <Form
          prompt="Get some Star Wars Folks..."
          toggleLoading={this.toggleLoading}
          handler={this.handleForm}
        />
        <People loading={this.state.loading} people={this.state.results} />
      </>
    );
  }
}

export default App;
