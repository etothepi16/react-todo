import React, { Component} from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import Todos from './components/Todos';
import AddTodo from './components/AddTodo'
import Header from './components/layout/Header';
import About from './components/pages/About'
import './App.css';
import fire from './fire';
import uuid from 'uuid';

class App extends Component {
  state = {
    todos: []
  };

  componentDidMount(){

    const todoItem ={
      id: null,
      title: '',
      completed: false
    };
    let todosArray = [];
    let todosRef = fire.database().ref('todos/');
    todosRef.once("value").then((snapshot) => {
        snapshot.forEach(function(childSnapshot){
          const todo = Object.create(todoItem)
          todo.id = childSnapshot.key;
          todo.title = childSnapshot.val().title;
          todo.completed = false;
          console.log(todo);
          todosArray.push(todo);
        })
     
        this.setState({todos: todosArray})
    })
  };
  // Toggles complete
  markComplete = (id) => {
    let todoRef = fire.database().ref(`todos/${id}`);
    this.setState({
      todos: this.state.todos.map(todo => {
        if (todo.id === id) {
          todo.completed = !todo.completed;
          todoRef.update({"completed":todo.completed});
        }
        return todo;
      })
    });
  };

  // Delete todo item
  delTodo = (id) => {
    fire.database().ref(`todos/${id}`).remove()
    this.setState({
      // Loop through todos array and filter out item with provided ID
      // ... is the spread operator, used here to copy the todos array
      todos: [...this.state.todos.filter((todo) => todo.id !== id)]
    })
  };

  // Add todo
  addTodo = (title) => {
    let id = uuid.v4();
    let database = fire.database();
    let todosRef = database.ref(`todos/${id}`);
    let newTodo = {
      id: id,
      title: title,
      completed: false
    }
    todosRef.set(newTodo).then(
      this.setState({
        todos: [...this.state.todos, newTodo]
      })
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