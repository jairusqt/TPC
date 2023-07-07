<template>
  <div class="about">
    <h1>This is an about page</h1>
    <input type="text" class="form-control" id="test">
  </div>
</template>


<script>
    const test = document.getElementById('test');
    
    test.addEventListener('input', () => {
      console.log(test.value);
    });
</script>
