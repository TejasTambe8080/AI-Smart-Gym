// Notification Routes
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all notifications for user
router.get('/', notificationController.getNotifications);

// Get unread count
router.get('/unread/count', notificationController.getUnreadCount);

// Mark specific notification as read
router.patch('/:notificationId/read', notificationController.markAsRead);

// Mark all notifications as read
router.patch('/mark-all/read', notificationController.markAllAsRead);

// Delete notification
router.delete('/:notificationId', notificationController.deleteNotification);

// Clear all notifications
router.delete('/clear/all', notificationController.clearAll);

module.exports = router;
