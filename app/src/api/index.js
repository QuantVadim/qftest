import BaseAPI from "./BaseAPI.js";
import conf from "@/conf";

export default {
  install: (app) => {
    app.config.globalProperties.api = BaseAPI;
    app.config.globalProperties.apiurl = conf.API;
    app.config.globalProperties.conf = conf;
    app.config.globalProperties.getUser = 
      function(){return {usr_id: localStorage.getItem('usr_id'), mykey: localStorage.getItem('mykey')}};
  }
}

export function getUser(){
  return {usr_id: localStorage.getItem('usr_id'), mykey: localStorage.getItem('mykey')}
}