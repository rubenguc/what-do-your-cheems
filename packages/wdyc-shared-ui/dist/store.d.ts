import * as zustand from 'zustand';
import { User, LoginState } from 'wdyc-interfaces';

interface GlobalState {
    user: User;
    login: LoginState;
    clear: () => void;
    startRoom: () => void;
}
declare const useStore: zustand.UseBoundStore<zustand.StoreApi<GlobalState>>;

export { GlobalState, useStore as default };
