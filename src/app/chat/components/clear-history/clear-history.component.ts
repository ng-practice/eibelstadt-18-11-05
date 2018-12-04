import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'eb-clear-history',
  templateUrl: './clear-history.component.html',
  styleUrls: ['./clear-history.component.scss']
})
export class ClearHistoryComponent {
  @Input()
  hasMessages = false;

  @Output()
  clear = new EventEmitter<void>();
}
