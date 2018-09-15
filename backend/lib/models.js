const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let users = new mongoose.Schema({
  memberId: {
    type: Schema.Types.ObjectId,
    ref: 'Members',
    unique: true
  },
  userName: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  lastModified: {
    type: Date
  }
})

let members = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true
  },
  firstname: {
    type: String
  },
  othername: {
    type: String
  },
  surname: {
    type: String
  },
  nickname: {
    type: String
  },
  lastModified: {
    type: Date
  }
})

let pledges = new mongoose.Schema({
  memberId: {
    type: Schema.Types.ObjectId,
    ref: 'Members',
    unique: true
  },
  amount: {
    type: String
  }
})

let contributions = new mongoose.Schema({
  memberId: {
    type: Schema.Types.ObjectId,
    ref: 'Members'
  },
  period: {
    type: Date,
    required: true
  },
  datePaid: {
    type: Date,
    required: true
  },
  amount: {
    type: String
  }
})

var Members = mongoose.model('Members', members)
var Users = mongoose.model('Users', users)
var Pledges = mongoose.model('Pledges', pledges)
var Contributions = mongoose.model('Contributions', contributions)
module.exports = {
  Members,
  Users,
  Pledges,
  Contributions
}