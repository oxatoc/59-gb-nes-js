('use strict');

const e = React.createElement;
class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
    this.commentsController = new CommentsController();
    // Парсим URL, извлекаем id новости
    this.idNews = parseInt(window.location.href.split('/').reverse()[1]);
  }

  componentDidMount() {
    this.commentsController.getAllComments(this.idNews).then((messages) => {
      this.setState({ messages });
    });
  }

  render() {
    return (
      <div>
        {this.state.messages.map((message, index) => {
          return (
            <div key={message + index} className="card mb-1">
              <Comment message={message} />
            </div>
          );
        })}
      </div>
    );
  }
}

function Comment({ message }) {
  const { useState } = React;
  const [isEdit, setEdit] = useState(false);
  const getName = (user) => {
    let name = '';
    if (user) {
      name += user.firstName;
      name += ' ';
      name += user.lastName;
    }
    return name;
  };
  return (
    <div>
      <div className="row">
        <div className="col-3">
          <b>{getName(message.user)}</b>
        </div>
        <div className="col-3">
          <BaseButton caption="Удалить" />
        </div>
        {!isEdit && (
          <div className="col-6">
            <BaseButton caption="Редактировать" />
          </div>
        )}
        {isEdit && (
          <div className="col-3">
            <BaseButton caption="Сохранить" />
          </div>
        )}
        {isEdit && (
          <div className="col-3">
            <BaseButton caption="Отменить" />
          </div>
        )}
      </div>
    </div>
  );
}

function BaseButton({ caption, handleClick = null }) {
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
  async getAllComments(idNews) {
    const response = await fetch(`/news-comments/all?idNews=${idNews}`, {
      method: 'GET',
    });

    if (response.ok) {
      const comments = await response.json();
      return comments.sort((a, b) =>
        a.createdAt === b.createdAt ? 0 : a.createdAt > b.createdAt ? -1 : 1,
      );
    }
    return null;
  }
}

class SocketController {
  constructor() {
    this.bearerToken = localStorage.getItem('nest_access_token');
    this.socket = io('http://localhost:3001', {
      query: {
        newsId: this.idNews,
      },
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: 'Bearer ' + this.bearerToken,
          },
        },
      },
    });
  }
}

// class Comments extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       messages: [],
//       message: '',
//       profile: null,
//       updatedMessage: '',
//       editMessageId: -1,
//     };
//
//     // Парсим URL, извлекаем id новости
//     this.idNews = parseInt(window.location.href.split('/').reverse()[1]);
//     this.bearerToken = localStorage.getItem('nest_access_token');
//     // Указываем адрес сокет сервера
//     this.socket = io('http://localhost:3001', {
//       query: {
//         newsId: this.idNews,
//       },
//       transportOptions: {
//         polling: {
//           extraHeaders: {
//             Authorization: 'Bearer ' + this.bearerToken,
//           },
//         },
//       },
//     });
//   }
//
//   componentDidMount() {
//     this.getAllComments();
//     this.getProfile();
//     // Указываем комнату
//     // this.socket.emit('create', this.idNews.toString());
//     // Подписываемся на событие появления нового комментария
//     this.socket.on('newComment', (message) => {
//       const messages = this.state.messages;
//       messages.push(message);
//       this.setState(messages);
//     });
//     this.socket.on('removeComment', (payload) => {
//       const { id } = payload;
//       this.removeComment(id);
//     });
//     this.socket.on('updateComment', (payload) => {
//       const { comment } = payload;
//       const messages = this.state.messages;
//       const index = messages.findIndex((message) => message.id === comment.id);
//       if (index >= 0) {
//         messages[index] = comment;
//         this.setState(messages);
//       }
//     });
//   }
//
//   removeComment = (commentId) => {
//     const messages = this.state.messages.filter((c) => c.id !== +commentId);
//     this.setState({ messages });
//   };
//
//   getProfile = async () => {
//     const response = await fetch('/profile', {
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${this.bearerToken}`,
//       },
//     });
//     if (response.ok) {
//       const profile = await response.json();
//       this.setState({ profile });
//     }
//   };
//
//   getAllComments = async () => {
//     const response = await fetch(`/news-comments/all?idNews=${this.idNews}`, {
//       method: 'GET',
//     });
//
//     if (response.ok) {
//       const messages = await response.json();
//       this.setState({ messages });
//     }
//   };
//
//   onChange = ({ target: { name, value } }) => {
//     this.setState({ [name]: value });
//   };
//
//   sendMessage = () => {
//     // Отправляем на сервер событие добавления комментария
//     this.socket.emit('addComment', {
//       idNews: this.idNews,
//       // name: this.state.name,
//       message: this.state.message,
//     });
//   };
//
//   handleChange = (event) => {
//     this.setState({ updatedMessage: event.target.value });
//     // this.socket.emit('updateComment', {
//     //   idComment,
//     //   message: event.target.value,
//     // });
//   };
//
//   getName = (profile) => {
//     let name = '';
//     if (profile) {
//       name += profile.firstName;
//       name += ' ';
//       name += profile.lastName;
//     }
//     return name;
//   };
//   isCurrentUser = (profile) => {
//     if (!this.state.profile || !profile) {
//       return false;
//     }
//     return this.state.profile.id === profile.id;
//   };
//
//   handleDelete = async (idComment) => {
//     this.socket.emit('removeComment', {
//       idComment,
//     });
//   };
//
//   toggleEditMode = (editMessageId, message = null) => {
//     this.setState({ editMessageId });
//     if (editMessageId > 0) {
//       this.state.updatedMessage = message;
//     }
//   };
//
//   updateMessage = (event) => {
//     console.log('update', this.state.editMessageId, this.state.updatedMessage);
//   };
//
//   render() {
//     return (
//       <div>
//         {this.state.messages.map((message, index) => {
//           return (
//             <div key={message + index} className="card mb-1">
//               <div className="card-body">
//                 <div className="row">
//                   <div className="col-3">
//                     <strong>{this.getName(message.user)}</strong>
//                   </div>
//                   <div className="col-3">
//                     {this.isCurrentUser(message.user) && (
//                       <button
//                         className="w-100 btn btn-outline-secondary btn-sm"
//                         type="button"
//                         onClick={() => this.handleDelete(message.id)}
//                       >
//                         Del
//                       </button>
//                     )}
//                   </div>
//                   <div className="col-3">
//                     {this.isCurrentUser(message.user) &&
//                       this.state.editMessageId !== message.id && (
//                         <button
//                           className="w-100 btn btn-outline-secondary btn-sm"
//                           type="button"
//                           onClick={() => {
//                             this.toggleEditMode(message.id, message.message);
//                           }}
//                         >
//                           Edit
//                         </button>
//                       )}
//                     {this.isCurrentUser(message.user) &&
//                       this.state.editMessageId === message.id && (
//                         <button
//                           className="w-100 btn btn-outline-secondary btn-sm"
//                           type="button"
//                           onClick={this.updateMessage}
//                         >
//                           Save
//                         </button>
//                       )}
//                   </div>
//                   <div className="col-3">
//                     {this.isCurrentUser(message.user) &&
//                       this.state.editMessageId === message.id && (
//                         <button
//                           className="w-100 btn btn-outline-secondary btn-sm"
//                           type="button"
//                           onClick={() => {
//                             this.toggleEditMode(-1);
//                           }}
//                         >
//                           Cancel
//                         </button>
//                       )}
//                   </div>
//                 </div>
//                 <div className="row">
//                   <div className="col">
//                     {this.state.editMessageId !== message.id && message.message}
//                     {this.state.editMessageId === message.id && (
//                       <input
//                         data-id={message.id}
//                         name="updated-message"
//                         onChange={this.handleChange}
//                         value={this.state.updatedMessage}
//                         type="text"
//                       />
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//         <div>
//           <div className="form-floating mb-3">
//             <input
//               className="form-control"
//               value={this.getName(this.state.profile)}
//               onChange={this.onChange}
//               name="name"
//               placeholder="Имя"
//             />
//             <label htmlFor="floatingInput">Имя</label>
//           </div>
//           <div className="form-floating mb-1">
//             <textarea
//               className="form-control"
//               placeholder="Leave a comment here"
//               value={this.state.message}
//               name="message"
//               onChange={this.onChange}
//             ></textarea>
//             <label htmlFor="floatingmessagearea2">Comments</label>
//           </div>
//           <button
//             onClick={this.sendMessage}
//             className="btn btn-outline-info btn-sm px-4 me-sm-3 fw-bold"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     );
//   }
// }
// Указываем блок с id = app, куда скрипт произведёт вставку вёрстке в методе render
const domContainer = document.querySelector('#app');
ReactDOM.render(e(Comments), domContainer);
