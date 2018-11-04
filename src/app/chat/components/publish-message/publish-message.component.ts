import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgxHotkeysService } from '@balticcode/ngx-hotkeys';

export interface MessageDraft {
  text: string;
  writtenAt: Date;
}

@Component({
  selector: 'eb-publish-message',
  templateUrl: './publish-message.component.html',
  styleUrls: ['./publish-message.component.scss']
})
export class PublishMessageComponent implements OnInit {
  @Output()
  send = new EventEmitter<MessageDraft>();
  messageField = new FormControl('', Validators.required);

  constructor(private _hotKeys: NgxHotkeysService) {
    this._registerHotkeys();
  }

  emitMessage(): boolean {
    this.send.emit({
      text: this.messageField.value,
      writtenAt: new Date()
    });

    return false;
  }

  ngOnInit() {}

  private _registerHotkeys() {
    this._hotKeys.register({
      combo: 'ctrl+enter',
      handler: () => this.emitMessage(),
      description: 'Send Message to Chat Partners'
    });
  }
}
