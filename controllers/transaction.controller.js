const db = require('../models/index.model')
require('dotenv').config()
const jsonwebtoken = require('jsonwebtoken')
const Transaction = db.Transaction
const User = db.User

exports.createTransaction = async (req, res) => {
    const {
        order_id,
        user_id,
        payment_method,
        transaction_id,
    } = req.body

    const token = req.headers.logintoken
    const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY)
    const login_user = decode.id

    try {
        const findUser = await User.findOne({ where: { id: login_user } })

        if (!(findUser.role_id == 1)) {    //learner user
            const transactionCreate = await Transaction.create({
                order_id: order_id,
                user_id: login_user,
                payment_method: payment_method,
                created_by: login_user,
                transaction_id: transaction_id,
            })
            res.status(201).json(transactionCreate)
        }

        if (findUser.role_id == 1) {     //admin user
            const transactionCreate = await Transaction.create({
                order_id: order_id,
                user_id: user_id,
                payment_method: payment_method,
                transaction_id: transaction_id,
                created_by: login_user
            })
            res.status(201).json(transactionCreate)
        }

    }
    catch (e) {
        res.status(400).json(e)
    }
}

exports.updateTransaction = async (req, res) => {
    const transactionId = req.params.id
    const {
        order_id,
        user_id,
        payment_method,
        transaction_id,
    } = req.body

    const token = req.headers.logintoken
    const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY)
    const updated_by = decode.id

    const transactionUpdate = Transaction.update(
        {
            order_id: order_id,
            user_id: user_id,
            payment_method: payment_method,
            transaction_id: transaction_id,
            updated_by: updated_by
        },
        {
            where: { id: transactionId }
        }
    )
    const newUpdatedTransaction = await Transaction.findOne({ where: { id: transactionId } })
    res.status(201).json(newUpdatedTransaction)

}

exports.deleteTransaction = async (req, res) => {
    const transactionId = req.params.id

    const token = req.headers.logintoken
    const decode = jsonwebtoken.verify(token, process.env.SIGNING_KEY)
    const deleted_by = decode.id

    try {
        const transactionDelete = await Transaction.update({
            is_deleted: true,
            deleted_by: deleted_by
        }, { where: { id: transactionId } })

        const transactiinDeleted = await Transaction.findOne({where:{id: transactionId }})
        res.status(201).json(transactiinDeleted)
    }
    catch (e) {
        res.status(400).json(e)
    }

}