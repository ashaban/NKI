<template>
  <v-container>
    <v-layout
      row
      wrap>
      <v-spacer/>
      <v-flex xs6>
        <v-card
          class="mx-auto"
          style="max-width: 500px;">
          <v-system-bar
            color="deep-purple darken-4"
            dark/>
          <v-toolbar
            color="deep-purple accent-4"
            cards
            dark
            flat>
            <v-card-title class="title font-weight-regular">Add New Markaz</v-card-title>
          </v-toolbar>
          <v-form
            ref="form"
            class="pa-3 pt-4">
            <v-text-field
              required
              @blur="$v.name.$touch()"
              @change="$v.name.$touch()"
              :error-messages="nameErrors"
              v-model="name"
              box
              color="deep-purple"
              label="Name of Markaz"/>
            <v-text-field
              required
              @blur="$v.phone.$touch()"
              @change="$v.phone.$touch()"
              :error-messages="phoneErrors"
              v-model="phone"
              box
              color="deep-purple"
              label="Mudir Mobile Phone"/>
            <v-text-field
              v-model="alt_phone"
              box
              color="deep-purple"
              label="Mudir Alt Mobile Phone"/>
            <v-text-field
              v-model="location"
              box
              required
              @blur="$v.location.$touch()"
              @change="$v.location.$touch()"
              :error-messages="locationErrors"
              color="deep-purple"
              label="Markaz Location"/>
            <v-text-field
              required
              @blur="$v.manager.$touch()"
              @change="$v.manager.$touch()"
              :error-messages="managerErrors"
              v-model="manager"
              box
              color="deep-purple"
              label="Mudir Name"/>
            <v-text-field
              required
              @blur="$v.totalBeneficiary.$touch()"
              @change="$v.totalBeneficiary.$touch()"
              :error-messages="totalBeneficiaryErrors"
              v-model="totalBeneficiary"
              box
              color="deep-purple"
              label="Total Beneficiary"/>
          </v-form>
          <v-divider/>
          <v-card-actions>
            <v-btn
              flat
              @click="$refs.form.reset()">
              <v-icon>clear</v-icon>Clear
            </v-btn>
            <v-spacer/>
            <v-btn
              @click="addCenter()"
              :disabled="$v.$invalid"
              class="white--text"
              color="deep-purple accent-4"
              depressed><v-icon left>save</v-icon>Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-spacer/>
    </v-layout>
  </v-container>
</template>
<script>
import axios from 'axios'
import { required } from 'vuelidate/lib/validators'
const config = require('../../config')
const isProduction = process.env.NODE_ENV === 'production'
const backendServer = (isProduction ? config.build.backend : config.dev.backend)
export default {
  validations: {
    phone: { required },
    name: { required },
    location: { required },
    manager: { required },
    totalBeneficiary: { required }
  },
  data () {
    return {
      phone: '',
      alt_phone: '',
      name: '',
      manager: '',
      totalBeneficiary: '',
      location: ''
    }
  },
  methods: {
    addCenter () {
      this.$store.state.dynamicProgress = true
      this.$store.state.dynamicProgressTitle = 'Saving Center'
      let formData = new FormData()
      formData.append('name', this.name)
      formData.append('phone', this.phone)
      formData.append('alt_phone', this.alt_phone)
      formData.append('manager', this.manager)
      formData.append('location', this.location)
      formData.append('totalBeneficiary', this.totalBeneficiary)
      axios.post(backendServer + '/addCenter/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(() => {
        this.name = ''
        this.alt_phone = ''
        this.firstname = ''
        this.manager = ''
        this.location = ''
        this.totalBeneficiary = ''
        this.$store.state.dynamicProgress = false
      }).catch((err) => {
        console.log(err.response.data.error)
      })
    }
  },
  computed: {
    phoneErrors () {
      const errors = []
      if (!this.$v.phone.$dirty) return errors
      !this.$v.phone.required && errors.push('Primary Phone is required')
      return errors
    },
    nameErrors () {
      const errors = []
      if (!this.$v.name.$dirty) return errors
      !this.$v.name.required && errors.push('Markaz Name is required')
      return errors
    },
    managerErrors () {
      const errors = []
      if (!this.$v.manager.$dirty) return errors
      !this.$v.manager.required && errors.push(`Mudir's Name is required`)
      return errors
    },
    totalBeneficiaryErrors () {
      const errors = []
      if (!this.$v.totalBeneficiary.$dirty) return errors
      !this.$v.totalBeneficiary.required && errors.push('Total Beneficiaries is required')
      return errors
    },
    locationErrors () {
      const errors = []
      if (!this.$v.location.$dirty) return errors
      !this.$v.location.required && errors.push('Markaz Location is required')
      return errors
    }
  }
}
</script>
