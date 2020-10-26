import React from 'react';
import Pet from '../Pet/Pet';
import People from '../People/People';
import AdoptionForm from '../Adoption_Form/AdoptionForm';
import PetsService from '../Services/pets-service';
import PeopleService from '../Services/people-service';
import './AdoptionPage.css';

export default class AdoptionPage extends React.Component {

  static defaultProps = {
    personTimeout: 5000,
  };

  state = {
    pets: {},
    people: [],
    name: '',
    error: '',
    adopted: '',
    personTimeout: null,
  };

  componentDidMount = () => {
    this.updateFields();
  };

  componentWillUnmount = () => {
    clearTimeout(this.state.personTimeout);
  }

  updateFields = () => {
    PetsService.getPets()
    .then(res => {
      this.setState({pets: res});
    })
    .catch(e => {
      this.setState({error: e});
    });
    PeopleService.getPeople()
    .then(res => {
      this.setState({people: res});
    })
    .catch(e => {
      this.setState({error: e});
    });
  }

  clearPerson = () => {
    const {people, name} = this.state;
    if(!name) {
      return;
    }
    if(people.length <= 1 && people[0] === name) {
      this.addPerson();
      return;
    }
    const type = (Math.random() < 0.5) ? 'dog' : 'cat';
    PetsService.deletePet(type)
    .then(() => {
      this.updateFields();
    })
    .catch(e => {
      this.setState({error: e});
    })
    .finally(() => {
      this.setState({personTimeout: setTimeout(this.clearPerson, this.props.personTimeout)});
    });
  }
  
  addPerson = () => {
    const {people, name} = this.state;
    if(!name || people.length >= 5) {
      return;
    }
    PeopleService.postPerson(`Person ${people.length}`)
    .then(() => {
      this.updateFields();
    })
    .catch(e => {
      this.setState({error: e});
    })
    .finally(() => {
      this.setState({personTimeout: setTimeout(this.addPerson, this.props.personTimeout)});
    });
  }

  submitName = (name) => {
    PeopleService.postPerson(name)
    .then(() => {
      this.updateFields();
      this.setState({
        name,
        personTimeout: setTimeout(this.clearPerson, this.props.personTimeout),
        adopted: '',
      });
    })
    .catch(e => {
      this.setState({error: e});
    });
  }

  adoptPet = (e, type) => {
    e.preventDefault();
    PetsService.deletePet(type)
    .then(() => {
      clearTimeout(this.state.personTimeout);
      this.updateFields();
      this.setState({
        name: '',
        adopted: 'You successfully adopted a pet!',
        personTimeout: null
      });
    })
    .catch(e => {
      this.setState({error: e});
    })
  };

  render() {
    const {pets, people, name, adopted} = this.state;
    return (
      <div className='wrapper'>
        <h1>Petful</h1>
        <div className='pets'>
          <div className='pet-section'>
            <Pet pet={pets.cat} />
            {people[0] === name && <button onClick={(e) => this.adoptPet(e, 'cat')}>Adopt</button>}
          </div>
          <div className='pet-section'>
            <Pet pet={pets.dog} />
            {people[0] === name && <button onClick={(e) => this.adoptPet(e, 'dog')}>Adopt</button>}
          </div>
        </div>
        {adopted && <h3>{adopted}</h3>}
        <People people={people}/>
        {!name && <AdoptionForm submitName={this.submitName}/>}
      </div>
    );
  };

}