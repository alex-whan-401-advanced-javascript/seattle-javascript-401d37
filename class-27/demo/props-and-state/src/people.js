import React from "react";
import "./styles.scss";

const People = (props) => {
  // PEOPLE: What's your job?
  // Need an object (so we can map over the KEYS) associated with a prop called PEOPLE, and a BOOLEAN value that represents LOADING
  // No callbacks here
  // APP doesn't need to tell People WHY it's doing this stuff, i.e., doesn't need any LOGIC in itself - all it does is spit this info back to App, which then spreads the love/props as needed

  // Can make lots of dynamic conditional rendering using the props like below
  // ${props.loading}

  return (
    <div className={`loading-${props.loading}`}>
      <h3>Count: {props.count}</h3>
      <ul>
        {Object.keys(props.people).map((key, idx) => {
          return (
            <li key={idx}>
              <a href={props.people[key]}>{key}</a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default People;
