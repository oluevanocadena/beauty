import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouterService {

  constructor(
    private router: Router,
  ) {

  }

  /**
   * Navega hacia la pagina de indicada.
   */
  goTo(route: string, extras?: NavigationExtras) {
    this.router.navigate([route], extras);
  }


  /**
   * Navega hacia la pagina de indicada.
   * @param route | Navega hacia la pagina de indicada.
   */
  navigate(route: string) {
    window.location.href = route;
  }

  /**
   * Navega hacia la pagina de inicio de sesión.
   */
  goToHome() {
    this.router.navigate([Routes.Home]);
  }

  /**
   * Navega hacia la pagina de inicio de sesión.
   */
  goToLogin() {
    this.router.navigate([Routes.Login]);
  }

  /**
   * Navega hacia la pagina de inicio de sesión.
   */
  goToNotFound() {
    this.router.navigate([Routes.NotFound]);
  }

  /**
 * Navega hacia la pagina de inicio de sesión.
 */
  goToLogout() {
    this.router.navigate([Routes.Logout]);
  }

}


export const Routes = {
  Landing: "/",
  Contact: "/contact",
  Home: "/home",
  Login: "/login",
  Profile: "/profile",
  RecoverPassword: "/recover-password",
  Register: "/register",
  Settings: "/settings",
  Support: "/support",
  Logout: "/logout",
  NotFound: "/not-found"
}
