const express = require('express');
const memberController = require('../controllers/memberController');
const { auth } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.post('/', auth, memberController.createMember);
router.get('/', auth, memberController.listMembers);
router.get('/:memberId', auth, memberController.getMember);
router.put('/:memberId', auth, memberController.updateMember);
router.delete('/:memberId', auth, memberController.deleteMember);

module.exports = router;
