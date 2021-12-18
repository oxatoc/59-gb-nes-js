import { News } from '../news/news.interface';
import { Comment } from '../news/comments/comment.interface';
import { htmlTemplate, newsItemTemplate } from './template';

export const templateDetail = (newsItem: News, comments: Comment[]) => {
  let html = '<div>';
  let commentsHtml = '';
  comments.forEach((comment) => {
    commentsHtml += commentTemplate(comment);
  });
  html += newsItemTemplate(newsItem, commentsHtml);
  html += '</div>';
  return htmlTemplate(html);
};

export const commentTemplate = (comment: Comment): string => {
  return `
    <div class='row'>
      <div class='col-2'>
        <img src="http://localhost:3000/${comment?.avatar}" alt='' style='width: 60px; object-fit: contain'>
      </div>
      <div class='col-5'>${comment.comment}</div>
      <div class='col-5'>
        <a href='/news-comments/${comment.id}'>Редактировать</a>
      </div>
    </div>
  `;
};
