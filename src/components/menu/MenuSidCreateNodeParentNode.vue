<template>
  <div>
    <v-sheet class="ma-2" outlined dark rounded>
      <v-list-item>
        <v-list-item-subtitle>Parent Node</v-list-item-subtitle>
      </v-list-item>
      <v-list-item>
        <div>
          <v-list-item>
            <!-- <v-select
              v-if="$store.state.selectedGraph=='Information' || $store.state.selectedGraph=='Data'"
              item-text="value"
              item-value="valueId"
              return-object
              v-model="$store.state.label"
              :items="$store.state.asid.root.node.parentNodes"
            /> -->
            <v-select
              item-text="value"
              item-value="value"
              return-object
              @change="checkInput"
              v-model="$store.state.propsToAdd"
              :items="$store.state.asid.root.node.parentNodes"
            />
          </v-list-item>
        </div>
      </v-list-item>
    </v-sheet>
  </div>
</template>

<script>
// import { mapState } from "vuex";

export default {
  computed: {},
  methods: {
    checkInput() {
      this.$store.state.propsToShow = this.$store.state.propsToAdd.childProps.concat(
        this.$store.state.asid.root.node.props
      );
    }
  }
};
</script>