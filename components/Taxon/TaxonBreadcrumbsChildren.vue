<template>
  <div class="m-breadcrumb-selector-item">
    <b-form-select v-model="taxonId" size="sm">
      <template #first>
        <b-form-select-option :value="null" disabled
          >Select child...</b-form-select-option
        >
      </template>

      <b-form-select-option
        v-for="child in children"
        :key="child.id"
        :value="child.id"
      >{{ child.taxonName.fullName }}</b-form-select-option>

    </b-form-select>
  </div>
</template>

<script>
export default {
  name: "TaxonBreadcrumbsChildren",
  props: {
    children: {
      type: Array,
      required: true
    }
  },
  computed: {
    taxonId: {
      get: function() {
        return null
      },
      set: function(newVal) {
        this.$router.push({
          path: "/flora/taxon/" + newVal,
        })
      },
    },
  }
}
</script>

<style lang="scss" scoped>
.m-breadcrumb-selector-item {
  max-width: 200px;
  margin-left: 18px;
  margin-top:-40px;
}
</style>