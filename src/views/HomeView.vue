<script setup>
</script>

<template>
  <div class="container p-5 bg-light bg-gradient shadow-lg">
    <div class="row">
      <div class="col-md-4 p-3 py-2" v-for="route in Route">
        <RouterLink :to="route.url" class="btn btn-light w-100 shadow">
            <span class="material-symbols-outlined display-1">{{route.icon}}</span>
            <hr class="shadow">
            <p class="fs-5" style="color: #155e75"><em><b>{{route.label}}</b></em></p>
        </RouterLink>
      </div>
      <div class="col-md-4 p-3 py-2" v-for="route in Apps">
        <a :href="route.url" class="btn btn-light w-100 shadow">
          <span class="material-symbols-outlined display-1">{{route.icon}}</span>
          <hr>
          <p class="fs-5" style="color: #155e75"><em><b>{{route.label}}</b></em></p>
        </a>
      </div>
    </div>
  </div>
  
  
</template>

<script>
  import * as bootstrap from 'bootstrap';
  import { RouterLink, RouterView, useRoute } from 'vue-router';
  import axios from 'axios';
  // import 'bootstrap/dist/js/bootstrap.bundle.min.js';
  
  export default {
    data() {
      return {
        toggler: false,
        Route: [
          {url: '/', icon: 'home', label: 'Home', active: false}, 
          {url: '/section', icon: 'warehouse', label: 'Section', active: false},
          {url: '/keyProcess', icon: 'key', label: 'Key Process', active: false},
          {url: '/subProcess', icon: 'account_tree', label: 'Sub Process', active: false},
          // {url: '/processFlow', icon: 'schema', label: 'Process Flow Assignment (DEV)', active: false},
          {url: '/processFlow', icon: 'schema', label: 'Process Flow Assignment', active: false},
          {url: '/formAssignment', icon: 'assignment', label: 'Form Assignment', active: false},
          {url: '/formQRGenerator', icon: 'qr_code_2', label: 'QR Code Generator', active: false},
          // {url: '/formAssignmentv2', icon: 'assignment', label: 'Form Assignment', active: false},
          {url: '/ReasonNG', icon: 'data_alert', label: 'NG Reason', active: false},
        ],
        Apps: [
          {url: 'http://172.16.2.13/YAO/', icon: 'place_item', label: 'Item Condition'},
          {url: 'https://172.16.2.13/tpc_ver2', icon: ' grading', label: 'TPC Main Form'}
        ]
      }
    },
    methods: {
      sizeToggler(){
        this.toggler = !this.toggler;      
      },
      activeRoute(url){
        for(const path of this.Route){
          if(url === path.url){
            path.active = true;
          } else {
            path.active = false;
          }
        }
      }
    },
    created(){
  
    },
    mounted(){
  
    },
    components: {
      RouterLink,
      RouterView
    }
  }
  </script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0');
  @import 'animate.css';
  
  .consolas {
    font-family: 'Inconsolata', monospace;
  }
  .bg {
    background-color: #67e8f9;
  }
  .text-color {
    font-size: 72px;
    background: -webkit-linear-gradient(#7dd3fc, #0ea5e9);
    -webkit-text-fill-color: transparent;
  }


</style>