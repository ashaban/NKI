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
    type: String,
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

let beneficiary = new mongoose.Schema({
  centerId: {
    type: Schema.Types.ObjectId,
    ref: 'Center',
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  alt_phone: {
    type: String
  },
  firstname: {
    type: String,
    required: true
  },
  othername: {
    type: String
  },
  surname: {
    type: String,
    required: true
  },
  nickname: {
    type: String
  }
})

let beneficiaryPayments = new mongoose.Schema({
  beneficiaryId: {
    type: Schema.Types.ObjectId,
    ref: 'Beneficiary',
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  datePaid: {
    type: Date,
    required: true
  },
  period: {
    type: String,
    required: true
  }
})

let center = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  alt_phone: {
    type: String
  },
  location: {
    type: String,
    required: true
  },
  manager: {
    type: String,
    required: true
  },
  totalBeneficiary: {
    type: String,
    required: true
  }
})

var Members = mongoose.model('Members', members)
var Users = mongoose.model('Users', users)
var Pledges = mongoose.model('Pledges', pledges)
var Contributions = mongoose.model('Contributions', contributions)
var Beneficiary = mongoose.model('Beneficiary', beneficiary)
var BeneficiaryPayments = mongoose.model('BeneficiaryPayments', beneficiaryPayments)
var Center = mongoose.model('Center', center)
module.exports = {
  Members,
  Users,
  Pledges,
  Contributions,
  Beneficiary,
  BeneficiaryPayments,
  Center
}