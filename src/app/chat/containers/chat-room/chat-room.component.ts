import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { switchMap, take, takeUntil, tap, windowTime } from 'rxjs/operators';
import { PublishMessageComponent } from '../../components/publish-message/publish-message.component';
import { ChatMessagesService } from '../../lib';
import { Message } from '../../models';

@Component({
  selector: 'eb-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatRoomComponent
  implements AfterViewInit, AfterViewChecked, OnDestroy {
  private _destroy$$ = new Subject<void>();

  hasMessages$ = this._chatMessages._hasMessages$;

  @ViewChild('chatHistory')
  chatHistory: ElementRef<HTMLDivElement> | null = null;

  @ViewChild(PublishMessageComponent)
  messageBox: PublishMessageComponent | null = null;

  messages$: Observable<Message[]>;

  constructor(private _chatMessages: ChatMessagesService) {
    this.messages$ = this._chatMessages.connect();
  }

  ngAfterViewInit(): void {
    this._bindMessageBox();
  }

  ngAfterViewChecked(): void {
    if (!this.chatHistory || !this.chatHistory.nativeElement) {
      return;
    }
    this.chatHistory.nativeElement.scrollTop = this.chatHistory.nativeElement.scrollHeight;
  }

  ngOnDestroy(): void {
    this._destroy$$.next();
  }

  clearChatHistory() {
    this._chatMessages.clear();
  }

  private _bindMessageBox(): void {
    if (!this.messageBox) {
      return;
    }

    this.messageBox.send
      .pipe(
        takeUntil(this._destroy$$),
        windowTime(5000),
        switchMap(win => win.pipe(take(3))),
        switchMap(draft => this._chatMessages.publish(draft))
      )
      .subscribe();
  }
}
