# Scaffolding for Firebase Projects

This project provides the basic scaffolding for firebase projects using an angular frontend and a firebase function.
This projects and can be used as a template.

## Steps to scaffold a new Firebase project

### 1. Create Firebase project

Go to the [Firebase Console](https://console.firebase.google.com/). Click the gear icon next to project overview, create a new app and choose the type 'web'.

### 2. Resolve NodeJS dependency via Nix

Add default.nix to the top-level directory:
````sh
{ pkgs ? import <nixpkgs> {} }:
pkgs.mkShell {
  nativeBuildInputs = with pkgs; [ nodejs ];
}
````

### 3. Add NodeJS and Nix dependencies to path

Add .envrc to the top-level directory:
````sh
use nix
layout node
````

### 4. Install Firebase and initialize the project

````sh
npm install firebase-tools
````

Run firebase init and select the desired options (and optionally setup Github actions)

````sh
firebase init
````

### 5. Setup Angular frontend

Setup Angular frontend:

````sh
npm i @angular/cli
ng new frontend
````

Add angular fire dependency:

````sh
cd frontend
npm i @angular/fire
````

### 6. Add a Firebase function

Before enabling functions you have to upgrade your billing plan to "Blaze" (pay as you go).
Go to the firebase console, select the gear icon and select "Usage and billing". Upgrade to pay as you go.

Init firebase functions:

````sh
firebase init functions
````

Add AngularFireModule and AngularFireFunctionsModule to app.module.ts:

````ts
    import { AngularFireFunctionsModule, USE_EMULATOR as USE_FUNCTIONS_EMULATOR } from '@angular/fire/compat/functions';
    ...
    imports: [
      AngularFireModule.initializeApp(environment.firebase),
      AngularFireFunctionsModule,
    ...
    providers: [
      { provide: USE_FUNCTIONS_EMULATOR, useValue: environment.useEmulators ? ['localhost', 5001] : undefined },
    ],
````

Go to the firebase console and select "Add Firebase to your web app" from the project settings.
Select "Setup Firebase Hosting" and click "Register App". 
Copy the firebase config to environments/environment*.ts and set production / useEmulator flags according to target enviroments:

````ts
export const environment = {
  production: false,
  useEmulators: true,
  firebase: {
    apiKey: "AIzaSyBx1HNN0HzvKZhoYjOHQbGZ1Djm4xk6jS4",
    authDomain: "scaffolding-4c7fc.firebaseapp.com",
    projectId: "scaffolding-4c7fc",
    storageBucket: "scaffolding-4c7fc.appspot.com",
    messagingSenderId: "430139192949",
    appId: "1:430139192949:web:7f9f1d90c85cc5d2246a3c",
    measurementId: "G-24G3PBH5D0"
  }
}
````

Add the firebase function call:

````ts
  // in a service:
 constructor(public readonly functions: AngularFireFunctions) { }

  get(name: string): Observable<Hello> {
    return this.functions.httpsCallable(endpoint, { timeout: 5_000 })({ name: name })
  }
````

### 7. Add authentication

We want to ensure that only authenticated users can access the Firestore database, thus we add the minimal firebase auth hooks:

````ts
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

export class AppComponent {
  constructor(public auth: AngularFireAuth) {
  }

  login() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  
  logout() {
    this.auth.signOut();
  }
}
````

The minimal HTML fragment:
````html
    <div *ngIf="auth.user | async as user; else showLogin">
      <h1>Hello {{ user.displayName }}!</h1>
      ...
      <button (click)="logout()">Logout</button>
    </div>
    <ng-template #showLogin>
      <p>Please login.</p>
      <button (click)="login()">Login with Google</button>
    </ng-template>
````

Add AngularFireAuthModule to app.module.ts:

````ts
    import { AngularFireAuthModule, USE_EMULATOR as USE_AUTH_EMULATOR } from '@angular/fire/compat/auth';
    ...
    imports: [
      AngularFireModule.initializeApp(environment.firebase),
      AngularFireFunctionsModule,
    ...
    providers: [
      { provide: USE_AUTH_EMULATOR, useValue: environment.useEmulators ? ['localhost', 9099] : undefined },
    ],
````

Launch the emulator setup wizard and ensure the authentication and firestore emulators are enabled:

````sh
firebase init functions

# launch the emulators
firebase emulators:start
````
### 8. Setup Github Action for deployment

Create a token to use for the Github action and add it as a secret to Github:

````sh
firebase login:ci
````

Create/modify the github workflow as follows:

````yml
name: Deploy to Firebase Hosting on merge
'on':
  push:
    branches:
      - main
jobs:
  hosting_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: build frontend
        run: npm ci && npm run build
        working-directory: frontend
      - name: deploy frontend
        run: npm ci && ./node_modules/.bin/firebase deploy --only hosting --token ${{ secrets.FIREBASE_SERVICE_ACCOUNT_SCAFFOLDING_4C7FC }}
  functions_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - name: build function
        run: npm ci && npm run build
        working-directory: functions
      - name: deploy function
        run: npm ci && ./node_modules/.bin/firebase deploy --only functions --token ${{ secrets.FIREBASE_SERVICE_ACCOUNT_SCAFFOLDING_4C7FC }}
````

## Development Cycle

### Development Angular application

In the `frontend` directory, run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

To launch the emulator for the firebase services run: `firebase emulators:start` in the top-level directory.

### Development Firebase function

In the `functions` directory, run `npm run start` to start the function locally in the emulator.
