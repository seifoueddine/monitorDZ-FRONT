// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const url = 'https://api.mediasmonitoring.com'; 
//export const url = 'http://localhost:3000'; 
export const version = '/api/v1';
const apiVersion = url + version;
export const environment = {
  production: false,


  PAGE_SIZE: 10,
  PAGE_SIZE_MIN: 5,
  MAX_FILE_SIZE: 35,
  MAX_FILE_SIZE_ATTACHED: 16,
  SUPPORT_MAIL: 'test@email.com',
  URL_PATH: url,
  API_VERSION: apiVersion,
  ENDPOINTS: {
    SLUGS_PATH: apiVersion + '/slugs',
    SECTORS_PATH: apiVersion + '/sectors',
    MEDIA_PATH: apiVersion + '/media',
    CAMPAIGNS_PATH: apiVersion + '/campaigns',
    ARTICLES_PATH: apiVersion + '/articles',
    ARTICLES_FOR_SORTING_PATH: apiVersion + '/articles_for_sorting',
    TAGS_PATH: apiVersion + '/tags',
    CRAWLING_PATH: apiVersion + '/get_articles/crawling',
    AUTO_TAG_PATH: apiVersion + '/auto_tags',
    SEARCH_ARTICLES_PATH: apiVersion + '/search_article',
    USERS_PATH: apiVersion + '/users',
    CHANGE_PASSWORD_PATH: apiVersion + '/users/change_password/',
    CHANGE_STATUS_PATH: apiVersion + '/articles/change_status',
    CLIENT_ARTICLES_PATH: apiVersion + '/articles_client',
    AUTHORS_CLIENT_PATH: apiVersion + '/authors_client',
    AUTHORS_PATH: apiVersion + '/authors',
    LISTS_PATH: apiVersion + '/list_users',
    EXPORT_PDF_PATH: apiVersion + '/pdf_export',
    SEND_EMAIL_PATH: apiVersion + '/send_email',
    ARTICLE_BY_MEDIUM_PATH: apiVersion + '/articles_by_medium',
    ARTICLE_BY_AUTHOR_PATH: apiVersion + '/articles_by_author',
    ARTICLE_BY_TAG_PATH: apiVersion + '/articles_by_tag',
    ARTICLE_BY_DATE_PATH: apiVersion + '/articles_by_date',
    TAG_BY_DATE_PATH: apiVersion + '/tags_by_date',

    ARTICLE_CLIENT_BY_MEDIUM_PATH: apiVersion + '/articles_client_by_medium',
    ARTICLE_CLIENT_BY_AUTHOR_PATH: apiVersion + '/articles_client_by_author',
    ARTICLE_CLIENT_BY_TAG_PATH: apiVersion + '/articles_client_by_tag',
    ARTICLE_CLIENT_BY_DATE_PATH: apiVersion + '/articles_by_date',
    TAG_CLIENT_BY_DATE_PATH: apiVersion + '/tags_client_by_date',
    
  },






  apiUrl: 'https://api.coloredstrategies.com',
  defaultMenuType: 'menu-default',
  subHiddenBreakpoint: 1440,
  menuHiddenBreakpoint: 768,
  themeColorStorageKey: 'vien-themecolor',
  isMultiColorActive: false,
  /*
  Color Options:
  'light.blueyale', 'light.blueolympic', 'light.bluenavy', 'light.greenmoss', 'light.greenlime', 'light.yellowgranola', 'light.greysteel', 'light.orangecarrot', 'light.redruby', 'light.purplemonster'
  'dark.blueyale', 'dark.blueolympic', 'dark.bluenavy', 'dark.greenmoss', 'dark.greenlime', 'dark.yellowgranola', 'dark.greysteel', 'dark.orangecarrot', 'dark.redruby', 'dark.purplemonster'
  */
  defaultColor: 'light.blueyale',
  isDarkSwitchActive: true,
  defaultDirection: 'ltr',
  themeRadiusStorageKey: 'vien-themeradius',
  isAuthGuardActive: true,
  firebase: {
    apiKey: 'AIzaSyCqoNLB_jTw4nncO12qR-eDH9gAeWiZVaw',
    authDomain: 'vien-angular-login.firebaseapp.com',
    databaseURL: 'https://vien-angular-login.firebaseio.com',
    projectId: 'vien-angular-login',
    storageBucket: 'vien-angular-login.appspot.com',
    messagingSenderId: '16217062888',
    appId: '1:16217062888:web:6b08232ca0c9662fedb85d',
    measurementId: 'G-8ETT79WRRN'
  }
};
