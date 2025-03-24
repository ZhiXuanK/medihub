import { inject, Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import firebase from "firebase/compat/app";
import { firstValueFrom, map, Observable } from "rxjs";


@Injectable()
export class AuthService {
    private afAuth = inject(AngularFireAuth)

    loginWithGoogle() {
        return this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }

    signUp(email: string, password: string) {
        return this.afAuth.createUserWithEmailAndPassword(email, password);
    }

    signIn(email: string, password: string) {
        return this.afAuth.signInWithEmailAndPassword(email, password);
    }

    getCurrentUserId$(): Promise<string> {
        return this.afAuth.currentUser
            .then(
                user => user!.uid
            )
    }

    getAuthState$():Observable<firebase.User | null>{
        return this.afAuth.authState;
    }

    logout() {
        return this.afAuth.signOut();
    }
}