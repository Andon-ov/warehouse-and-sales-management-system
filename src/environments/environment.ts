import { initializeApp } from 'firebase/app';

export const environment = {
  firebaseConfig: {
    apiKey: "AIzaSyCVjQSeeko16GV7gW_1yiuffOe6EKScTAE",
    authDomain: "wsms-viki.firebaseapp.com",
    projectId: "wsms-viki",
    storageBucket: "wsms-viki.firebasestorage.app",
    messagingSenderId: "261562466951",
    appId: "1:261562466951:web:b4bbab85814afb506d2e22"
  },

  cloudinaryConfig: {
    cloudName: 'dsla98vyk',
    apiKey: '587566495847865',
    apiSecret: 'sJLzQzouizKo51b9Mv0bI8a5pCI',
    uploadPreset: 'the_natural_way',
  },
};
// Initialize Firebase
const app = initializeApp(environment.firebaseConfig);