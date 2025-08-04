const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const connectToDatabase = require('../models/db');
const logger = require('../logger');

// Define the upload directory path
const directoryPath = 'public/images';

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, directoryPath); // Specify the upload directory
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original file name
    },
});

const upload = multer({ storage: storage });


// Get all secondChanceItems
router.get('/', async (req, res, next) => {
    logger.info('/ called');
    try {
        const db = await connectToDatabase();
        const collection = db.collection("secondChanceItems");
        const secondChanceItems = await collection.find({}).toArray();
        res.json(secondChanceItems);
    } catch (e) {
        logger.console.error('oops something went wrong', e)
        next(e);
    }
});

// Add a new item
const { ObjectId } = require('mongodb'); // 如果你后续要用 _id

router.post('/', upload.single('file'), async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("secondChanceItems");

    let secondChanceItem = req.body;

    // 获取当前最大 id（假设你是自己维护 string 型 id）
    const lastItems = await collection.find().sort({ id: -1 }).limit(1).toArray();
    if (lastItems.length > 0) {
      secondChanceItem.id = (parseInt(lastItems[0].id) + 1).toString();
    } else {
      secondChanceItem.id = "1"; // 第一个 item
    }

    // 添加时间戳
    const date_added = Math.floor(new Date().getTime() / 1000);
    secondChanceItem.date_added = date_added;

    // 插入新文档
    const insertResult = await collection.insertOne(secondChanceItem);

    // 再查一遍新插入的文档返回给前端（因为 insertOne 不返回文档内容）
    const insertedItem = await collection.findOne({ _id: insertResult.insertedId });

    res.status(201).json(insertedItem);
  } catch (e) {
    console.error('Error inserting item:', e);
    next(e);
  }
});


// Get a single secondChanceItem by ID
router.get('/:id', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("secondChanceItems");
        const id = req.params.id;  // 从 URL 路径中获取 id 参数

        const secondChanceItem = await collection.findOne({ id })
        res.json(secondChanceItem);
    } catch (e) {
        next(e);
    }
});

// Update and existing item
router.put('/:id', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("secondChanceItems");
        const id = req.params.id;
        const updatedData = req.body;

        const result = await collection.updateOne(
            { id: id },
            { $set: updatedData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({ message: 'Item updated successfully' });

    } catch (e) {
        next(e);
    }
});

// Delete an existing item
router.delete('/:id', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("secondChanceItems");

        const id = req.params.id;

        const result = await collection.deleteOne({ id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (e) {
        next(e);
    }
});

module.exports = router;
