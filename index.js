const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const session = require('express-session')
const methodOverride = require('method-override')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const sanphamroutes = require('./routes/SanPhamRoutes')
const theloaiRoutes = require('./routes/theloaiRoutes')
const thanhtoanroutes =require('./routes/ThanhToanRoutes')

const MongoStore = require('connect-mongo')

var path = require('path')

var app = express()
app.use(methodOverride('_method'))

const uri =
  'mongodb+srv://nnchien03:chien123@cluster0.fysyj.mongodb.net/webtmdt?retryWrites=true&w=majority&appName=Cluster0'

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(console.log('kết nối thành công'))

const mongoStoreOptions = {
  mongooseConnection: mongoose.connection,
  mongoUrl: uri,
  collection: 'sessions'
}

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, '/public')))
app.use(express.static(path.join(__dirname, '/uploads')))
app.use(express.static(path.join(__dirname, '/images')))

app.use(express.static(path.join(__dirname, '/style')))

app.use(
  session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create(mongoStoreOptions),
    cookie: {
      secure: false
    }
  })
)
app.use(cors())
app.use('/', theloaiRoutes)
app.use('/', sanphamroutes)
app.use('/',thanhtoanroutes)

const port = process.env.PORT || 8080

app.listen(port, () => {
  try {
    console.log('kết nối thành công 8080')
  } catch (error) {
    console.log('kết nối thất bại 8080', error)
  }
})
