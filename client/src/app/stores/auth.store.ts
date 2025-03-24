
import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { AuthStatus } from "../models";

const INIT_STORE:AuthStatus = {
    status: false,
    response: null,
    uid: null
}


@Injectable()
export class AuthStore extends ComponentStore<AuthStatus> {

    constructor(){
        super(INIT_STORE)
    }

    //selectors
    readonly status$ = this.select(state => state.status)
    readonly response$ = this.select(state => state.response)
    readonly userId$ = this.select(state => state.uid)
    readonly authStatus$ = this.select(state => state)

    //update auth status and response
    readonly setAuthStatus = this.updater<{response: any, uid: string|null}>(
        (state, {response, uid}) => ({
            ...state,
            status: true,
            response: response,
            uid: uid
        })
    )

    //clear auth state for signout
    readonly clearAuth = this.updater(
        () => ({
            status: false,
            response: null,
            uid:null
        })
    )

}