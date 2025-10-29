import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

window.addEventListener('online', (event) => { console.log("Your are online",event)});
window.addEventListener('offline', (event) => { console.log("You lossed connection",event)});

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
