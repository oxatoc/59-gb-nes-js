CREATE OR REPLACE FUNCTION find_news_by_id(news_id int) 
RETURNS TABLE(id int, title text, description text, cover text, createdAt timestamp, updatedAt timestamp, categoryId int, userId int)
LANGUAGE plpgsql
AS 
$$
BEGIN
  RETURN QUERY
  SELECT * FROM news WHERE news.id = @news_id;
END
$$;
