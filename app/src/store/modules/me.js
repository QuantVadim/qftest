import axios from 'axios';
import conf from '@/conf.js';

export default ({
  //namespaced: true,
  state: {
    data: {}
  },
  mutations: {
    SET_USER(state, user) {
      state.data = user;
    }
  },
  actions: {
    async LOAD_USER(ctx) {
      let obj = {
        q: 'login',
        data: {
          usr_id: localStorage.getItem('usr_id'),
          mykey: localStorage.getItem('mykey'),
        }
      };
      console.log(obj);
      axios.post(conf.API, obj).then(itm => {
        console.log(itm.data);
        if(itm.data.data){
          ctx.commit('SET_USER', itm.data.data);
        }
      });
    }
  },
  getters:{
    MYID(state){
      return state.data?.usr_id | false; 
    }
  },
  modules: {
  }
})