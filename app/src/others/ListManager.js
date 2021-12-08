//Менеджер загрузки списка
import conf from "@/conf.js";
import axios from "axios";

export default{
  Create(user, query, colName, count, desc = true, func){
    let list = {
      items: [], //Элементы
      isLoading: false, //Идет ли загрузка данных
      isMore: true,//Есть ли еще контент для загрузки
      async Load() {
        if (this.isLoading) return false;
        this.isLoading = true;
        let obj = {
          q: query,
          me: user,
          desc,
          count,
        };
        if (this.items.length > 0)
        obj.point = this.items[this.items.length - 1][colName];
        axios.post(conf.API, obj).then((itm) => {
          console.log('ВОТ', itm.data);
          if (itm.data?.data) {
            if (itm.data.data.length > 0) {
              let leng = itm.data?.data.length;
              for (let i = 0; i < leng; i++) {
                this.items.push(itm.data?.data[i]);
              }
              if (leng < obj.count) this.isMore = false;
            } else {
              this.isMore = false;
            }
          }
          this.isLoading = false;
          if(func) func();
        });
      },
      Refresh(){
        this.isMore = true;
        this.items = [];
        this.Load();
      },
      DeleteBy(col, value){ //Имя параметра, значение параметра
        let del = undefined;
        for (let i = 0; i < this.items.length; i++) {
          if(this.items[i][col] == value){
            del = i;
            break;
          }
        }
        if(del != undefined) this.items.splice(del, 1);
      },
      AddStart(item){
        this.items.splice(0, 0, item);
      },
      Add(item){
        this.items.push(item);
      },
    }
    return list;
  },
  
}