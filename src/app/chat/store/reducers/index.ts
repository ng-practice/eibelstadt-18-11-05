import { ActionReducerMap } from '@ngrx/store';
import * as fromRoot from '../../../reducers';
import { ChatActions } from '../actions/chat.actions';
import * as fromChat from './chat.reducer';

/* You will consolidate all future state slices in this interface */
export interface ChatState {
  history: fromChat.ChatSlice;
}

/* This interface is needed since "taskboard" is the name of the feature we have generated before */
export interface State extends fromRoot.State {
  chat: ChatState;
}

export const reducers: ActionReducerMap<ChatState, ChatActions> = {
  history: fromChat.reducer
};
