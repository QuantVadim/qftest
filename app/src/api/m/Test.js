
import { getUser } from "..";
import conf from "@/conf";
import axios from "axios";
//Объект нигде не используется МОЖНО УДАЛИТЬ
//Объект нигде не используется МОЖНО УДАЛИТЬ
//Объект нигде не используется МОЖНО УДАЛИТЬ
export default{
  SendTest(test){//Возвращает объект id результата
    let obj = {
      q: 'test_send',
      me: getUser(),
      test,
    }
    axios.post(conf.API, obj).then(itm => {
      console.log('Отправляется тест', itm.data);
      if(itm.data?.data){
        return itm.data?.data //id рузультата
      }
    });
  },
  Load(id){//Возвращает объект теста
    let obj = {
      q: 'get_test_basic',
      me: getUser(),
      test_id: id,
    }
    axios.post(conf.API, obj).then(itm => {
      console.log(itm.data);
      if(itm.data?.data){
        return JSON.parse(JSON.stringify(itm.data.data));
      }
    });
  },
  GLoad(gid){//Возвращает объект теста
    let obj = {
      q: 'get_test_basic',
      me: getUser(),
      gtest_id: gid,
    }
    let data = undefined;
    axios.post(conf.API, obj).then((itm) => {
      console.log(itm.data);
      if(itm.data?.data){
        data = JSON.parse(JSON.stringify(itm.data.data));
      }
    });
    return data;
  }
}