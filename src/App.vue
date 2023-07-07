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
    
    <div class="col-md-12">
      <RouterView 
      :sectionResponse="sectionResponse" 
      :keyProcessResponse="keyProcessResponse" 
      :subProcessResponse="subProcessResponse"
      :formAssignmentResponse="formAssignmentResponse"
      :processFlowResponse="processFlowResponse"
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
        <RouterLink to="/about" tag="button" class="btn w-100 text-start btn-light"><span class="align-bottom pe-2 material-symbols-outlined ">help</span>About</RouterLink>
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
      sectionResponse: null,
      keyProcessResponse: [],
      subProcessResponse: [],
      formAssignmentResponse: [],
      processFlowResponse: []
    }
  },
  async created() {
    const sectionUrl = axios.get('http://localhost/tpcrequesthandlers/sectionView.php');
    const keyProcessUrl = axios.get('http://localhost/tpcrequesthandlers/keyProcessView.php');
    const subProcessUrl = axios.get('http://localhost/tpcrequesthandlers/subProcessView.php');
    const formAssignmentUrl = axios.get('http://localhost/tpcrequesthandlers/formAssignment.php');
    const processFlow = axios.get('http://localhost/tpcrequesthandlers/processFlowView.php');
    await Promise.all([sectionUrl, keyProcessUrl,subProcessUrl, formAssignmentUrl, processFlow])
    .then(responses => {
      this.sectionResponse = responses[0].data;
      for(const key of responses[1].data){
        for(const sec of responses[0].data){
          if(key.section_id === sec.section_id){
            const newKeyProcessSet = {
              Pid: key.Pid,
              section_id: key.section_id,
              section_code: sec.section_code,
              Pname: key.Pname,
              date_created: key.date_created,
              key_process_status: key.key_process_status,
              stock_point: key.stock_point,
            }
            this.keyProcessResponse.push(newKeyProcessSet);
          }
        }
      }
      for(const sub of responses[2].data){
        for(const key of this.keyProcessResponse){
          if(sub.section_id === key.section_id && sub.Pid === key.Pid){
           const newSubProcessSet = {
              SubPid: sub.SubPid,
              section_code: key.section_code,
              Pname: key.Pname,
              SubPname: sub.SubPname,
              process_type: sub.process_type,
              date_created: sub.date_created,
              sub_process_status: sub.sub_process_status,
              sequence_number: sub.sequence_number
           }
           this.subProcessResponse.push(newSubProcessSet);
          }
        }
      }
      for(const form of responses[3].data){
        for(const sec of responses[0].data){
          if(form.section_id === sec.section_id){
            const formAssignmentSet = {
              assignment_id: form.assignment_id,
              section_id: form.section_id,
              section_code: sec.section_code,
              lot_number: form.lot_number,
              po_number: form.po_number,
              item_parts_number: form.item_parts_number,
              quantity: form.quantity,
              delivery_date: form.delivery_date,
              jo_number: form.jo_number,
              revision_number: form.revision_number,
              date_issued: form.date_issued,
              assigned_by: form.assigned_by,
              date_created: form.date_created,
              wafer_number_from: form.wafer_number_from,
              wafer_number_to: form.wafer_number_to,
              item_code: form.item_code,
              assignment_status: form.assignment_status,
              attachment: form.attachment,
              special_instruction: form.special_instruction
            }
            this.formAssignmentResponse.push(formAssignmentSet);
          }
        }
      }
      for(const flow of responses[4].data){
        for(const sec of responses[0].data){
          if(flow.section_id === sec.section_id){
            const processFlowSet = {
              flow_main_id: flow.flow_main_id,
              item_parts_number: flow.item_parts_number,
              item_code: flow.item_code,
              section_id: flow.section_id,
              section_code: sec.section_code,
              revision_number: flow.revision_number,
              flow_status: flow.flow_status
            }
            this.processFlowResponse.push(processFlowSet);
          }
        }
      }
    })
    .catch(error => {
      console.log(error);
    });
  },
  components: {
    RouterLink,
    RouterView
  }
}
</script>
<style scoped>

</style>
