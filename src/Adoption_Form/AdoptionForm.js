import React from 'react';

export default class AdoptionForm extends React.Component {

  static defaultProps = {submitName: () => {}};
  
  state = {name: ''};

  setName = (name) => {
    this.setState({name});
  }

  submit = (e) => {
    e.preventDefault();
    this.props.submitName(this.state.name);
  }

  render() {
    return (
      <form onSubmit={(e) => this.submit(e)}>
        <h2>Register for adoption</h2>
        <label htmlFor='name'>Name:</label>
        <input required name='name' type='text' value={this.state.name} onChange={(e) => this.setName(e.currentTarget.value)}/>
        <input type='submit'/>
      </form>
    );
  }
}