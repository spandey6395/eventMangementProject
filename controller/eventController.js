const express = require('express');
const Event = require('../model/eventModel');


const router = express.Router();

// Create a new event
const createEvent = async(req,res)=>{
    try {
        const event = new Event({
          title: req.body.title,
          description: req.body.description,
          date: req.body.date,
          creator: req.user._id,
          invitedUsers: req.body.invitedUsers
        });
        await event.save();
        res.status(201).send(event);
      } catch (error) {
        res.status(400).send({ error: error.message });
      }
    }
    
    // List all events for a user (created and invited)

    const getEvent = async(req,res)=>{
        try {
    const match = {};
    const sort = {};

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Sorting
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    // Date Filter
    if (req.query.date) {
      match.date = new Date(req.query.date);
    }

    // Search Filter
    if (req.query.search) {
      match.title = { $regex: req.query.search, $options: 'i' };
    }

    const events = await Event.find({
      $or: [{ creator: req.user._id }, { invitedUsers: req.user._id }]
    })
      .populate('creator', 'username')
      .populate('invitedUsers', 'username')
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .exec();

    res.send(events);
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
};

module.exports = {createEvent,getEvent}