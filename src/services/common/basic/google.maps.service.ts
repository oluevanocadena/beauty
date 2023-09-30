import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {

  key: string = environment.googleMapsKey;

  constructor() {

  }

  loadGoogleMaps(): Promise<void> {
    return new Promise<void>((resolve) => {
      // Elimina la biblioteca de Google Maps existente si la hay
      this.removeGoogleMapsScript();
      console.log('Google Maps JavaScript API is not loaded. Try to reload it...');

      // Carga la biblioteca de Google Maps de forma asincrónica
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.key}&libraries=places`; // Reemplaza YOUR_API_KEY con tu clave de API
      script.onload = () => {
        resolve();
        console.log('Google Maps JavaScript API is loaded.');
      };
      document.body.appendChild(script);


    });
  }

  removeGoogleMapsScript() {
    const scripts = document.getElementsByTagName('script');
    for (let i = scripts.length - 1; i >= 0; i--) {
      if (scripts[i].src && scripts[i].src.includes('maps.googleapis.com')) {
        // Elimina el script de Google Maps
        scripts[i].parentNode.removeChild(scripts[i]);
      }
    }
  }
}
