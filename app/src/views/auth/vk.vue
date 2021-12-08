<template>
<div class="center-loading">
    <it-loading></it-loading><br>
    <div>Выполняется вход</div>
</div>
</template>

<script scope>
import helpers from '../../others/helpers'
import {mapActions} from 'vuex'


export default{
    data(){
        return{
            link: '',
        }
    },
mounted(){
    this.axios.post(this.conf.AUTH_URL, {
	user_id: helpers.getDataHash('user_id'),
	access_token: helpers.getDataHash('access_token'),
	sn: 'vk'
}).then(respon => {
	console.log(respon);
    
	if(!respon.data?.error){
        localStorage.setItem('usr_id', respon.data.usr_id);
        localStorage.setItem('mykey', respon.data.mykey);

        this.LOAD_USER();
        this.$router.push('/');
	}
}).catch(itm=>{alert(itm)});
    },
    methods:{
        ...mapActions(["LOAD_USER"]),
    }

}


</script>

<style>
.center-loading{
    text-align: center;
    padding-top: 60px;
}

</style>