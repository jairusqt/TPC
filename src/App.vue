<template>
  <div class="mx-auto">
    <nav class="navbar bg-body-tertiary shadow rounded bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" ><img src="./assets/tpc-logo.png" alt="" style="width: 15%"></a>
        <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" aria-controls="offcanvasScrolling">
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>
    </nav>
  </div>

  <div class="">
    <RouterView 
    />
  </div>
  <div class="offcanvas shadow offcanvas-start rounded-start rounded-4 text-bg-light bg-gradient border-primary-subtle" ref="offcanvas" data-bs-scroll="true" data-bs-backdrop="true" tabindex="-1" id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel">
    <div class="offcanvas-header">
       <RouterLink to="/"><img alt="Vue logo" class="logo p-2 rounded border-secondary-subtle shadow" style="background-color: #06b6d4;" src="@/assets/logo-tecdia.png" width="160" height="75" /></RouterLink>
    </div>
    <div class="offcanvas-body">
      <div class="pb-1">
        <RouterLink to="/" tag="button" class="btn border-bottom btn-lg btn-light w-100 text-start px-4 shadow"><span class="align-bottom material-symbols-outlined pe-5">home</span>Home</RouterLink>
      </div>
      <div class="pb-1">
        <RouterLink to="/section" tag="button" class="btn border-bottom btn-lg btn-light w-100 text-start px-4 shadow"><span class="align-bottom material-symbols-outlined pe-5">warehouse</span>Section</RouterLink>
      </div>
      <div class="pb-1">
        <RouterLink to="/keyProcess" tag="button" class="btn btn-lg border-bottom btn-light w-100 text-start px-4 shadow"><span class="align-bottom material-symbols-outlined pe-5">key</span>Key Process</RouterLink>
      </div>
      <div class="pb-1">
        <RouterLink to="/subProcess" tag="button" class="btn btn-lg border-bottom btn-light w-100 text-start px-4 shadow"><span class="align-bottom material-symbols-outlined pe-5">account_tree</span>Sub Process</RouterLink>
      </div>
      <div class="pb-1">
        <a @click="redirectToYao" class="btn btn-lg border-bottom btn-light w-100 text-start px-4 shadow"><span class="align-bottom material-symbols-outlined pe-5">place_item</span>Item Condition</a>
      </div>
      <div class="pb-1">
        <RouterLink to="/processFlowv2" tag="button" class="btn btn-lg border-bottom btn-light w-100 text-start px-4 shadow"><span class="align-bottom material-symbols-outlined pe-5">schema</span>Process Flow</RouterLink>
      </div>
      <div class="pb-1">
        <RouterLink to="/formAssignmentv2" tag="button" class="btn btn-lg border-bottom btn-light w-100 text-start px-4 shadow"><span class="align-bottom material-symbols-outlined pe-5">assignment</span>Form Assignment</RouterLink>
      </div>
      <div class="pb-1">
        <a @click="redirectToDee" class="btn btn-lg border-bottom btn-light w-100 text-start px-4 shadow"><span class="align-bottom material-symbols-outlined pe-5">grading</span>TPC Main Form</a>
      </div>
    </div>
  </div>
  <!-- <footer class="fixed-bottom d-print-none">
    <div class="bg text-center p-2">
      © Tecdia Software Developer Team - 2023
    </div>
  </footer> -->
</template>
<style scoped>
   .bg{
    background-color: #7dd3fc;
   }
   .offcanvas-start {
    max-width: 400px; /* Set your desired width here */
  }
</style>
<script>
import { RouterLink, RouterView } from 'vue-router'
import axios from 'axios'
export default {
  data() {
    return {

    }
  },
  methods: {
    redirectToYao(){
        location.replace('http://172.16.2.13/YAO/');
    },
    redirectToDee(){
        location.replace('http://172.16.2.61/tpc_ver2');
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