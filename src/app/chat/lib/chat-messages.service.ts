import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { UserService } from 'src/app/authentication/lib';
import { newGuid } from 'ts-guid';
import { Message, MessageDraft } from '../models';

export enum ChatEvent {
  RequestHistory = '[Chat:Client] Load messages from history',
  HistoryLoaded = '[Chat] All past messages have been loaded',
  PublishMessage = '[Chat:Client] Publish message to the channel',
  MessageReceived = '[Chat] A new message has been published',
  ClearHistory = '[Chat:Client] Remove messages from history'
}

@Injectable({
  providedIn: 'root'
})
export class ChatMessagesService {
  private _incomingMessage$: Observable<Message>;
  private _history$: Observable<Message[]>;

  private _messages$$ = new BehaviorSubject<Message[]>([]);

  _hasMessages$ = this._messages$$.pipe(map(messages => messages.length > 0));

  constructor(private _socket: Socket, private _user: UserService) {
    this._history$ = this._socket.fromEvent(ChatEvent.HistoryLoaded);
    this._incomingMessage$ = this._socket.fromEvent(ChatEvent.MessageReceived);
  }

  connect(): Observable<Message[]> {
    this._socket.emit(ChatEvent.RequestHistory);

    return merge(this._history$, this._incomingMessage$).pipe(
      mergeMap<Message | Message[], Message[]>(m => this._updateMessages(m))
    );
  }

  /* Needed for NgRx
   * We will split connect() into two parts due the use of Actions
  */
  history(): Observable<Message[]> {
    return this._history$;
  }

  /* Needed for NgRx
   * We will split connect() into two parts due the use of Actions
   */
  receiveMessage(): Observable<Message> {
    return this._incomingMessage$;
  }

  publish(draft: MessageDraft): Observable<void> {
    return this._user.current().pipe(
      map(userName =>
        this._socket.emit(ChatEvent.PublishMessage, {
          guid: newGuid(),
          ...draft,
          writtenBy: userName
        } as Message)
      )
    );
  }

  clear(): void {
    this._socket.emit(ChatEvent.ClearHistory);
    this._messages$$.next([]);
  }

  private _updateMessages(
    singleOrCollection: Message | Message[]
  ): Observable<Message[]> {
    Array.isArray(singleOrCollection)
      ? this._messages$$.next(singleOrCollection)
      : this._messages$$.next([...this._messages$$.value, singleOrCollection]);

    return this._messages$$.asObservable();
  }
}
