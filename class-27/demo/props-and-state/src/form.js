import React from "react";

class Form extends React.Component {
  handleSubmit = async (e) => {
    // If you have a constructor where ALL it does it call "super", you should just be able to leave it out (and that'll all happen behind the scenes)

    // Also, if we're not doing anything inside our constructor - does it need to be a Class? Something to think about.

    e.preventDefault();

    this.props.toggleLoading();

    // fetch the data

    // built-in JS fetch works well for GET requests, but Axios is better for others (Axios is somewhat like superagent for front end)
    let raw = await fetch("https://swapi.dev/api/people/");
    let data = await raw.json();
    // At this point, we have our data

    // fetch done

    let count = data.count;

    // REDUCE will go through and reduce and array down to a different form
    // In this case, it'll return an object filled up with key/value pairs (like name: URL - the name could be "Luke Skywalker" and URL lets you get more info about that person (like PokeAPI) - still could fix this on PokeCollector)
    let people = data.results.reduce((list, person) => {
      list[person.name] = person.url;
      return list;
    }, {});

    // "handler" comes from the PARENT!
    // What is does is the parent's business - Form doesn't care what gets DONE with the data
    this.props.handler(count, people);
    this.props.toggleLoading();
  };

  // Remember: When you see "props" - the ONLY place they can EVER come from is the PARENT (if you find the parent component, you know where it's coming from)
  // handleSubmit is being called INTERNALLY when the form is submitted
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <button>{this.props.prompt}</button>
      </form>
    );
  }
}

export default Form;
