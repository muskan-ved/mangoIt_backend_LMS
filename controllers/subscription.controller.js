const db = require('../models/index.model')
const jsonwebtoken = require('jsonwebtoken')
const Subscription = db.Subscription

exports.createSubcsription = async (req, res) => {
    const {
        name,
        description,
        price,
        duration_term,
        duration_value,
    } = req.body

    const token = req.headers.logintoken
    const decode = jsonwebtoken.verify(token, 'this_is_seceret')
    const created_by = decode.id


    try {
        const createSubscription = await Subscription.create({
            name: name,
            description: description,
            price: price,
            duration_term: duration_term,
            duration_value: duration_value,
            created_by: created_by,
        })
        res.status(201).json(createSubscription)

    }
    catch (e) {
        res.status(400).json(e)
    }
}

exports.updateSubscription = async (req, res) => {
    const {
        name,
        description,
        price,
        duration_term,
        duration_value,
    } = req.body

    const subscriptionId = req.params.id

    const token = req.headers.logintoken
    const decode = jsonwebtoken.verify(token, 'this_is_seceret')
    const updated_by = decode.id

    const updateSubscription = await Subscription.update({
        name: name,
        description: description,
        price: price,
        duration_term: duration_term,
        duration_value: duration_value,
        updated_by: updated_by,
    }, { where: { id: subscriptionId } })

    const updatedSubscriptionValue = await Subscription.findOne({ where: { id: subscriptionId } })
    res.send(updatedSubscriptionValue)
}

exports.deleteSubscription = async (req, res) => {
    const subscriptionId = req.params.id

    const token = req.headers.logintoken
    const decode = jsonwebtoken.verify(token, 'this_is_seceret')
    const deletedBy = decode.id

    try {
        const isDeleted = await Subscription.findOne({ where: { id: subscriptionId } })
        const deleteSubscription = await Subscription.update({ isDeleted: true, deletedBy: deletedBy }, { where: { id: subscriptionId } })
        const subscriptionDeleted = await Subscription.findOne({ where: { id: subscriptionId } })
        res.status(201).json(subscriptionDeleted)
    }
    catch (e) {
        res.status(400).json(e)
    }
}