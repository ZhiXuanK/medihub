import { Injectable, inject } from "@angular/core"
import { AngularFireAuth } from "@angular/fire/compat/auth"
import { CanActivate, Router } from "@angular/router"
import { Observable, map, tap } from "rxjs"

@Injectable()
export class AuthGuard implements CanActivate {

    private afAuth = inject(AngularFireAuth)
    private router = inject(Router)

    canActivate(): Observable<boolean> {
        return this.afAuth.authState.pipe(
            map(user => !!user),
            tap(loggedIn =>{
                if (!loggedIn) {
                    console.log('Access denied, redirecting to login')
                    this.router.navigate(['/login'])
                }
            })
        )
    }
}