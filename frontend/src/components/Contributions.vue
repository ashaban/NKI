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
            <v-card-title class="title font-weight-regular">Add New Member</v-card-title>
          </v-toolbar>
          <v-form
            ref="form"
            class="pa-3 pt-4">
            <v-text-field
              required
              @blur="$v.code.$touch()"
              @change="$v.code.$touch()"
              :error-messages="codeErrors"
              v-model="code"
              box
              color="deep-purple"
              label="Code"/>
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
              @click="addMember()"
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
  
}
</script>