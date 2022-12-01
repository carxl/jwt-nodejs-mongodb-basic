import {Router} from 'express'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import config from '../config.js'
import verifyToken from './verifyToken.js'

const router = Router()

router.post('/signup', async (req, res)=>{
    const {username, email, password} = req.body
    const user = new User({
        username,
        email,
        password
    })

    user.password = await user.encryptPassword(user.password)
    await user.save()
    const token = jwt.sign({id:user.id}, config.secret, {
        expiresIn: 60*60*24
    })
    res.json({auth:true, id:user.id, token})
})
router.post('/me', verifyToken, async(req, res)=>{
    const user = await User.findById(req.userId, {password:0})
    if (!user) {
        return res.status(404).send('No user found')
    }
    res.json(user)
})

router.post('/signin', async (req, res)=>{
    const {email,password} = req.body
    const user = await User.findOne({email})

    if (!user) {
        return res.status(404).send("Email doesn't exists")
    }
    const validPassword = await user.validatePassword(password)

    if (!validPassword) {
        return res.status(401).json({auth:false, token:null})
    }
    const token = jwt.sign({id:user.id}, config.secret, {
        expiresIn: 60*60*24
    })
    res.json({auth:true, id:user.id, token})
    // res.json({message:'OK'})
})


export default router