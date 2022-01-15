('use strict');

const e = React.createElement;
class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      messages: [],
      profile: null,
    };
    // Парсим URL, извлекаем id новости
    this.idNews = parseInt(window.location.href.split('/').reverse()[1]);
    this.commentsController = new CommentsController();
    this.profileController = new ProfileController();
    this.socketController = new SocketController({
      newsId: this.idNews,
      onNew: this.handleSocketNew,
      onRemove: this.handleSocketRemove,
      onUpdate: this.handleSocketUpdate,
    });
    this.userService = new UserService();
  }

  componentDidMount() {
    this.commentsController.getAllComments(this.idNews).then((messages) => {
      this.setState({ messages });
    });
    this.profileController.getProfile().then((profile) => {
      this.setState({ profile });
    });
  }

  handleClickSend = (event) => {
    if (this.state.message) {
      this.socketController.add(this.idNews, this.state.message);
      this.setState({ message: '' });
    }
  };

  handleSocketNew = (message) => {
    this.setState({ messages: [...this.state.messages, message] });
  };
  handleSocketRemove = (idComment) => {
    this.setState({
      messages: this.state.messages.filter(
        (message) => message.id !== +idComment,
      ),
    });
  };
  handleSocketUpdate = (comment) => {
    const index = this.state.messages.findIndex(
      (message) => message.id === comment.id,
    );
    if (index >= 0) {
      this.state.messages[index] = comment;
      this.setState({ messages: [...this.state.messages] });
    }
  };

  render() {
    return (
      <div>
        {this.state.messages
          .sort((a, b) =>
            a.createdAt === b.createdAt
              ? 0
              : a.createdAt > b.createdAt
              ? -1
              : 1,
          )
          .map((message, index) => {
            return (
              <div key={message + index} className="card mb-1">
                <Comment
                  message={message}
                  isEditable={
                    this.state.profile
                      ? this.state.profile.id === message.user.id
                      : false
                  }
                  onDelete={() => this.socketController.delete(message.id)}
                  onSave={(idComment, comment) =>
                    this.socketController.update(idComment, comment)
                  }
                />
              </div>
            );
          })}
        <div>
          <div>
            <b>{this.userService.getName(this.state.profile)}</b>
          </div>
          <div className="form-floating mb-1">
            <textarea
              className="form-control"
              placeholder="Leave a comment here"
              value={this.state.message}
              name="message"
              onChange={(event) =>
                this.setState({ message: event.target.value })
              }
            />
            <label htmlFor="floatingmessagearea2">Comments</label>
          </div>
          <button
            onClick={this.handleClickSend}
            className="btn btn-outline-info btn-sm px-4 me-sm-3 fw-bold"
          >
            Send
          </button>
        </div>
      </div>
    );
  }
}

function Comment({ message, isEditable, onDelete, onSave }) {
  const [isEdit, setEdit] = React.useState(false);
  const [newMessage, setMessage] = React.useState('');
  const userService = new UserService();

  const handleDelete = React.useCallback(() => {
    if (confirm(`Удалить комментарий id = '${message.id}'?`)) {
      onDelete();
    }
  });

  const handleSave = React.useCallback(() => {
    onSave(message.id, newMessage);
    setEdit(false);
  });

  const toggleEdit = React.useCallback(() => {
    if (!isEditable) {
      return;
    }
    setMessage(message.message);
    setEdit(!isEdit);
  });

  return (
    <div>
      <div className="row">
        <div className="col-3">
          <b>{userService.getName(message.user)}</b>
        </div>
        {isEditable && (
          <div className="col-3">
            <BaseButton caption="Delete" handleClick={handleDelete} />
          </div>
        )}
        {!isEdit && isEditable && (
          <div className="col-6">
            <BaseButton caption="Edit" handleClick={toggleEdit} />
          </div>
        )}
        {isEdit && (
          <div className="col-3">
            <BaseButton caption="Save" handleClick={handleSave} />
          </div>
        )}
        {isEdit && (
          <div className="col-3">
            <BaseButton caption="Cancel" handleClick={toggleEdit} />
          </div>
        )}
      </div>
      <div className="row">
        {!isEdit && <div className="col text-primary">{message.message}</div>}
        {isEdit && (
          <input
            className="w-100"
            name="updated-message"
            onChange={(event) => setMessage(event.target.value)}
            value={newMessage}
            type="text"
          />
        )}
      </div>
    </div>
  );
}

function BaseButton({ caption, handleClick }) {
  return (
    <button
      className="w-100 btn btn-outline-secondary btn-sm"
      type="button"
      onClick={handleClick}
    >
      {caption}
    </button>
  );
}

class CommentsController {
  constructor() {
    this.httpService = new HttpService();
  }
  async getAllComments(idNews) {
    return this.httpService.get(`/news-comments/all?idNews=${idNews}`);
  }
}

class ProfileController {
  constructor() {
    this.httpService = new HttpService();
  }
  getProfile() {
    return this.httpService.get('/profile');
  }
}

class HttpService {
  get(url) {
    return fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('nest_access_token')}`,
      },
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      return null;
    });
  }
}

class SocketController {
  constructor({ newsId, onNew, onRemove, onUpdate }) {
    this.socket = io('http://localhost:3001', {
      query: {
        newsId,
      },
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization:
              'Bearer ' + localStorage.getItem('nest_access_token'),
          },
        },
      },
    });
    // Подписываемся на событие появления нового комментария
    this.socket.on('newComment', (comment) => {
      onNew(comment);
    });
    this.socket.on('removeComment', (payload) => {
      const { id } = payload;
      onRemove(id);
    });
    this.socket.on('updateComment', (payload) => {
      const { comment } = payload;
      onUpdate(comment);
    });
  }
  add(idNews, message) {
    // Отправляем на сервер событие добавления комментария
    return this.socket.emit('addComment', {
      idNews,
      message,
    });
  }
  delete(idComment) {
    return this.socket.emit('removeComment', {
      idComment,
    });
  }
  update(idComment, message) {
    return this.socket.emit('updateComment', {
      idComment,
      message,
    });
  }
}

class UserService {
  getName(user) {
    let name = '';
    if (user) {
      name += user.firstName;
      name += ' ';
      name += user.lastName;
    }
    return name;
  }
}

// Указываем блок с id = app, куда скрипт произведёт вставку вёрстке в методе render
const domContainer = document.querySelector('#app');
ReactDOM.render(e(Comments), domContainer);
