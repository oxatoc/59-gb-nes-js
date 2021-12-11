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
      <div class='col-7'>${comment.comment}</div>
      <div class='col-5'>
        <a href='/news-comments/${comment.id}'>Редактировать</a>
      </div>
    </div>
  `;
};
