const express = require('express')
const db = require("../db")
const router = express.Router()
const ExpressError = require("../expressError")

router.get('/', async (req, res, next) => {
    try {
        const result = await db.query(`SELECT id,comp_code FROM invoices`)
        return res.json({ invoices: result.rows })
    } catch (e) {
        return next(e)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id
        const result = await db.query(`SELECT id,amt,paid,add_date,
                                 paid_date FROM invoices 
                                 WHERE id=$1`, [id])

        const result2 = await db.query(`SELECT comp_code FROM invoices`)
        const comp_code = result2.rows[0]

        const company = await db.query(`SELECT code, name, description FROM companies WHERE code =$1`, [comp_code])
        result.rows[0].company = company.rows[0]

        if (result) {
            return res.json({ invoice: result.rows[0] })
        }
        else {
            throw new ExpressError("Not Found", 404)
        }
    } catch (e) {
        return next(e)
    }
})

router.post('/', async (req, res, next) => {
    try {
        console.log("HIII")
        const { comp_code, amt } = req.body
        const result = await db.query(`INSERT INTO invoices (comp_code,amt)
                                    VALUES ($1,$2) RETURNING id, comp_code, amt, paid, add_date, paid_date`
            , [comp_code, amt])
        return res.json({ invoice : result.rows[0] })
    } catch (e) {
        return next(e)
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        const id = req.params.id
        const { amt, paid } = req.body
        const result = await db.query(`UPDATE invoices SET amt=$1
                                    WHERE id=$2 RETURNING *`
            , [amt, id])
        if (result) {
            if (paid){
                db.query(`UPDATE invoices SET paid_date='03-02-2024'
                WHERE id=$1 RETURNING *`,[id])
            }
            else{
                db.query(`UPDATE invoices SET paid_date=NULL
                WHERE id=$1 RETURNING *`,[id])
            }
            return res.json({ invoice: result.rows[0] })
        }
        else {
            throw new ExpressError("Not Found", 404)
        }
    } catch (e) {
        return next(e)
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        const id = req.params.id
        const result = await db.query(`DELETE FROM invoices WHERE id=$1`, [id])
        if (result) {
            return res.json({ status: "deleted" })
        }
        else {
            throw new ExpressError("Not Found", 404)
        }
    } catch (e) {
        return next(e)
    }
})

router.get('/companies/:code', async (req, res, next) => {
    try {
        const code = req.params.code
        const result = await db.query(`SELECT * FROM companies WHERE code=$1`, [code])
        if (result) {
            const invoices = await db.query(`SELECT id FROM invoices WHERE comp_code=$1`, [code])
            result.rows[0].invoices = []
            for (let invoice of invoices.rows){
                result.rows[0].invoices.push(invoice.id)
            }
            return res.json({ company: result.rows[0] })
        }
        else {
            throw new ExpressError("Not Found", 404)
        }
    } catch (e) {
        return next(e)
    }
})




module.exports = router
