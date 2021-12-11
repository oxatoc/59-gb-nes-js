import { Comment } from './comment.interface';

export interface NewsComments {
  [idNews: number]: Comment[];
}
