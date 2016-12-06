<template>
  <div>
    11
    <router-view >
  
    </router-view>

  </div>
   
</template>

<style>
  @reset-global mobile;

  html {
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: transparent;
  height: 100%;
}

  body {
  margin: 0;
  font-size: 14px;
  font-family: "Helvetica Neue", Helvetica, STHeiTi, Arial, sans-serif;
}
  html, body {
    background-color: #fafafa;
    -webkit-overflow-scrolling: touch;
    user-select: none;
  }

  a {
    color: inherit;
  }
  .morediv{
    height:130px;
  }
  .tab-nav {
    text-align: center;
    height: 100%;
}
ul, ol {
    list-style: none outside none;
}
ul, ol, li, dl, dd {
    margin: 0;
    padding: 0;
}

.tab-nav > li {
    display: inline-block;
    height: 36px;
    margin: 0 0.11905rem;
}
.tab-nav > li.active > a {
    color: #18a6e0;
    border-bottom-color: #18a6e0;
}
.tab-nav > li > a {
    display: block;
    height: 100%;
    line-height: 3rem;
    color: #7a7a7a;
    font-size: 1.04762rem;
    border-bottom: 3px solid transparent;
    padding: 0 0.71429rem;
}

</style>

<script type="text/babel">

 export default {
   data() {
     return {
       selected: "订单"
     };
   },
   computed: {
     showheadertab() {
       return this.$store.state.headertab.showheadertab;
     },
     headertabs() {
       return this.$store.state.headertab.tabs;
     },
     curheadertab() {
       return this.$store.state.headertab.curheadertab;
     }
   },
   created() {
    


   },
   methods: {
     handleClose() {
       alert('close this page');
     },
  
     goback() {
       this.$router.back();
     },
     changecurtab(name) {
       this.$store.commit('UPDATE_HEADERTAB', name)
     }
   }
 };
</script>
