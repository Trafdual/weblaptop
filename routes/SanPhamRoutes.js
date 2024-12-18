const express = require('express')
const router = express.Router()
const TheLoai = require('../models/theloaiSpModel')
const Chitietsp = require('../models/chitietSpModel')
const uploads = require('./upload')

router.get('/sanpham', async (req, res) => {
  try {
    const theloai = await TheLoai.theloaiSP.find().lean()
    const theloaijson = await Promise.all(
      theloai.map(async tl => {
        const sanpham = await Promise.all(
          tl.chitietsp.map(async sp => {
            const sp1 = await Chitietsp.ChitietSp.findById(sp._id)
            return {
              _id: sp1._id,
              name: sp1.name,
              image: sp1.image,
              price: sp1.price,
              manhinh: sp1.manhinh,
              chip: sp1.chip,
              ram: sp1.ram,
              pinsac: sp1.pinsac,
              congsac: sp1.congsac,
              thongtin: sp1.thongtin,
              dungluong: sp1.dungluong
            }
          })
        )
        return {
          _id: tl._id,
          name: tl.name,
          sanpham: sanpham
        }
      })
    )
    res.json(theloaijson)
  } catch (error) {
    console.log(error)
  }
})

router.post(
  '/postsanpham/:idtheloai',
  uploads.fields([
    { name: 'image', maxCount: 1 } // Một ảnh duy nhất
  ]),
  async (req, res) => {
    try {
      const {
        name,
        price,
        manhinh,
        chip,
        ram,
        pinsac,
        congsac,
        dungluong
      } = req.body
      const idtheloai = req.params.idtheloai
      const theloai = await TheLoai.theloaiSP.findById(idtheloai)
      const domain = 'http://localhost:8080'

      const image = req.files['image']
        ? `${domain}/${req.files['image'][0].filename}`
        : null

      const sanpham = new Chitietsp.ChitietSp({
        name,
        image,
        price,
        manhinh,
        chip,
        ram,
        pinsac,
        congsac,
        dungluong
      })
      theloai.chitietsp.push(sanpham._id)
      await sanpham.save()
      await theloai.save()
      res.json(sanpham)
    } catch (error) {
      console.log(error)
    }
  }
)

// router.post('/puttheloai/:idtheloai', async (req, res) => {
//   try {
//     const idtheloai = req.params.idtheloai
//     const { name } = req.body
//     const theloai = await TheLoai.theloaiSP.findById(idtheloai)
//     theloai.name = name
//     await theloai.save()
//     res.json(theloai)
//   } catch (error) {
//     console.log(error)
//   }
// })

// router.post('/deletetheloai/:idtheloai', async (req, res) => {
//   try {
//     const idtheloai = req.params.idtheloai
//     const theloai = await TheLoai.theloaiSP.findById(idtheloai)
//     await Promise.all(
//       theloai.chitietsp.map(async ct => {
//         await Chitietsp.ChitietSp.findByIdAndDelete(ct._id)
//       })
//     )
//     await TheLoai.theloaiSP.findByIdAndDelete(idtheloai)
//     res.json({ message: 'xóa thành công' })
//   } catch (error) {
//     console.log(error)
//   }
// })

module.exports = router
