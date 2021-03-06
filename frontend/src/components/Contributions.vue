<template>
  <v-container fluid>
    <v-dialog
      v-model="memberContrDialog"
      persistent :overlay="false"
      transition="scale-transition"
      max-width="800px"
    >
      <v-card max-width="800px">
        <v-toolbar color="primary" dark>
          <v-layout row wrap>
            <v-flex xs8>
              <v-toolbar-title>
                <b>{{memberContributions.firstname}} {{memberContributions.othername}} {{memberContributions.surname}} 
                <label v-if='memberContributions.nickname'> ({{memberContributions.nickname}})</label></b>
              </v-toolbar-title>
            </v-flex>
            <v-flex xs3>
              <v-text-field v-model="searchContr" color="white" autofocus append-icon="search" label="Search" single-line hide-details></v-text-field>
            </v-flex>
            <v-flex xs1 text-sm-right>
              <v-icon @click="memberContrDialog = false">close</v-icon>
            </v-flex>
          </v-layout>
        </v-toolbar>
        <v-card-text>
          <v-data-table :headers="singleMemberContrHeader" :items="memberContributions.Contributions" :search="searchContr" light class="elevation-1">
            <template slot="items" slot-scope="props">
              <td>{{props.item.datePaid | formatDate}}</td>
              <td>{{props.item.period}}</td>
              <td>{{props.item.amount.toLocaleString()}}</td>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog persistent v-model="payDialog" transition="scale-transition" max-width="500px">
      <v-card height="500px">
        <v-toolbar color="primary" dark>
          <v-toolbar-title>
            Add Payments
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-icon @click="payDialog = false">close</v-icon>
        </v-toolbar>
        <v-card-text>
          <v-layout column>
            <v-flex>
              <b>{{payingMember.firstname}} {{payingMember.othername}} {{payingMember.surname}} 
              <label v-if='payingMember.nickname'> ({{payingMember.nickname}})</label></b>
            </v-flex>
            <v-flex>
              <v-text-field v-model="amountPaid" 
                @blur="$v.amountPaid.$touch()"
                @change="$v.amountPaid.$touch()"
                :error-messages="amountPaidErrors"
                required
                label="Amount Paid">
              </v-text-field>
            </v-flex>
            <v-flex>
              Date Paid
              <datepicker v-model="datePaid" 
                @blur="$v.datePaid.$touch()"
                @change="$v.datePaid.$touch()"
                :error-messages="datePaidErrors">
              </datepicker>
            </v-flex>
            <v-flex>
              Pay Period
              <datepicker v-model="payPeriod"
                @blur="$v.payPeriod.$touch()"
                @change="$v.payPeriod.$touch()"
                :error-messages="payPeriodErrors">
              </datepicker>
            </v-flex>
          </v-layout>
        </v-card-text>
        <br><br><br><br><br><br>
        <v-card-actions>
          <v-layout column>
            <v-flex height="500">
              <v-spacer></v-spacer>
            </v-flex>
            <v-flex>
              <v-toolbar color="brown lighten-2">
                <v-layout row wrap>
                  <v-flex xs6 text-sm-left>
                    <v-btn color="error" @click.native="payDialog = false"><v-icon left>cancel</v-icon> Cancel</v-btn>
                  </v-flex>
                  <v-flex xs6 text-sm-right>
                    <v-btn color="primary" :disabled="$v.$invalid" dark @click.native="savePayment()"><v-icon left>save</v-icon>Save Payment</v-btn>
                  </v-flex>
                </v-layout>
              </v-toolbar>
            </v-flex>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card color="green lighten-2" dark>
      <v-card-title primary-title>
        <b>Contributions</b>
        <v-spacer></v-spacer>
        <b>Total {{sum}}</b>
        <v-spacer></v-spacer>
        <v-text-field v-model="searchMember" append-icon="search" label="Search" single-line hide-details></v-text-field>
      </v-card-title>
      <v-data-table :headers="contributionsHeader" :items="members" :search="searchMember" light class="elevation-1">
        <template slot="items" slot-scope="props">
          <td>{{props.item.code}}</td>
          <td>{{props.item.nickname}}</td>
          <td>{{props.item.firstname}}</td>
          <td>{{props.item.othername}}</td>
          <td>{{props.item.surname}}</td>
          <td>{{currentPeriod | formatPeriod}}</td>
          <td>{{props.item.Contributions | sumContributions}}</td>
          <td>
            <v-btn color="secondary"><v-icon>edit</v-icon>Edit</v-btn>
            <v-btn color="primary" @click="displayPayBox(props.item._id)"><v-icon left>local_atm</v-icon> Pay</v-btn>
            <v-btn color="success" @click="viewAll(props.item._id)"><v-icon left>report</v-icon> View All</v-btn>
          </td>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<script>
import moment from 'moment'
import datepicker from 'vue-date'
import axios from 'axios'
import { required, integer, minValue } from 'vuelidate/lib/validators'
const config = require('../../config')
const isProduction = process.env.NODE_ENV === 'production'
const backendServer = (isProduction ? config.build.backend : config.dev.backend)
export default {
  validations: {
    amountPaid: { integer, required, minValue: minValue(10000) },
    datePaid: { required },
    payPeriod: { required }
  },
  filters: {
    sumContributions (contr) {
      if (contr.length === 0) {
        return 0
      }
      let contributions = 0
      for (let ctr of contr) {
        contributions += parseInt(ctr.amount)
      }
      return contributions.toLocaleString()
    },
    formatPeriod (per) {
      return moment().format('MMMM YYYY')
    },
    formatDate (date) {
      return moment(date).format('DD-MM-YYYY')
    }
  },
  data () {
    return {
      contributionsHeader: [
        { text: 'Code', value: 'code' },
        { text: 'Kuniya', value: 'nickname' },
        { text: 'First Name', value: 'firstname' },
        { text: 'Other Name', value: 'othertname' },
        { text: 'Surname', value: 'surname' },
        { text: 'Period', value: 'period' },
        { text: 'Amount Paid', value: 'paid' }
      ],
      singleMemberContrHeader: [
        { text: 'Date Paid', value: 'datePaid' },
        { text: 'Period', value: 'period' },
        { text: 'Amount', value: 'amount' }
      ],
      members: [],
      searchMember: '',
      searchContr: '',
      currentPeriod: moment().format('MMMMYYYY'),
      payDialog: false,
      payingMember: {},
      amountPaid: '',
      datePaid: '',
      payPeriod: '',
      memberContributions: [],
      memberContrDialog: false
    }
  },
  methods: {
    viewAll (id) {
      this.memberContrDialog = true
      if (!id) {
        id = ''
      }
      axios.get (backendServer + '/getContributions/all/' + id).then((contributions)=>{
        this.memberContributions = contributions.data[0]

      }).catch((err)=>{

      })
    },
    getContributions (period, id) {
      if (!period) {
        period = this.currentPeriod
      }
      if (!id) {
        id = ''
      }
      axios.get (backendServer + '/getContributions/' + period + '/' + id).then((contributions)=>{
        this.members = contributions.data
        console.log(this.members)
      }).catch((err)=>{

      })
    },
    displayPayBox (id) {
      this.payingMember = this.members.find((member)=>{
        return member._id === id
      })
      this.payDialog = true
    },
    savePayment () {
      this.payDialog = false
      this.$store.state.dynamicProgress = true
      this.$store.state.dynamicProgressTitle = 'Saving Payment'
      let period = moment(this.payPeriod).format('MMMMYYYY')
      let formData = new FormData()
      formData.append('_id', this.payingMember._id)
      formData.append('amount', this.amountPaid)
      formData.append('period', period)
      formData.append('datePaid', this.datePaid)
      axios.post(backendServer + '/addPayment/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(() => {
        this.getContributions()
        this.amountPaid = ''
        this.datePaid = ''
        this.payPeriod = ''
        this.payingMember = {}
        this.$store.state.dynamicProgress = false
      }).catch((err) => {
        console.log(err.response.data.error)
        this.$store.state.dynamicProgress = false
      })
    }
  },
  computed: {
    amountPaidErrors () {
      const errors = []
      if (!this.$v.amountPaid.$dirty) return errors
      !this.$v.amountPaid.integer && errors.push('Amount must be integer')
      !this.$v.amountPaid.required && errors.push('Amount is required')
      !this.$v.amountPaid.minValue && errors.push('Minimum value is 10000')
      return errors
    },
    payPeriodErrors () {
      const errors = []
      if (!this.$v.payPeriod.$dirty) return errors
      !this.$v.payPeriod.required && errors.push('Period is required')
      return errors
    },
    datePaidErrors () {
      const errors = []
      if (!this.$v.datePaid.$dirty) return errors
      !this.$v.datePaid.required && errors.push('Payment Date is required')
      return errors
    },
    sum () {
      let contributions = 0
      for (let k=0;k<this.members.length;k++) {
        for (let ctr of this.members[k].Contributions) {
          contributions += parseInt(ctr.amount)
        }
      }
      return contributions.toLocaleString() + '/='
    }
  },
  created () {
    this.getContributions()
  },
  components: { datepicker }
}
</script>
