<template>
  <div class="m-item row text-left">
    <BCol 
      cols="auto"
      class="text-left mr-auto" 
    >
      <div
        v-if="
          item.taxonomicStatus &&
            item.taxonomicStatus === 'accepted'
        "
      >
        <NLink
          :to="`/flora/taxon/${item.acceptedNameUsageId}`"
          class="m-item-name-accepted"
          :style="
            rankClass[item.taxonRank] > 140
              ? 'font-style: italic;'
              : ''
          "
        >{{ item.acceptedNameUsage }}</NLink>
        <span class="m-item-author">{{ item.acceptedNameUsageAuthorship }}</span>
        <span class="m-item-vernacularname">{{ item.vernacularName }}</span>
      </div>

      <div v-else>
        <div
          :style="item.acceptedNameUsageId ? '' : 'margin-bottom: 10px;'"
        >
          <NLink
            :to="`/flora/taxon/${item.id}`"
            class="m-item-name"
            :style="
              rankClass[item.taxonRank] > 140
                ? 'font-style: italic;'
                : ''
            "
          >{{ item.scientificName }}</NLink>
          <span class="m-item-author">{{ item.scientificNameAuthorship }}</span>
        </div>
        <div v-if="item.acceptedNameUsageId">
          <span>{{ `= ` }}</span>
          <n-link
            :to="`/flora/taxon/${item.acceptedNameUsageId}`"
            class="m-item-name-accepted"
            :style="
              rankClass[item.taxonRank] > 140
                ? 'font-style: italic;'
                : ''
            "
            >{{ item.acceptedNameUsage }}</n-link
          >
          <span class="m-item-author">{{
            item.acceptedNameUsageAuthorship
          }}</span>
          <span class="m-item-vernacularname">{{
            item.vernacularName
          }}</span>
        </div>
      </div>
    </BCol>
    
    <BCol 
      cols="auto" 
      class="m-responsive-disappear"
    >
      <span class="m-item-familyname">{{ item.family }}</span>
    </BCol>
  </div>
</template>

<script>
export default {
  name: "SearchResultItem",
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      rankClass: {
        life: -9999,
        kingdom: 10,
        phylum: 30,
        class: 60,
        superorder: 90,
        order: 100,
        family: 140,
        genus: 180,
        species: 220,
        subspecies: 230
      }
    }
  }
}
</script>

<style lang="scss">
@import "~/assets/scss/custom_variables.scss";
.m-item{
    .m-item-name-accepted{
        display: inline-block;
        margin-bottom: 10px;
        margin-right: 15px;
        font-family: "goodsans-regular";
        color: $primary;
    }
    .m-item-name{
        display: inline-block;
        margin-right: 15px;
        font-family: "goodsans-regular";
        color: $grey;
    }
    .m-item-author{
        font-size: smaller;
    }
    .m-item-vernacularname{
        margin-left: 15px;
        color: $primary;
    }
    .m-item-familyname{
        font-size: small;
        text-align: right;
    }
}
</style>
