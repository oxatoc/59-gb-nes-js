('use strict');

const e = React.createElement;

class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      name: 'dp',
      message: '',
    };

    // Парсим URL, извлекаем id новости
    this.idNews = parseInt(window.location.href.split('/').reverse()[1]);
    const bearerToken = localStorage.getItem('nest_access_token');
    // Указываем адрес сокет сервера
    this.socket = io('http://localhost:3001', {
      query: {
        newsId: this.idNews,
      },
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: 'Bearer ' + bearerToken,
          },
        },
      },
    });
  }

  componentDidMount() {
    this.getAllComments();
    // Указываем комнату
    this.socket.emit('create', this.idNews.toString());
    // Подписываемся на событие появления нового комментария
    this.socket.on('newComment', (message) => {
      const messages = this.state.messages;
      messages.push(message);
      this.setState(messages);
    });
    this.socket.on('removeComment', (payload) => {
      const { id } = payload;
      const messages = this.state.messages.filter((c) => c.id !== +id);
      this.setState({ messages });
    });
  }

  getAllComments = async () => {
    const response = await fetch(`/news-comments/all?idNews=${this.idNews}`, {
      method: 'GET',
    });

    if (response.ok) {
      const messages = await response.json();
      this.setState({ messages });
    }
  };

  onChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
  };

  sendMessage = () => {
    // Отправляем на сервер событие добавления комментария
    this.socket.emit('addComment', {
      idNews: this.idNews,
      name: this.state.name,
      message: this.state.message,
    });
  };

  render() {
    return (
      <div>
        {this.state.messages.map((message, index) => {
          return (
            <div key={message + index} className="card mb-1">
              <div className="card-body">
                <strong>{message.name}</strong>
                <div>{message.message}</div>
              </div>
            </div>
          );
        })}
        <div>
          <div className="form-floating mb-3">
            <input
              className="form-control"
              value={this.state.name}
              onChange={this.onChange}
              name="name"
              placeholder="Имя"
            />
            <label htmlFor="floatingInput">Имя</label>
          </div>
          <div className="form-floating mb-1">
            <textarea
              className="form-control"
              placeholder="Leave a comment here"
              value={this.state.message}
              name="message"
              onChange={this.onChange}
            ></textarea>
            <label htmlFor="floatingmessagearea2">Comments</label>
          </div>
          <button
            onClick={this.sendMessage}
            className="btn btn-outline-info btn-sm px-4 me-sm-3 fw-bold"
          >
            Send
          </button>
        </div>
      </div>
    );
  }
}
// Указываем блок с id = app, куда скрипт произведёт вставку вёрстке в методе render
const domContainer = document.querySelector('#app');
ReactDOM.render(e(Comments), domContainer);
