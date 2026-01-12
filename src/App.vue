<template>
  <div class="smooth-wrapper">
    <div class="smooth-content">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
gsap.registerPlugin(ScrollSmoother);

export default {
  methods: {}, 
  mounted() {
    ScrollSmoother.create({
      wrapper: ".smooth-wrapper",
      content: ".smooth-content",
      smooth: 1.5,
      effects: true,
    });
  },
};
</script>

<style lang="scss" scoped></style>
