const db = require('./db')

const chitietspSchema = new db.mongoose.Schema({
  image: { type: String },
  name: { type: String },
  price: { type: Number },
  manhinh: { type: String },
  chip: { type: String },
  ram: { type: String },
  pinsac: { type: String },
  congsac: { type: String },
  dungluong: { type: String },
  idloaisp: { type: db.mongoose.Schema.Types.ObjectId, ref: 'loaisp' }
})

const ChitietSp = db.mongoose.model('chitietsp', chitietspSchema)
module.exports = { ChitietSp }
