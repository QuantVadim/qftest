<template>
<div v-if="items != undefined">
    <block class="chronology-view-inner">
    <div v-for="(item, index) in items" :key="index" class="chronology-line">
        <div v-if="items[index].name == 'cardChange' || items[index].name == 'cardEnter'">
            <div class="chronology-line__header">
                <div class="__header-point" :class="'_ico-'+items[index].name.toLowerCase()"></div>
                <span class="_time">[{{getTime(items[index].time)}}<span class="_sec">{{getSec(items[index].time)}}</span>]</span>
                <span> Ответ {{items[index].name == 'cardChange' ? 'изменен' : 'внесен'}}:</span> 
            </div>
            <div class="card-block">
                <div class="card-block-inner">
                    <component 
                    :is="items[index].state.type+'Card_result'" 
                    :data="items[index].state"
                    />
                </div>
            </div>
        </div>
        <div v-else-if="items[index].name == 'leavePage'">
            <div class="chronology-line__header">
                <div class="__header-point _ico-exit"></div>
                <span>[{{getTime(items[index].time)}}<span class="_sec">{{getSec(items[index].time)}}</span>
                 - {{getTime(items[index].timeEnd)}}<span class="_sec">{{getSec(items[index].timeEnd)}}</span>]
                </span>
                
                <span> Потеря фокуса </span>
            </div>
            <div>
                Активности не было: {{ getCountTime(items[index].timeEnd - items[index].time) }}
            </div>
        </div>
        <div v-else-if="items[index].name == 'start'">
            <div class="chronology-line__header">
                <div class="__header-point _ico-start"></div>
                <span>[{{getTime(items[index].time)}}<span class="_sec">{{getSec(items[index].time)}}</span>]</span>
                <span> Начало решения </span>
            </div>
        </div>
        <div v-else-if="items[index].name == 'load'">
            <div class="chronology-line__header">
                <div class="__header-point _ico-load"></div>
                <span>[{{getTime(items[index].timeEnd)}}<span class="_sec">{{getSec(items[index].timeEnd)}}</span>]</span>
                <span> Возврат к решению </span>
            </div>
            <div>
                Активности не было: {{ getCountTime(items[index].timeEnd - items[index].time) }}
            </div>
        </div>
        <div v-else>
            {{ items[index].name }}
        </div>
    </div>
    </block>
</div>  
</template>

<script>
//Simple
import SimpleCard_result from "./TestCards/Result/Simple";
//Choice
import ChoiceCard_result from "./TestCards/Result/Choice";
//Orthoepy
import OrthoepyCard_result from "./TestCards/Result/Orthoepy";


export default {
    components:{
        SimpleCard_result, ChoiceCard_result, OrthoepyCard_result
    },
    props: ['data'],
    data(){
        return{
            items: [],
        }
    },
    created(){
        this.items = this?.data || [];
    },
    methods:{
        getTime(time){
            let newTime = new Date(time);
            let minutes = newTime.getMinutes().toString();
            minutes = minutes.length == 1 ? '0'+minutes : minutes;
            return newTime.getHours()+':'+minutes;
        },
        getSec(time){
            let newTime = new Date(time);
            let sec = newTime.getSeconds().toString();
            sec = sec.length == 1 ? '0'+sec : sec;
            return '.'+sec;
        },
        getCountTime(time){
            let sec = Math.floor(time/1000); //Секунды 100 000
            let min = Math.floor(sec/60); //Минуты 1 666
                sec-=(min*60);
            let hours = Math.floor(min/60); //Часы 27
                min-=(hours*60);
            let days = Math.floor(hours/24);//Дни 1
                hours-=(days*24);
            let ret = '';
            if(days > 0) ret+= days+' дн. ';
            if(hours > 0) ret+= hours+' ч. ';
            if(sec > 0) ret+= sec+' сек. ';
            ret = ret.trim();
            return ret;
            // if(min > 0){
            //     sec = sec.length == 1 ? '0'+sec : sec;
            //     ret = min.toString()+':'+sec+' мин.';
            // }else{
            //     ret = sec+' сек.'
            // }
            // return ret;

        }
    },
}
</script>

<style scoped>
.chronology-line__header ._sec{
    color: #7d7d7d;
    font-size: 12px;
    font-weight: 500;
}
.chronology-line{
    border-left: 3px solid #6f6f6f;
    padding-left: 16px;
    margin-left: 10px;
    padding-bottom: 16px;
}
.chronology-line:last-child{
    border-left-color: rgba(0, 0, 0, 0);
}
.chronology-view-inner .card-block{
    border: 1px solid #dfdfdf;
    background-color: #f8f8f8;
    border-radius: 8px;
}
.card-block-inner{
    margin: 8px 12px;
}
.chronology-line__header {
    font-weight: bold;
    padding-bottom: 4px;
}
.chronology-line__header .__header-point{
    position: absolute;
    width: 32px;
    height: 32px;
    background-color: white;
    border-radius: 160%;
    margin-left: -34px;
    margin-top: -8px;
    border: 2px solid #6f6f6f;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 28px 28px;
}

.__header-point._ico-cardchange{
    background-image: url('/img/chronology_cardedit.png');
}
.__header-point._ico-cardenter{
    background-image: url('/img/chronology_cardenter.png');
}
.__header-point._ico-exit{
    background-image: url('/img/chronology_exit.png');
    border-color: #d9570e;
}
.__header-point._ico-start{
    background-image: url('/img/chronology_start.png');
}
.__header-point._ico-load{
    background-image: url('/img/chronology_load.png');
    border-color: #d9570e;
}
</style>