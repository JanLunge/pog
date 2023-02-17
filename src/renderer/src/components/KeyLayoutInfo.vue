<template>
  <p class="font-bold">Key Info for key #{{ [...selectedKeys][0] }}</p>
  <p>selected {{ selectedKeys.size }} keys</p>
  <div class="grid gap-2 grid-cols-2 text-right">
    <span>x</span>
    <input
      type="text"
      class="keyinfo-input"
      v-model="tmpKey.x"
      @change="updateKey"
    />
    <span>y</span>
    <input
      type="text"
      class="keyinfo-input"
      v-model="tmpKey.y"
      @change="updateKey"
    />
    <span>w</span>
    <input
      type="text"
      class="keyinfo-input"
      v-model="tmpKey.w"
      @change="updateKey"
    />
    <span>h</span>
    <input
      type="text"
      class="keyinfo-input"
      v-model="tmpKey.h"
      @change="updateKey"
    />
    <span :class="{ 'text-error': matrixValid }">matrix row / col</span>
    <div class="flex">
      <input
        type="text"
        class="keyinfo-input w-1/2"
        v-model="tmpKey.matrix[0]"
        @change="updateKey"
      />

      <input
        type="text"
        class="keyinfo-input w-1/2"
        v-model="tmpKey.matrix[1]"
        @change="updateKey"
      />
    </div>
    <span>variant</span>
    <input
      type="text"
      class="keyinfo-input"
      v-model="tmpKey.variant[0]"
      @change="updateKey"
    />
    <span>variant option</span>
    <input
      type="text"
      class="keyinfo-input"
      v-model="tmpKey.variant[1]"
      @change="updateKey"
    />
    <span>rotation</span>
    <div class="flex">
      <input
        type="number"
        step="15"
        class="keyinfo-input w-1/3"
        v-model="tmpKey.r"
        @change="updateKey"
      />deg
      <input
        type="number"
        step="1"
        class="keyinfo-input w-1/3"
        v-model="tmpKey.rx"
        @change="updateKey"
      />
      <input
        type="number"
        step="1"
        class="keyinfo-input w-1/3"
        v-model="tmpKey.ry"
        @change="updateKey"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { selectedKeys } from "../store";
import { computed, ref, watch } from "vue";
import { isNumber } from "@vueuse/core";

const props = defineProps(["layout"]);

const tmpKey = ref<{
  x: number | "";
  y: number | "";
  w: number | "";
  h: number | "";
  w2: number | "";
  h2: number | "";
  d: boolean | "";
  matrix: (number | "")[];
  variant: (number | "")[];
  r: number | "";
  rx: number | "";
  ry: number | "";
}>({
  x: 0,
  y: 0,
  w: 1,
  h: 1,
  w2: 0,
  h2: 0,
  d: false,
  matrix: ["", ""],
  variant: ["", ""],
  r: 0,
  rx: 0,
  ry: 0,
});
// watch(
//   () => selectedKey.value.keyIndex,
//   () => {
//     console.log("key changed");
//     tmpKey.value = {
//       matrix: [NaN, NaN],
//       variant: [NaN, NaN],
//       ...props.layout[selectedKey.value.keyIndex],
//     };
//   }
// );

const updateSelectedKey = () => {
  if ([...selectedKeys.value].length === 1) {
    const keyToLoad = JSON.parse(
      JSON.stringify(props.layout[[...selectedKeys.value][0]])
    );
    tmpKey.value = {
      matrix: ["", ""],
      variant: ["", ""],
      ...keyToLoad,
    };
  } else {
    // set every property that has different values to ""
    tmpKey.value = {
      matrix: ["", ""],
      variant: ["", ""],
      x: "",
      y: "",
      w: "",
      h: "",
      w2: "",
      h2: "",
      d: "",
      r: "",
      rx: "",
      ry: "",
    };
  }
};

updateSelectedKey();
// watch(
//   () => [...selectedKeys.value],
//   () => updateSelectedKey()
// );

watch(
  () => {
    return JSON.stringify(
      props.layout.filter((a:any, index:number) => {
        return selectedKeys.value.has(index);
      })
    );
  },
  () => updateSelectedKey()
);

const updateKey = () => {
  selectedKeys.value.forEach((keyIndex) => {
    console.log('updating key with index', keyIndex, props.layout[keyIndex])
    // only modify if a field has a value
    // validate all fields and remove things that are set to default
    if (tmpKey.value.x !== "")
      props.layout[keyIndex].x = Number(tmpKey.value.x);
    if (tmpKey.value.y !== "")
      props.layout[keyIndex].y = Number(tmpKey.value.y);
    if (tmpKey.value.w !== "")
      props.layout[keyIndex].w = Number(tmpKey.value.w);
    if (tmpKey.value.h !== "")
      props.layout[keyIndex].h = Number(tmpKey.value.h);
    if (tmpKey.value.r !== "")
      props.layout[keyIndex].r = Number(tmpKey.value.r);
    if (tmpKey.value.rx !== "")
      props.layout[keyIndex].rx = Number(tmpKey.value.rx);
    if (tmpKey.value.ry !== "")
      props.layout[keyIndex].ry = Number(tmpKey.value.ry);

    // if (
    //   (tmpKey.value.matrix &&
    //     tmpKey.value.matrix.length == 2 &&
    //     tmpKey.value.matrix[0] !== "") ||
    //   tmpKey.value.matrix[1] !== ""
    // )
    //   props.layout[keyIndex].matrix = tmpKey.value.matrix.map(
    //     (a: string | number) => {
    //       if (a === "NaN" || a === "") return NaN;
    //       return Number(a);
    //     }
    //   );
    if (tmpKey.value.matrix && tmpKey.value.matrix[0] !== "") {
      console.log(
        "updating matrix 0",
        tmpKey.value.matrix,
        props.layout[keyIndex].marix
      );
      if (!Array.isArray(props.layout[keyIndex].matrix)) {
        props.layout[keyIndex].matrix = [Number(tmpKey.value.matrix[0]), NaN];
      } else {
        props.layout[keyIndex].matrix[0] = Number(tmpKey.value.matrix[0]);
      }
      console.log(props.layout[keyIndex].matrix);
    }
    if (tmpKey.value.matrix && tmpKey.value.matrix[1] !== "") {
      if (!props.layout[keyIndex].matrix)
        props.layout[keyIndex].matrix = [NaN, NaN];
      props.layout[keyIndex].matrix[1] = Number(tmpKey.value.matrix[1]);
    }
    if (tmpKey.value.variant && tmpKey.value.variant[0] !== "") {
      if (!props.layout[keyIndex].variant)
        props.layout[keyIndex].variant = [NaN, NaN];
      props.layout[keyIndex].variant[0] = Number(tmpKey.value.variant[0]);
    }
    if (tmpKey.value.variant && tmpKey.value.variant[1] !== "") {
      if (!props.layout[keyIndex].variant)
        props.layout[keyIndex].variant = [NaN, NaN];
      props.layout[keyIndex].variant[1] = Number(tmpKey.value.variant[1]);
    }
  });
};

const matrixValid = computed(() => {
  return !isNumber(tmpKey.value.matrix[0]) || !isNumber(tmpKey.value.matrix[1]);
});
</script>

<style lang="scss" scoped>
.keyinfo-input {
  @apply input input-sm input-bordered flex-shrink;
}
</style>
