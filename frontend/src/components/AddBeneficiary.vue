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
            <v-card-title class="title font-weight-regular">Add New Beneficiary</v-card-title>
          </v-toolbar>
          <v-form
            ref="form"
            class="pa-3 pt-4">
            <v-text-field
              required
              @blur="$v.firstname.$touch()"
              @change="$v.firstname.$touch()"
              :error-messages="firstnameErrors"
              v-model="firstname"
              box
              color="deep-purple"
              label="First Name"/>
            <v-text-field
              v-model="othername"
              box
              color="deep-purple"
              label="Middle Names"/>
            <v-text-field
              required
              @blur="$v.surname.$touch()"
              @change="$v.surname.$touch()"
              :error-messages="surnameErrors"
              v-model="surname"
              box
              color="deep-purple"
              label="Surname"/>
            <v-text-field
              v-model="nickname"
              box
              color="deep-purple"
              label="Nick Name"/>
            <v-select
              :items="centers"
              v-model="center"
              @blur="$v.center.$touch()"
              @change="$v.center.$touch()"
              :error-messages="centerErrors"
              required single-line clearable
              box
              label="Markaz"
            ></v-select>
            <v-text-field
              required
              @blur="$v.phone.$touch()"
              @change="$v.phone.$touch()"
              :error-messages="phoneErrors"
              v-model="phone"
              box
              color="deep-purple"
              label="Mobile Phone"/>
            <v-text-field
              v-model="alt_phone"
              box
              color="deep-purple"
              label="Alt Mobile Phone"/>
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
              @click="addBeneficiary()"
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
    firstname: { required },
    surname: { required },
    center: { required }
  },
  data () {
    return {
      center: '',
      phone: '',
      alt_phone: '',
      firstname: '',
      othername: '',
      surname: '',
      nickname: '',
      centers: []
    }
  },
  methods: {
    addBeneficiary () {
      this.$store.state.dynamicProgress = true
      this.$store.state.dynamicProgressTitle = 'Saving Beneficiary'
      let formData = new FormData()
      formData.append('center', this.center)
      formData.append('phone', this.phone)
      formData.append('alt_phone', this.alt_phone)
      formData.append('firstname', this.firstname)
      formData.append('othername', this.othername)
      formData.append('nickname', this.nickname)
      formData.append('surname', this.surname)
      axios.post(backendServer + '/addBeneficiary/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(() => {
        this.center = ''
        this.phone = ''
        this.alt_phone = ''
        this.firstname = ''
        this.othername = ''
        this.nickname = ''
        this.surname = ''
        this.$store.state.dynamicProgress = false
      }).catch((err) => {
        console.log(err.response.data.error)
      })
    },
    getCenters () {
      axios.get(backendServer + '/getCenters').then((cntrs)=>{
        for (let cntr of cntrs.data) {
          this.centers.push ({
            text: cntr.name,
            value: cntr._id
          })
        }
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
    centerErrors () {
      const errors = []
      if (!this.$v.center.$dirty) return errors
      !this.$v.center.required && errors.push('Markaz is required')
      return errors
    },
    firstnameErrors () {
      const errors = []
      if (!this.$v.firstname.$dirty) return errors
      !this.$v.firstname.required && errors.push('First Name is required')
      return errors
    },
    surnameErrors () {
      const errors = []
      if (!this.$v.surname.$dirty) return errors
      !this.$v.surname.required && errors.push('Surname is required')
      return errors
    }
  },
  created () {
    this.getCenters()
  }
}
</script>
