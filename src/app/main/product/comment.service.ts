import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { MyComment } from './mycomment.model';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class CommentService {

  comments: MyComment[];
  private commentsUpdated = new Subject<{comments: MyComment[]}>();

  constructor(private http: HttpClient) {}

  getComments(id: number) {
    this.http.get<{comments: any[]}>('http://localhost:3000/api/comments/' + id)
      .pipe(map(commentData => {
        return { transformedComments: commentData.comments.map( comments => {
          return {
            COMMENTDATE: new Date(comments.COMMENTDATE),
            USER_ID: comments.USER_ID,
            PRODUCT_ID: comments.PRODUCT_ID,
            CONTENT: comments.CONTENT
          };
        })};
      }))
      .subscribe(commentData => {
        this.comments = commentData.transformedComments;
        this.commentsUpdated.next({comments: this.comments});
      });
  }

  getCommentsUpdateListener() {
    return this.commentsUpdated.asObservable();
  }
}
