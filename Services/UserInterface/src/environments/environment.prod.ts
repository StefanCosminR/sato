export const environment = {
    production: true,
    firebaseConfig: {
        apiKey: '<API_KEY>',
        authDomain: '<AUTH_DOMAIN>',
        databaseURL: '<DATABASE_URL>',
        projectId: '<PROJECT_ID>',
        storageBucket: '<STORAGE_BUCKET>',
        messagingSenderId: '<MESSAGING_SENDER_ID>',
        appId: '<APP_ID>'
    },
    apiEndpoints: {
        sparqlQuery: 'http://ec2-34-244-236-194.eu-west-1.compute.amazonaws.com:8080/sparql',
        userInterests: 'http://ec2-34-244-236-194.eu-west-1.compute.amazonaws.com:8095/user/interests'
    }
};
