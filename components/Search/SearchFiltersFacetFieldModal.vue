<template>
  <div>
    <BModal
      v-model="showModal"
      size="lg"
      :title="facetData.fieldLabel"
      id="facetModal"
    >
      <BFormCheckboxGroup v-model="modalSelected">
        <div class="m-table">
          <component @infinite-scroll="loadMore" style="max-height: 60vh;" :is="pullTo">
            <table class="table table-striped table-hover table-sm">
              <thead style="width:99%">
                <tr>
                  <th scope="col">
                    <BRow>
                      <BCol class="mr-auto" cols="auto">
                        <p style="display:inline-block;" class="mb-0">
                          Value
                        </p>
                      </BCol>
                      <BCol cols="auto">
                        <div>
                          <BButton
                            size="sm"
                            :disabled="order === 'value'"
                            variant="secondary"
                            @click="sortByValue()"
                          >
                            <BIcon font-scale="1" icon="sort-alpha-down"/>
                          </BButton>
                        </div>
                      </BCol>
                    </BRow>
                  </th>
                  <th scope="col">
                    <BRow>
                      <BCol class="mr-auto" cols="auto">
                        <p style="display:inline-block;" class="mb-0">
                          Count
                        </p>
                      </BCol>
                      <BCol cols="auto">
                        <div>
                          <BButton
                            size="sm"
                            :disabled="order === 'count'"
                            variant="secondary"
                            @click="sortByCount()"
                            >
                            <BIcon font-scale="1" icon="sort-down"/>
                          </BButton>
                        </div>
                      </BCol>
                    </BRow>
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(facet, index) in facetData.facets" :key="index">
                  <td>
                    <BFormCheckbox
                      style="display:inline-block;"
                      :value="facet.fq.split(':')[1]"
                      :label="facet.value"
                    />

                    <span class="m-facet-value">{{ facet.value }}</span>
                  </td>
                  <td>
                    <span style="font-size: small;">{{ facet.count }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </component>
        </div>
      </BFormCheckboxGroup>

      <template #modal-footer>
        <BButton @click="includeSelected()">
          Include selected
        </BButton>
        <BButton @click="excludeSelected()">
          Exclude selected
        </BButton>
        <BButton
          variant="primary"
          class="float-right"
          @click="showModal = false"
        >
          Close
        </BButton>
      </template>
    </BModal>
  </div>
</template>

<script>
import gql from "graphql-tag"
import { searchMixin } from "@/mixins/searchMixins"

var SearchResultFacetFieldGql = gql`
  query facetField($input: FieldFacetInput) {
    facetField(input: $input) {
      fieldName
      fieldLabel
      facets {
        value
        count
        fq
      }
    }
  }
`

export default {
  name: "FacetsCollapseModal",
  mixins: [searchMixin],
  props: {
    moreFacets: {
      type: Boolean,
      required: true
    }, 
    facetName: {
      type: String,
      required: true
    }, 
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // infinite scroll
      input: {
        field: this.data.facets[0].fq.split(":")[0].replace("-", ""),
        q: this.q,
        limit: 50,
        offset: 0,
        sort: "count",
      },
      busy: false,
      order: "count",
      facetData: this.data,
      showModal: this.moreFacets,
      // the result of more data showed in infinite scroll
      facetField: [],
      // status of facet modal
      modalSelected: [],
    }
  },
  computed: {
    pullTo:function(){
      return () => {
          if (process.client) {
            return import("vue-pull-to")
          }
        }
    }
  },
  watch: {
    showModal: function(newVal) {
      this.$emit("changeModal", newVal)
    },
    facetField: function(newVal) {
      this.facetData.facets = newVal.facets
    },
  },
  methods: {
    getData: function(input) {
      this.$apollo.addSmartQuery("facetField", {
        query: SearchResultFacetFieldGql,
        variables: {
          input,
        },
        result({ data }) {
          return data
        },
        error(error) {
          console.error("We've got an error!", error)
        },
      })
    },
    // when the scroll is at the bottom, trigger to load more data
    loadMore: function() {
      this.input.limit = this.input.limit + 50
      if (this.order === "count") {
        this.input.sort = "count"
      } else {
        this.input.sort = "value"
      }
      this.getData(this.input)
    },
    // sort the array by value name of facet
    sortByValue: async function() {
      this.input.sort = "value"
      this.order = "value"
      this.getData(this.input)
      this.modalSelected = []
    },
    // sort the array by count of facet
    sortByCount: function() {
      this.input.sort = "count"
      this.order = "count"
      this.getData(this.input)
      this.modalSelected = []
    },
    includeSelected: function() {
      let newFq
      if (this.modalSelected.length == 0) {
        alert('You need to select at least one facet.')
        return
      }
      if (this.modalSelected.length > 1) {
        newFq = `${this.facetData.facets[0].fq.split(":")[0]}:(${this.modalSelected.join(' OR ')})`
      }
      else {
        newFq = `${this.facetData.facets[0].fq.split(":")[0]}:${this.modalSelected[0]}`
      }
      this.$router.push({
        path: "/flora/search",
        query: {
          ...this.$route.query,
          fq: Array.from(new Set([...this.fq, newFq])),
        },
      })
      this.$bvModal.hide("facetModal")
    },
    excludeSelected: function() {
      let newFq
      if (this.modalSelected.length == 0) {
        alert('You need to select at least one facet.')
        return
      }
      if (this.modalSelected.length > 1) {
        newFq = `-${this.facetData.facets[0].fq.split(":")[0]}:(${this.modalSelected.join(' OR ')})`
      }
      else {
        newFq = `-${this.facetData.facets[0].fq.split(":")[0]}:${this.modalSelected[0]}`
      }
      this.$router.push({
        path: "/flora/search",
        query: {
          ...this.$route.query,
          fq: Array.from(new Set([...this.fq, newFq])),
        },
      })
      this.$bvModal.hide("facetModal")
    },
  }
}
</script>

<style lang="scss" scoped>
@import "~/assets/scss/custom_variables.scss";

.m-table {
  width: 100%;
  max-height: 60vh;
}

.table {
  margin-bottom: 0;
  width: 99%;
}

.m-facet-value {
  color: $primary;
  font-size: small;
  text-transform: capitalize;
}

.m-facet-value:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>
