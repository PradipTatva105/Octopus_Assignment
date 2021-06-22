import express from 'express';
import userRoute from './mail.route';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/mail',
    route: userRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
