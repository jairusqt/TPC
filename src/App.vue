<template>
  <div class="mx-auto">
    <nav class="navbar bg-body-tertiary shadow rounded text-bg-light bg-gradient d-print-none">
      <div class="container-fluid">
        <a class="navbar-brand" ><img src="./assets/tpc-logo.png" alt="" style="width: 20%"></a>
        <button class="btn border-bottom btn-lg btn-light text-start shadow" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" aria-controls="offcanvasScrolling">
          <span class="material-symbols-outlined fs-3">
            menu_open
          </span>
        </button>
        <button class="btn btn-primary" @click="logout" v-if="user_id !== ''">log-out</button>
      </div>
    </nav>
  </div>

  <div>
    <RouterView 
    />
    
  </div>
  <div class="offcanvas shadow offcanvas-start text-bg-light bg-gradient border-primary-subtle" :style="{'width': (toggler ? '8rem':'400px')}" data-bs-scroll="true" tabindex="-1" id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel">
    <div class="offcanvas-header">
      <RouterLink to="/" tag="button" class="btn border-bottom btn-lg btn-info bg-gradient w-100 text-center shadow"><img src="/src/assets/logo-tecdia.png" alt="" style="width: 4rem;"></RouterLink>
      <hr>
    </div>
    <div class="offcanvas-body">
      <template v-for="route in Route">
        <div v-if="toggler" class="pb-1">
          <ul class="nav flex-column nav-pills">
            <li class="nav-item" >
              <RouterLink :to="route.url" tag="button" class="nav-link shadow rounded text-center" :class="route.active === true ? 'active' : 'bg-light text-dark'" @click="activeRoute(route.url)" 
              data-bs-toggle="tooltip" data-bs-placement="top"
              data-bs-title="This top tooltip is themed via CSS variables."
              >
                <span class="material-symbols-outlined fs-3">{{route.icon}}</span><em v-show="!toggler"><b>{{route.label}}</b></em>
              </RouterLink>
            </li>
          </ul>
        </div>
        <div v-if="!toggler" class="pb-2">
          <ul class="nav flex-column nav-pills">
            <li class="nav-item">
              <RouterLink :to="route.url" tag="button" class="nav-link shadow rounded text-start px-4" :class="route.active === true ? 'active' : 'bg-light text-dark'" @click="activeRoute(route.url)">
                  <span class="align-bottom material-symbols-outlined pe-5">{{route.icon}}</span><em>{{route.label}}</em>
              </RouterLink>
            </li>
          </ul>
        </div>
      </template>
      <template v-for="app in Apps">
        <div v-if="toggler" class="pb-1">
          <a :href="app.url" tag="button" class="btn border-bottom btn-lg btn-light w-100 text-center shadow">
            <span class="material-symbols-outlined fs-3">{{app.icon}}</span>
          </a>
        </div>
        <div v-if="!toggler" class="pb-1">
          <ul class="nav flex-column nav-pills">
            <li class="nav-item">
            </li>
          </ul>
          <a :href="app.url" tag="button" class="btn border-bottom btn-lg btn-light w-100 text-start px-4 shadow">
            <span class="align-bottom material-symbols-outlined pe-5">{{app.icon}}</span><small><em>{{app.label}}</em></small>
          </a>
        </div>
      </template>
      <div @click="sizeToggler">
        <button class="btn btn-sm btn-light w-100 shadow border-top"><span class=" material-symbols-outlined">width</span></button>
        
      </div>
      
    </div>
  </div>
  <footer class="fixed-bottom d-print-none">
    <div class="bg text-center">
      © Tecdia Software Development Team - 2023
    </div>
  </footer>
</template>

<script>
import * as bootstrap from 'bootstrap';
import { RouterLink, RouterView, useRoute } from 'vue-router';
import axios from 'axios';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default {
  data() {
    return {
      user_id: '',
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
    },
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
<style>
   @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0');
</style>