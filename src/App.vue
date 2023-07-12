<template>
  <div class="p-3">
    <div class="col-lg-12 col-md-12 row">
    <div class="col-md-12">
      <header>
        <div class="col-md-12">
          <div class="col-md-1 float-end pb-3">
            <button class="btn btn-light float-end w-100" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" aria-controls="offcanvasScrolling"><span class="material-symbols-outlined align-bottom">menu</span></button>
          </div>
        </div>
      </header>
    </div>
    
    <div class="col-md-12 mx-auto">
      <RouterView 
      />
    </div>
  </div>
  </div>
  <div class="offcanvas offcanvas-start" data-bs-scroll="true" data-bs-backdrop="false" tabindex="-1" id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel">
    <div class="offcanvas-header">
       <img alt="Vue logo" class="logo p-2 rounded" style="background-color: #06b6d4;" src="@/assets/logo-tecdia.png" width="100" height="75" />
      <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      <div class="p-1">
        <RouterLink to="/" tag="button" class="btn w-100 text-start btn-light"><span class="align-bottom pe-2 material-symbols-outlined ">home</span>Home</RouterLink>
      </div>
      <div class="p-1">
        <RouterLink to="/section" tag="button" class="btn w-100 text-start btn-light"><span class="align-bottom pe-2 material-symbols-outlined ">warehouse</span>Setup Section</RouterLink>
      </div>
      <div class="p-1">
        <RouterLink to="/keyProcess" tag="button" class="btn w-100 text-start btn-light"><span class="align-bottom pe-2 material-symbols-outlined ">key</span>Setup Key Process</RouterLink>
      </div>
      <div class="p-1">
        <RouterLink to="/subProcess" tag="button" class="btn w-100 text-start btn-light"><span class="align-bottom pe-2 material-symbols-outlined ">account_tree</span>Setup Sub-Process</RouterLink>
      </div>
      <div class="p-1">
        <RouterLink to="/processFlow" tag="button" class="btn w-100 text-start btn-light"><span class="align-bottom pe-2 material-symbols-outlined ">account_tree</span>Setup Process Flow</RouterLink>
      </div>
      <div class="p-1">
        <RouterLink to="/processFlowv2" tag="button" class="btn w-100 text-start btn-light"><span class="align-bottom pe-2 material-symbols-outlined ">account_tree</span>Setup Process Flow v2</RouterLink>
      </div>
      <div class="p-1">
        <RouterLink to="/formAssignment" tag="button" class="btn w-100 text-start btn-light"><span class="align-bottom pe-2 material-symbols-outlined ">assignment</span>Form-Assignment</RouterLink>
      </div>
    </div>
  </div>
</template>
<script>
import { RouterLink, RouterView } from 'vue-router'
import axios from 'axios'
export default {
  data() {
    return {

    }
  },
  async created() {
    
  },
  components: {
    RouterLink,
    RouterView
  }
}
</script>
<style scoped>

</style>
