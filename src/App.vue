<template>
  <div class="mx-auto">
    <nav class="navbar bg-body-tertiary shadow rounded text-bg-light bg-gradient d-print-none">
      <div class="container-fluid">
        <a class="navbar-brand" ><img src="./assets/tpc-logo.png" alt="" style="width: 15%"></a>
        <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" aria-controls="offcanvasScrolling">
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>
    </nav>
  </div>

  <div>
    <RouterView 
    />
    
  </div>
  <div class="offcanvas shadow offcanvas-start text-bg-light bg-gradient border-primary-subtle" :style="{'width': (toggler ? '8rem':'400px')}" data-bs-scroll="true" data-bs-backdrop="true" tabindex="-1" id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel">
    <div class="offcanvas-header">
      <RouterLink to="/" tag="button" class="btn border-bottom btn-lg btn-info bg-gradient w-100 text-center shadow"><img src="/src/assets/logo-tecdia.png" alt="" style="width: 4rem;"></RouterLink>
      <hr>
    </div>
    <div class="offcanvas-body">
      <template v-for="route in Route">
        <div v-if="toggler" class="pb-1">
          <RouterLink :to="route.url" tag="button" class="btn border-bottom btn-lg btn-light w-100 shadow">
            <span class="material-symbols-outlined fs-3">{{route.icon}}</span> <p v-show="!toggler">{{route.label}}</p>
          </RouterLink>
        </div>
        <div v-if="!toggler" class="pb-1">
          <RouterLink :to="route.url" tag="button" class="btn border-bottom btn-lg btn-light w-100 text-start px-4 shadow">
            <span class="align-bottom material-symbols-outlined pe-5">{{route.icon}}</span>{{route.label}}
          </RouterLink>
        </div>
      </template>
      <template v-for="app in Apps">
        <div v-if="toggler" class="pb-1">
          <a :href="app.url" tag="button" class="btn border-bottom btn-lg btn-light w-100 text-center shadow">
            <span class="material-symbols-outlined fs-3">{{app.icon}}</span>
          </a>
        </div>
        <div v-if="!toggler" class="pb-1">
          <a :href="app.url" tag="button" class="btn border-bottom btn-lg btn-light w-100 text-start px-4 shadow">
            <span class="align-bottom material-symbols-outlined pe-5">{{app.icon}}</span>{{app.label}}
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
      © Tecdia Software Developer Team - 2023
    </div>
  </footer>
</template>

<script>
import * as bootstrap from 'bootstrap';
import { RouterLink, RouterView } from 'vue-router';
import axios from 'axios';

export default {
  data() {
    return {
      toggler: false,
      Route: [
        {url: '/', icon: 'home', label: 'Home'}, 
        {url: '/section', icon: 'warehouse', label: 'Section'},
        {url: '/keyProcess', icon: 'key', label: 'Key Process'},
        {url: '/subProcess', icon: 'account_tree', label: 'Sub Process'},
        // {url: '/processFlowv2', icon: 'schema', label: 'Process Flow'},
        {url: '/processFlowv3', icon: 'schema', label: 'Process Flow v3 (Dev)'},
        {url: '/formAssignmentv2', icon: 'assignment', label: 'Form Assignment'},
        {url: '/ReasonNG', icon: 'data_alert', label: 'NG Reason'},
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
  },
  async created() {

  },
  components: {
    RouterLink,
    RouterView
  }
}
</script>
<style>
  
</style>