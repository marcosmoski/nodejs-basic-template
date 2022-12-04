const express = require('express');
const cors = require('cors');
const User = require('./User')
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(cors());
app.use(express.json());

const users = [
  {
    "name": "dummyUser",
    "username": "dummy",
    "id": "8866b853-588d-4f7c-a54b-47c49add0dde",
    "todos": [
      {
          "id": "1f4a8716-aa1c-4c22-af28-e5b4c754fcab",
          "title": "Dummy todo",
          "done": false,
          "deadline": "2022-12-12T00:00:00.000Z",
          "created_at": "2022-12-04T14:09:30.200Z"
      }
    ]
  }
];

function checksExistsUserAccount(request, response, next) {
  const {username} = request.headers;
  if (!username) { 
    return response.status(403).send({
      error: 'Not authorized'
    });
  }
  
  const userExists = users.find((user) => { 
    return user.username === username;
  })

  if (userExists) {
    response.userFounded = userExists;
    next();
  } else { 
    return response.status(404).json({
      error: 'User not founded.'
    })
  }
}

app.post('/users', async (request, response) => {
  const {name, username} = request.body;

  const userExists = await users.find((user) => { 
    return user.username === username;
  })

  if (userExists) {
    return response.status(400).json({
     error:'Username already exists.'
    })
  }

  const user = new User( {name, username })
  try { 
    users.push({ ...user.userDef });
    return response.status(201).json({...user.userDef }) 
  } catch (err) { 
    throw new Error({error: 'Something went wrong while we was inserting the user, please try again.'})
  }
  // Complete aqui
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const {username} = request.headers;
  const userEditTodos = users.find((user) => {
    return user.username === username;
  })
  response.status(200).json(userEditTodos.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {username} = request.headers;
  const {deadline, title} = request.body;
  const userEditTodos = users.find((user) => {
    return user.username === username;
  })
  const todo = {
    id: uuidv4(), 
    title, 
    done: false, 
    deadline: new Date(deadline), 
    created_at: new Date()
  }

  userEditTodos.todos.push(todo);

  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {username} = request.headers;
  const {deadline, title} = request.body;
  const {id} = request.params;

  const userEditTodos = users.find((user) => {
    return user.username === username;
  });

  let findTodoById = userEditTodos.todos.findIndex((todo) => {
    return todo.id === id;
  });

  if (findTodoById === -1) {
    return response.status(404).send({error: "Todo no founded"})
  }

  userEditTodos.todos[findTodoById] = {
    ...userEditTodos.todos[findTodoById],
    deadline,
    title
  }

  return response.json(userEditTodos.todos[findTodoById]);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const {username} = request.headers;
  const {id} = request.params;

  const userEditTodos = users.find((user) => {
    return user.username === username;
  });

  let findTodoById = userEditTodos.todos.findIndex((todo) => {
    return todo.id === id;
  });

  if (findTodoById === -1) {
    return response.status(404).send({error: "Todo no founded"})
  }

  userEditTodos.todos[findTodoById] = {
    ...userEditTodos.todos[findTodoById],
    done: true
  }

  return response.json(userEditTodos.todos[findTodoById]);

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {username} = request.headers;
  const {id} = request.params;

  const userEditTodos = users.find((user) => {
    return user.username === username;
  });

  let findTodoById = userEditTodos.todos.findIndex((todo) => {
    return todo.id === id;
  });

  if (findTodoById === -1) {
    return response.status(404).send({error: "Todo no founded"})
  }
  
  userEditTodos.todos.splice(findTodoById, 1);

  return response.status(204).end();
});

module.exports = app;