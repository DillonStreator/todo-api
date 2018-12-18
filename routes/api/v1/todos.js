const express = require('express'),
        router = express.Router();

const db = require('../../../db');

router.get('/', async (req, res, next) => {

        try {
                const result = await db.Query("SELECT * FROM todos.todo WHERE user_id = $1",[req.user.id]);
                const todos = result.rows;
                res.status(200).json({data:{todos},message:"Successfully got todos."});
        }
        catch (error) {
                next(error);
        }
});

router.post('/', async (req, res, next) => {
        
        try {
                if (!req.body.todo) return res.status(400).json({data:{},message:"You must provide a todo item!"});

                const result = await db.Query("INSERT INTO todos.todo (text, completed, created_at, user_id) VALUES ($1, $2, $3, $4) RETURNING *",[req.body.todo, req.body.completed || false, new Date(), req.user.id]);
                const todo = result.rows[0];
                return res.status(201).json({data:{todo},message:"Successfully created todo!"});
        }
        catch (error) {
                next(error);
        }
});

router.put('/:id', async (req, res, next) => {

        try {
                if (!req.body.todo || !req.body.completed) return res.status(400).json({data:{},message:"You must provide content to update the todo with."});

                let lookupResult = await db.Query("SELECT * FROM todos.todo WHERE id = $1 AND user_id = $2",[req.params.id,req.user.id]);
                if (!lookupResult.rows.length) return res.status(400).json({data:{},message:"Could not find that todo."});

                let updateResult = await db.Query("UPDATE todos.todo SET text = $1, completed = $2 updated_at = $3 WHERE id = $4 RETURNING *",[req.body.todo,req.body.completed,new Date(),req.params.id]);
                let todo = updateResult.rows[0];

                return res.status(200).json({data:{todo},message:"Successfully updated todo!"});

        }
        catch (error) {
                next(error);
        }
});

router.get('/:id', async (req, res, next) => {

        try {
                let lookupResult = await db.Query("SELECT * FROM todos.todo WHERE id = $1 AND user_id = $2",[req.params.id,req.user.id]);
                if (!lookupResult.rows.length) return res.status(400).json({data:{},message:"Could not find that todo."});

                let todo = lookupResult.rows[0];
                return res.status(200).json({data:{todo},message:"Here's the todo."});                
        }
        catch (error) {
                next(error);
        }
});

router.delete('/:id', async (req, res, next) => {

        try {
                let lookupResult = await db.Query("SELECT * FROM todos.todo WHERE id = $1 AND user_id = $2",[req.params.id,req.user.id]);
                if (!lookupResult.rows.length) return res.status(400).json({data:{},message:"Could not find that todo."});

                let deleteResult = await db.Query("DELETE FROM todos.todo WHERE id = $1",[req.params.id]);
                return res.status(200).json({data:{},message:"Successfully deleted todo!"});

        }
        catch (error) {
                next(error);
        }
});

module.exports = router;