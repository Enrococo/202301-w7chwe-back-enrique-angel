import express from 'express';
import { upload } from './profileImg-upload-middleware.js';
import {
  addFollowertoUser,
  createUserController,
  getUserByIdController,
  getUsersController,
  updateUserProfileController,
} from './user-controller.js';

const router = express.Router();

router.route('/:id').get(getUserByIdController);
router.route('/').post(createUserController).get(getUsersController);
router.route('/:id/follower/:idFollower').patch(addFollowertoUser);
router
  .route('/avatar')
  .patch(upload.single('profileAvatar'), updateUserProfileController);
export default router;
