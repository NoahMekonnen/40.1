const express = require('express')
const db = require("../db")
const router = express.Router()
const ExpressError = require("../expressError")

router.get('/', async (req, res, next) => {
    const result = await db.query(`SELECT * FROM invoices`)
    return res.json({ invoice: result.rows })
})

router.get('/:id', async (req, res, next) => {
    const id = req.params.id
    const result = await db.query(`SELECT id,amt,paid,add_date,
                                 paid_date FROM invoices 
                                 WHERE id=$1`, [id])
    if (result) {
        return res.json({ invoice: result.rows[0] })
    }
    else {
        throw new ExpressError("Not Found", 404)
    }
})

router.post('/', async (req, res, next) => {
    const { code, name, description } = req.body
    const result = await db.query(`INSERT INTO invoices (compt_code,amt)
                                    VALUES ($1,$2) RETURNING id, comp_code, amt, paid, add_date, paid_date`
        , [compt_code, amt])
    return res.json({ company: result.rows[0] })
})

router.put('/:id', async (req, res, next) => {
    const id = req.params.id
    const { amt } = req.body
    const result = await db.query(`UPDATE invoices SET amt=$1
                                    WHERE id=$2 RETURNING *`
        , [amt, id])
    if (result) {
        return res.json({ company: result.rows[0] })
    }
    else {
        throw new ExpressError("Not Found", 404)
    }

})

router.delete('/:id', async (req, res, next) => {
    const id = req.params.id
    const result = await db.query(`DELETE FROM invoices WHERE id=$1`, [id])
    if (result) {
        return res.json({ status: "deleted" })
    }
    else {
        throw new ExpressError("Not Found", 404)
    }
})

router.get('/companies/:code', async (req, res, next) => {
    const code = req.params.code
    const result = db.query(`SELECT * FROM companies WHERE code=$1`, [code])
    if (result) {
        const invoices = db.query(`SELECT * FROM invoices WHERE compt_code=$1`, [code])
        result.rows[0].invoices = invoices.rows
        return res.json({ company: result.rows[0] })
    }
    else {
        throw new ExpressError("Not Found", 404)
    }
})




module.exports = router
