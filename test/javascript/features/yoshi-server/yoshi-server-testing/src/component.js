import React from 'react';
import { greet } from './api/greeting.api';

export default class App extends React.Component {
  state = { text: '' };
  async componentDidMount() {
    const { httpClient } = this.props;
    console.log('------------------------------------');
    console.log(httpClient);
    console.log('------------------------------------');
    const result = await httpClient.request(greet, 'Yaniv');
    this.setState({ text: result.greeting });
  }

  render() {
    return (
      <div>
        <h2 id="my-text">{this.state.text}</h2>
      </div>
    );
  }
}
