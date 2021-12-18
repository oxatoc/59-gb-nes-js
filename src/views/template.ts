import { News } from '../news/news.interface';

export const newsTemplate = (news: News[]) => {
  if (news?.length === 0) {
    return emptyNews();
  }

  let html = '<div class="row">';

  for (const newsItem of news) {
    html += newsItemTemplate(newsItem);
  }

  html += '</div>';

  return html;
};

export const emptyNews = () => {
  return `<h1>Список новостей пуст!</h1>`;
};

export const newsItemTemplate = (newsItem: News, comments = '') => {
  return `
        <div class="col-lg-6">
          <div class="card">
            <img src='http://localhost:3000/${newsItem?.cover}' class="card-img-top" style="height: 200px; object-fit: cover;" alt=''>
            <div class="card-body">
              <h5 class="card-title">${newsItem.title}</h5>
              <h6 class="card-subtitle mb-2 text-muted">
                  Автор: ${newsItem.author}
              </h6>
              <h6 class="card-subtitle mb-2 text-muted">
                  Дата создания: ${newsItem.createdAt}
              </h6>
              <p class="card-text">${newsItem.description}</p>
              <div>${comments}</div>
            </div>
          </div>
        </div>
      `;
};

export const htmlTemplate = (body: string) => `
<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">

    <title>Hello, world!</title>
  </head>
  <body>
  <div class="container">
    ${body}
  </div>
    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
  </body>
</html>
`;
