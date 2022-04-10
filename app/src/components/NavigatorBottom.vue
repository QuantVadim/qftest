<template>
  <div class="navigator-bottom-root">
      <div class="top-line">
        <img src="/img/out-corner.svg" alt="">
        <div></div>
        <img src="/img/out-corner.svg" alt="">
      </div>
      <div class="navigator-bottom-content">
        <div class="_nav-btns">
          <router-link to="/" active-class="_active"> 
            <div class="nav-button-wrapper">
              <div class="_nav-img-wrapper">
                <img src="/img/nb-home.png" alt="">
              </div> 
              <div class="_nav-btn-title">Главная</div> 
            </div>
          </router-link>
          <router-link to="/mytests" active-class="_active"> 
            <div class="nav-button-wrapper">
              <div class="_nav-img-wrapper">
                <img src="/img/nb-tests.png" alt="">
              </div> 
              <div class="_nav-btn-title">Тесты</div> 
            </div>
          </router-link>
          <router-link to="/myresults" active-class="_active"> 
            <div class="nav-button-wrapper">
              <div class="_nav-img-wrapper">
                <img src="/img/nb-results.png" alt="">
              </div> 
              <div class="_nav-btn-title">Решения</div> 
            </div>
          </router-link>
          <router-link to="/groups" active-class="_active"> 
             <div class="nav-button-wrapper">
              <div class="_nav-img-wrapper">
                <img src="/img/nb-groups.png" alt="">
              </div> 
              <div class="_nav-btn-title">Группы</div> 
            </div>
          </router-link>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  setup() {
    
  },
}
</script>


<style>
@keyframes nav-bottom-show{
  from{
    bottom: -64px;
  }
  to{
    bottom: 0px;
  }
}

.navigator-bottom-root{
  display: none;
  animation: 0.3s nav-bottom-show;
}

.nav-button-wrapper ._nav-img-wrapper{
  width: 100%;
  border-radius: 36px;
  padding: 4px 0px;
}
a._active .nav-button-wrapper ._nav-img-wrapper{
  animation: 0.4s show-nav-btn;
  background-color: #48659C;
}
.nav-button-wrapper ._nav-btn-title{
  width: 100%;
  text-align: center;
  padding-top: 3px;
  font-size: 12px;
}
.nav-button-wrapper{
  width: 64px;
  padding-top: 8px;
}
.nav-button-wrapper img{
  display: block;
  margin: auto;
  width: 22px;
  height: 22px;
}
.navigator-bottom-root a{
  color: white;
  text-decoration: none;
}

.navigator-bottom-content ._nav-btns{
  display: grid;
  grid-template-columns: repeat( 4 , 1fr);
  justify-content: center;
  justify-items: center;
}

</style>