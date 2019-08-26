import React, { Component} from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import Todos from './components/Todos';
import AddTodo from './components/AddTodo'
import Header from './components/layout/Header';
import About from './components/pages/About'
import './App.css';
import uuid from 'uuid';
import fire from './fire';


class App extends Component {
  constructor(props){
    super(props);
    this.state={
      todos: [{
        title: null,
        completed: null
      }]
    }
  }

  componentDidMount(){
    let todosRef = fire.database().ref('todos');
  
    todosRef.on('child_added', snapshot =>
    {
      console.log(snapshot.val())
      this.setState({todos: Array.from(snapshot.val())})
    })
  };
  
  // Toggles complete
  markComplete = (id) => {
    this.setState({
      todos: this.state.todos.map(todo => {
        if (todo.id === id) {
          todo.completed = !todo.completed;
        }
        return todo;
      })
    });
  };
  
  // Delete todo item
  delTodo = (id) => {
    fire.database().ref(`todos/${id}`).remove()
      .then(function(){
        this.setState({
          // Loop through todos array and filter out item with provided ID
          // ... is the spread operator, used here to copy the todos array
					todos: [...this.state.todos.filter((todo) => todo.id !== id)]
        })
      .catch(function(error){
        console.log("Remove failed: " + error.message);
      })
    });
  };
  
  // Add todo
  addTodo = (title) => {
    let id = uuid.v4();
    let database = fire.database();
    let todosRef = database.ref(`todos/${id}`);
    let newTodo = {
      id: this.id,
      title: title,
      completed: false
    }
    todosRef.set(newTodo).then(
      this.setState({todos: [...this.state.todos, newTodo]})
    );
  };

  render() {
		return (
			<Router>
				<div className='App'>
					<div className='container'>
						<Header />
						<Route
							exact
							path='/'
							render={(props) => (
								<React.Fragment>
									<AddTodo addTodo={this.addTodo} />
									<Todos
										todos={this.state.todos}
										markComplete={this.markComplete}
										delTodo={this.delTodo}
									/>
								</React.Fragment>
							)}
						/>
						<Route path='/about' component={About} />
					</div>
				</div>
			</Router>
		);
	}
};
export default App;