export default {
  install: (app) => {
    app.config.globalProperties.$success = function(title, text){
      app?.config.globalProperties.$Notification({type:"success", title, text, placement: 'bottom-right'});
    };
    app.config.globalProperties.$error = function(title, text){
      app?.config.globalProperties.$Notification({ type:"danger", title, text, placement: 'bottom-right'});
    };
    app.config.globalProperties.$warning = function(title, text){
      app?.config.globalProperties.$Notification({ type:"warning", title, text, placement: 'bottom-right'});
    };
    app.config.globalProperties.$message = function(title, text){
      app?.config.globalProperties.$Notification({ title, text, placement: 'bottom-right'});
    };
  }
}