const express = require('express')
const db = require("../db")
const router = express.Router()
const ExpressError = require("../expressError")

router.get('/', async (req, res, next) =>{
    try{
        const result = await db.query(`SELECT * FROM industries`)
        return res.json({industries: result.rows})
    }catch(e){
        return next(e)
    }
})

router.post('/', async (req, res, next) =>{
    try{
        const { code, industry } = req.body
        const result = await db.query(`INSERT INTO industries (code,industry)
                                    VALUES ($1,$2) RETURNING code, industry`
            , [code, industry])
        const result2 = await db.query(`SELECT industry FROM companies_industries WHERE industry=$1`,[industry])
        const industries = result2.rows[0]
        result.rows[0].industries = industries
        return res.json({industry: result.rows[0]})
    }catch(e){
        return next(e)
    }
})

router.post('/:code', async (req, res, next) =>{
    try{
        const code = req.params.code
        const {industry} = req.body
        const result = await db.query(`INSERT INTO companies_industries (industry,company_code)
        VALUES ($1,$2) RETURNING industry, company_code`,[industry,code])
        return res.json({company_industry: result.rows[0]})
    }catch(e){
        return next(e)
    }
})