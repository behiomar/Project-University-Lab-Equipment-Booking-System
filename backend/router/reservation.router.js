const router = require('express').Router();
const ctrl = require('../controllers/reservation.controller');

// AUTH (turn on when Student 1's login works):
// 1) npm install jsonwebtoken   2) add JWT_SECRET to .env
// 3) remove the fake-user block in server.js   4) uncomment the next lines
// const { authenticate, requireAdmin } = require('../middleware/auth.middleware');
// router.use(authenticate);
// and change the first route to: router.get('/', requireAdmin, ctrl.getAll);

router.get('/', ctrl.getAll);        // all reservations
router.post('/', ctrl.create);       // new reservation
router.get('/mine', ctrl.getMine);   // my active reservations (keep before '/:id')
router.get('/:id', ctrl.getOne);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;