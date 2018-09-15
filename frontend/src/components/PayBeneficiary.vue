<template>
  <v-container fluid>
    <v-dialog
      v-model="beneficiaryPayDialog"
      persistent :overlay="false"
      transition="scale-transition"
      max-width="800px"
    >
      <v-card max-width="800px">
        <v-toolbar color="primary" dark>
          <v-layout row wrap>
            <v-flex xs8>
              <v-toolbar-title>
                <b>{{beneficiaryPayments.firstname}} {{beneficiaryPayments.othername}} {{beneficiaryPayments.surname}} 
                <label v-if='beneficiaryPayments.nickname'> ({{beneficiaryPayments.nickname}})</label></b>
              </v-toolbar-title>
            </v-flex>
            <v-flex xs3>
              <v-text-field v-model="searchPayments" color="white" autofocus append-icon="search" label="Search" single-line hide-details></v-text-field>
            </v-flex>
            <v-flex xs1 text-sm-right>
              <v-icon @click="beneficiaryPayDialog = false">close</v-icon>
            </v-flex>
          </v-layout>
        </v-toolbar>
        <v-card-text>
          <v-data-table :headers="singleBeneficiaryPayHeader" :items="beneficiaryPayments.Payments" :search="searchPayments" light class="elevation-1">
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
            Pay Beneficiary
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-icon @click="payDialog = false">close</v-icon>
        </v-toolbar>
        <v-card-text>
          <v-layout column>
            <v-flex>
              <b>{{payingBeneficiary.firstname}} {{payingBeneficiary.othername}} {{payingBeneficiary.surname}} 
              <label v-if='payingBeneficiary.nickname'> ({{payingBeneficiary.nickname}})</label></b>
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
        <v-text-field v-model="searchBeneficiary" append-icon="search" label="Search" single-line hide-details></v-text-field>
      </v-card-title>
      <v-data-table :headers="paymentsHeader" :items="beneficiaries" :search="searchBeneficiary" light class="elevation-1">
        <template slot="items" slot-scope="props">
          <td>{{props.item.nickname}}</td>
          <td>{{props.item.firstname}}</td>
          <td>{{props.item.othername}}</td>
          <td>{{props.item.surname}}</td>
          <td>{{props.item.phone}}</td>
          <td>{{props.item.alt_phone}}</td>
          <td>{{props.item.center}}</td>
          <td>{{currentPeriod | formatPeriod}}</td>
          <td>{{props.item.Payments | sumContributions}}</td>
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
      paymentsHeader: [
        { text: 'Kuniya', value: 'nickname' },
        { text: 'First Name', value: 'firstname' },
        { text: 'Other Name', value: 'othername' },
        { text: 'Surname', value: 'surname' },
        { text: 'Phone', value: 'phone' },
        { text: 'Alt Phone', value: 'alt_phone' },
        { text: 'Markaz Name', value: 'center' },
        { text: 'Period', value: 'period' },
        { text: 'Amount Paid', value: 'paid' }
      ],
      singleBeneficiaryPayHeader: [
        { text: 'Date Paid', value: 'datePaid' },
        { text: 'Period', value: 'period' },
        { text: 'Amount', value: 'amount' }
      ],
      beneficiaries: [],
      ben: [],
      searchBeneficiary: '',
      searchPayments: '',
      currentPeriod: moment().format('MMMMYYYY'),
      payDialog: false,
      payingBeneficiary: {},
      amountPaid: '',
      datePaid: '',
      payPeriod: '',
      beneficiaryPayments: [],
      beneficiaryPayDialog: false
    }
  },
  methods: {
    viewAll (id) {
      this.beneficiaryPayDialog = true
      if (!id) {
        id = ''
      }
      axios.get (backendServer + '/getBeneficiaryPay/all/' + id).then((payments)=>{
        this.beneficiaryPayments = payments.data[0]

      }).catch((err)=>{

      })
    },
    getPayments (period, id) {
      if (!period) {
        period = this.currentPeriod
      }
      if (!id) {
        id = ''
      }
      axios.get (backendServer + '/getBeneficiaryPay/' + period + '/' + id).then((payments)=>{
        this.beneficiaries = payments.data
      }).catch((err)=>{

      })
    },
    displayPayBox (id) {
      this.payingBeneficiary = this.beneficiaries.find((beneficiary)=>{
        return beneficiary._id === id
      })
      this.payDialog = true
    },
    savePayment () {
      this.payDialog = false
      this.$store.state.dynamicProgress = true
      this.$store.state.dynamicProgressTitle = 'Saving Payment'
      let period = moment(this.payPeriod).format('MMMMYYYY')
      let formData = new FormData()
      formData.append('_id', this.payingBeneficiary._id)
      formData.append('amount', this.amountPaid)
      formData.append('period', period)
      formData.append('datePaid', this.datePaid)
      axios.post(backendServer + '/payBeneficiary/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(() => {
        this.getPayments()
        this.amountPaid = ''
        this.datePaid = ''
        this.payPeriod = ''
        this.payingBeneficiary = {}
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
      for (let k = 0;k < this.beneficiaries.length;k++) {
        for (let ctr of this.beneficiaries[k].Payments) {
          contributions += parseInt(ctr.amount)
        }
      }
      return contributions.toLocaleString() + '/='
    }
  },
  created () {
    this.getPayments()
  },
  components: { datepicker }
}
</script>
