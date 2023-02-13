<template>
  <div class="form-control">
    <label class="label">
      <span class="label-text">{{ label }}</span>
    </label>
    <input
      :type="inputType || 'text' "
      :placeholder="placeholder"
      v-model="localValue"
      class="input input-bordered"
      @input="changed"
    />
  </div>
</template>
<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {isNumber} from "@vueuse/core";

const props = defineProps(["label", "placeholder", "modelValue", "inputType", "min"]);
const emits = defineEmits(["update:modelValue", "input"]);
const localValue = ref("");
onMounted(() => {
  localValue.value = props.modelValue;
});
watch(props.modelValue, ()=>{
  localValue.value = props.modelValue;
})
const changed = () => {
  if(isNumber(props.min)){
    console.log('min of' , props.min)
    if(Number(localValue.value) < props.min) localValue.value = String(props.min)
  }
  emits("update:modelValue", localValue.value);
  emits("input" );
};
</script>
