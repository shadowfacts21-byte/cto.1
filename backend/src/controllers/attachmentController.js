const Attachment = require('../models/attachmentModel');
const Task = require('../models/taskModel');
const fs = require('fs');
const path = require('path');

const attachmentController = {
  upload: async (req, res) => {
    try {
      const { id } = req.params; // task_id
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const attachment = await Attachment.create({
        task_id: id,
        file_name: req.file.originalname,
        file_path: req.file.path,
        file_type: req.file.mimetype,
        uploaded_by: req.user.id
      });

      await Task.logActivity({
        task_id: id,
        user_id: req.user.id,
        action: 'file_attached',
        details: `Attached file: ${req.file.originalname}`
      });

      res.status(201).json(attachment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  list: async (req, res) => {
    try {
      const { id } = req.params;
      const attachments = await Attachment.findByTask(id);
      res.json(attachments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { attachmentId } = req.params;
      const attachment = await Attachment.findById(attachmentId);
      
      if (!attachment) {
        return res.status(404).json({ error: 'Attachment not found' });
      }

      // Delete file from disk
      if (fs.existsSync(attachment.file_path)) {
        fs.unlinkSync(attachment.file_path);
      }

      await Attachment.delete(attachmentId);

      await Task.logActivity({
        task_id: attachment.task_id,
        user_id: req.user.id,
        action: 'file_deleted',
        details: `Deleted file: ${attachment.file_name}`
      });

      res.json({ message: 'Attachment deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  download: async (req, res) => {
    try {
      const { attachmentId } = req.params;
      const attachment = await Attachment.findById(attachmentId);

      if (!attachment) {
        return res.status(404).json({ error: 'Attachment not found' });
      }

      if (!fs.existsSync(attachment.file_path)) {
        return res.status(404).json({ error: 'File not found on disk' });
      }

      res.download(attachment.file_path, attachment.file_name);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = attachmentController;
