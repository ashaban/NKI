<template>
  <v-container>
    <v-layout column>
      <v-dialog persistent v-model="editDialog" max-width="500px">
        <v-card>
          <v-toolbar color="primary" dark>
            <v-toolbar-title>
              Edit Pledge
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-icon @click="editDialog = false">close</v-icon>
          </v-toolbar>
          <v-card-text>
            <v-text-field v-model="pledgeAmount" 
              @blur="$v.pledgeAmount.$touch()"
              @change="$v.pledgeAmount.$touch()"
              :error-messages="pledgeAmountErrors" 
              label="Pledge Amount">
            </v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="error" @click.native="editDialog = false">Cancel</v-btn>
            <v-btn color="primary" :disabled="$v.$invalid" dark @click.native="savePledge()">Save Pledge</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-flex>
        <v-card color="green lighten-2" dark>
            <v-card-title primary-title>
              <b>Pledges</b>
              <v-spacer></v-spacer>
              <v-text-field v-model="searchMember" append-icon="search" label="Search" single-line hide-details></v-text-field>
            </v-card-title>
            <v-data-table :headers="pledgesHeader" :items="members" :search="searchMember" light class="elevation-1">
            <template slot="items" slot-scope="props">
              <td>{{props.item.code}}</td>
              <td>{{props.item.nickname}}</td>
              <td>{{props.item.firstname}}</td>
              <td>{{props.item.othername}}</td>
              <td>{{props.item.surname}}</td>
              <td>{{props.item.pledge}}</td>
              <td><v-icon @click="editPledge(props.item._id)">edit</v-icon></td>
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import axios from 'axios'
const config = require('../../config')
const isProduction = process.env.NODE_ENV === 'production'
const backendServer = (isProduction ? config.build.backend : config.dev.backend)
import { integer } from 'vuelidate/lib/validators'
export default {
  validations: {
    pledgeAmount: { integer }
  },
  data () {
    return {
      pledgesHeader: [
        { text: 'Code', value: 'code' },
        { text: 'Kuniya', value: 'nickname' },
        { text: 'First Name', value: 'firstname' },
        { text: 'Other Name', value: 'othertname' },
        { text: 'Surname', value: 'surname' },
        { text: 'Pledge', value: 'pledge' }
      ],
      members: [],
      searchMember: '',
      editDialog: false,
      pledgeAmount: '',
      editingPledge: {}
    }
  },
  methods: {
    getPledges () {
      axios.get (backendServer + '/getPledges').then((pledges)=>{
        this.members = pledges.data
      }).catch((err)=>{

      })
    },
    editPledge (_id) {
      this.editDialog = true
      this.editingPledge = this.members.find ((member)=>{
        return member._id === _id
      })
    },
    savePledge () {
      this.editDialog = false,
      this.$store.state.dynamicProgress = true
      this.$store.state.dynamicProgressTitle = 'Saving Pledge'
      this.editingPledge.pledge = this.pledgeAmount
      let formData = new FormData()
      formData.append('_id', this.editingPledge._id)
      formData.append('amount', this.pledgeAmount)
      axios.post(backendServer + '/addPledge/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(() => {
        this.pledgeAmount = ''
        this.$store.state.dynamicProgress = false
      }).catch((err) => {
        console.log(err.response.data.error)
      })
    }
  },
  computed: {
    pledgeAmountErrors () {
      const errors = []
      if (!this.$v.pledgeAmount.$dirty) return errors
      !this.$v.pledgeAmount.integer && errors.push('Amount must be integer')
      return errors
    }
  },
  created () {
    this.getPledges()
  }
}
</script>

