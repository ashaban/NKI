<template>
  <v-app>
    <v-toolbar
      color="primary"
      dark
      app>
      <v-toolbar-title v-text="title"/>
      <v-toolbar-items>
        <v-btn
          to="/"
          flat>
          <v-icon>home</v-icon>Home
        </v-btn>
        <v-btn
          to="/addMember"
          flat>
          <v-icon>add</v-icon>Add Member
        </v-btn>
        <v-btn
          to="/Pledges"
          flat>
          <v-icon>money</v-icon>Pledges
        </v-btn>
        <v-btn
          to="/Contributions"
          flat>
          <v-icon>local_atm</v-icon>Contributions
        </v-btn>
      </v-toolbar-items>
      <v-spacer/>
    </v-toolbar>
    <v-content>
      <v-dialog v-model="$store.state.dynamicProgress" hide-overlay persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            {{$store.state.dynamicProgressTitle}}
            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
      <router-view/>
    </v-content>
    <v-footer
      dark
      color="primary"
      :fixed="fixed"
      app/>
  </v-app>
</template>
<script>
export default {
  data () {
    return {
      initializingApp: false,
      fixed: false,
      title: 'Ndugu Katika Imani'
    }
  }
}
</script>
