require('./init');
const express = require('express');
const formidable = require('formidable');
const winston = require('winston')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var cors = require('cors');

require('./connection')
const config = require('./config');
const models = require('./models')
const app = express();
const server = require('http').createServer(app);

app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());
app.use(cors({
  origin: true,
  credentials: true
}));

winston.remove(winston.transports.Console)
winston.add(winston.transports.Console, {
  level: 'info',
  timestamp: true,
  colorize: true
})

app.post('/addMember', (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    let members = new models.Members({
      _id: new mongoose.Types.ObjectId(),
      code: fields.code,
      firstname: fields.firstname,
      othername: fields.othername,
      surname: fields.surname,
      nickname: fields.nickname
    })
    members.save((err, data) => {
      let User = new models.Users({
        memberId: members._id,
        userName: fields.code,
        password: fields.code
      })
      User.save((err, data) => {
        if (err) {
          winston.error('Unexpected error occured,please retry')
          res.status(401).send()
        } else {
          winston.info('Member added successfully')
          res.status(200).send()
        }
      })
    })
  })
})

app.get('/getPledges', (req, res) => {
  models.Members.find({}).lean().exec((err, members) => {
    const membersPromise = []
    for (let k = 0; k < members.length; k++) {
      membersPromise.push(new Promise((resolve, reject) => {
        models.Pledges.find({
          memberId: members[k]._id
        }).exec((err, pldg) => {
          if (pldg && pldg.hasOwnProperty(0)) {
            members[k].pledge = pldg[0].amount
          }
          else {
            members[k].pledge = ''
          }
          resolve()
        })
      }))
    }
    Promise.all(membersPromise).then(() => {
      res.status(200).json(members)
    })
  })
})

app.post('/addPledge', (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    let Pledges = new models.Pledges({
      memberId: fields._id,
      amount: fields.amount
    })
    let query = {
      memberId: fields._id
    }
    let update = {
      memberId: fields._id,
      amount: fields.amount
    }
    models.Pledges.findOneAndUpdate(query, update, (err, data) => {
      if (!data) {
        Pledges.save((err, data) => {
          if (err) {
            winston.error('Unexpected error occured,please retry')
            res.status(401).send()
          } else {
            winston.info('Pledge Added Successfully')
            res.status(200).send()
          }
        })
      }
      if (err) {
        winston.error('Unexpected error occured,please retry')
        res.status(401).send()
      } else {
        winston.info('Pledge Added Successfully')
        res.status(200).send()
      }
    })
  })
})

app.get('/getContributions/:period/:id?', (req, res) => {
  let idFilter
  if (req.params.id) {
    idFilter = {
      _id: req.params.id
    }
  } else {
    idFilter = {}
  }
  let contrFilter
  models.Members.find(idFilter).lean().exec((err, members) => {
    const membersPromise = []
    for (let k = 0; k < members.length; k++) {
      membersPromise.push(new Promise((resolve, reject) => {
        if (req.params.period === 'all') {
          contrFilter = {
            memberId: members[k]._id
          }
        } else {
          contrFilter = {
            memberId: members[k]._id,
            period: req.params.period
          }
        }
        models.Contributions.find(contrFilter).exec((err, contr) => {
          if (contr && contr.hasOwnProperty(0)) {
            members[k].Contributions = contr
          } else {
            members[k].Contributions = []
          }
          resolve()
        })
      }))
    }
    Promise.all(membersPromise).then(() => {
      res.status(200).json(members)
    })
  })
})

app.post('/addPayment', (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    let Contributions = new models.Contributions({
      memberId: fields._id,
      amount: fields.amount,
      period: fields.period,
      datePaid: fields.datePaid
    })
    
    Contributions.save((err, data) => {
      if (err) {
        winston.error(err)
        winston.error('Unexpected error occured,please retry')
        res.status(401).send()
      } else {
        winston.info('Payments Done Successfully')
        res.status(200).send()
      }
    })
  })
})

app.post('/addBeneficiary', (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    let beneficiary = new models.Beneficiary({
      phone: fields.phone,
      alt_phone: fields.alt_phone,
      centerId: fields.center,
      firstname: fields.firstname,
      othername: fields.othername,
      surname: fields.surname,
      nickname: fields.nickname
    })
    beneficiary.save((err, data) => {
      if (err) {
        winston.error(err)
        winston.error('Unexpected error occured,please retry')
        res.status(401).send()
      } else {
        winston.info('Beneficiary added successfully')
        res.status(200).send()
      }
    })
  })
})

app.post('/addCenter', (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    winston.error(fields)
    let center = new models.Center({
      phone: fields.phone,
      alt_phone: fields.alt_phone,
      name: fields.name,
      manager: fields.manager,
      totalBeneficiary: fields.totalBeneficiary,
      location: fields.location
    })
    center.save((err, data) => {
      if (err) {
        winston.error(err)
        winston.error('Unexpected error occured,please retry')
        res.status(401).send()
      } else {
        winston.info('Center added successfully')
        res.status(200).send()
      }
    })
  })
})

app.get('/getCenters/:id?', (req, res) => {
  let idFilter
  if (req.params.id) {
    idFilter = {
      _id: req.params.id
    }
  } else {
    idFilter = {}
  }
  models.Center.find(idFilter).lean().exec((err, data) => {
    if (err) {
      winston.error(err)
      winston.error('Unexpected error occured,please retry')
      res.status(401).send()
    } else {
      winston.info('Center returned successfully')
      res.status(200).json(data)
    }
  })
})

app.get('/getBeneficiaryPay/:period/:id?', (req, res) => {
  let idFilter
  if (req.params.id) {
    idFilter = {
      _id: req.params.id
    }
  } else {
    idFilter = {}
  }
  let contrFilter
  winston.info('Received a request to get beneficiary payments')
  models.Beneficiary.find(idFilter).lean().exec((err, beneficiaries) => {
    const beneficiariesPromise = []
    for (let k = 0; k < beneficiaries.length; k++) {
      beneficiariesPromise.push(new Promise((resolve, reject) => {
        if (req.params.period === 'all') {
          contrFilter = {
            beneficiaryId: beneficiaries[k]._id
          }
        } else {
          contrFilter = {
            beneficiaryId: beneficiaries[k]._id,
            period: req.params.period
          }
        }
        models.BeneficiaryPayments.find(contrFilter).populate('center', 'name').exec((err, payments) => {
          if (payments && payments.hasOwnProperty(0)) {
            beneficiaries[k].Payments = payments
          } else {
            beneficiaries[k].Payments = []
          }
          resolve()
        })
      }))
    }
    Promise.all(beneficiariesPromise).then(() => {
      winston.info('sending back beneficiary payments')
      res.status(200).json(beneficiaries)
    })
  })
})

app.post('/payBeneficiary', (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    let Contributions = new models.BeneficiaryPayments({
      beneficiaryId: fields._id,
      amount: fields.amount,
      period: fields.period,
      datePaid: fields.datePaid
    })

    Contributions.save((err, data) => {
      if (err) {
        winston.error(err)
        winston.error('Unexpected error occured,please retry')
        res.status(401).send()
      } else {
        winston.info('Contribution Added Successfully')
        res.status(200).send()
      }
    })
  })
})
server.listen(config.getConf('server:port'));
winston.info(`Server is running and listening on port ${config.getConf('server:port')}`);