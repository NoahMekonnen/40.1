const express = require("express")
const db = require("../db")
const ExpressError = require("../expressError")
const router = express.Router()
const slugify = require('slugify')


router.get('/', async (req, res, next) => {
    try {
        const result = await db.query("SELECT * FROM companies")
        return res.json({ companies: result.rows })
    } catch (e) {
        return next(e)
    }
})

router.get('/:code', async (req, res, next) => {
    try {
        const code = req.params.code
        const result = await db.query("SELECT * FROM companies WHERE code=$1", [code])
        const result2 = await db.query(`SELECT * FROM industries WHERE code=$1`,[code])
        
        const industries = result2.rows
        result.rows[0].industries = industries
        
        if (result) {
            return res.json({ company: result.rows[0] })
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
        const { code, name, description } = req.body
        const result = await db.query(`INSERT INTO companies (code,name)
                                    VALUES ($1,$2)`, [slugify(code,{strict:true, lower:true}),name])
        return res.json({ company: { code: code, name: name, description: description } })
    } catch (e) {
        return next(e)
    }
})

router.put('/:code', async (req, res, next) => {
    try {
        const code = req.params.code
        const { name, description } = req.body
        const result = await db.query(`UPDATE companies SET name=$1, description=$2
                                    WHERE code=$3 RETURNING *`
            , [name, description, code])
        if (result) {
            return res.json({ company: result.rows[0] })
        }
        else {
            throw new ExpressError("Not Found", 404)
        }
    } catch (e) {
        return next(e)
    }

})

router.delete('/:code', async (req, res, next) => {
    try {
        const code = req.params.code
        const result = await db.query(`DELETE FROM companies WHERE code=$1`, [code])
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


module.exports = router