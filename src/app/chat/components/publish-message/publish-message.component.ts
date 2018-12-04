import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MessageDraft } from '../../models';

@Component({
  selector: 'eb-publish-message',
  templateUrl: './publish-message.component.html',
  styleUrls: ['./publish-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublishMessageComponent {
  @Output()
  send = new EventEmitter<MessageDraft>();
  messageField = new FormControl('', Validators.required);

  emitMessage(): boolean {
    if (!this.messageField.valid) {
      return false;
    }

    this.send.emit({
      text: this.messageField.value,
      writtenAt: new Date()
    });

    // this.messageField.reset();

    return false;
  }
}
