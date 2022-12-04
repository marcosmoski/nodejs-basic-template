const { v4: uuidv4 } = require('uuid');

class User { 
  props = {};
  constructor(user) { 
    this.props = user;
    this.id = user.id;
    this.todos = user.todos;
  }

  set id (id) { 
    this.props.id = id ? id : uuidv4();
  }

  get id () { 
    return this.props.id;
  }

  set name (name) { 
    this.props.name = name;
  }

  get name () { 
    return this.props.name;
  }

  set username (username) { 
    this.props.username = username;
  }

  get username () { 
    return this.props.username;
  }

  set todos (todos) { 
    this.props.todos = todos ? todos : [];
  }

  get todos () { 
    return this.props.todos;
  }

  get userDef () { 
    return this.props;
  }

}

module.exports = User;