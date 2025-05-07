import { Router } from "express";
import { userRoutes } from "../modules/User/user.routes";
import { AuthRouter } from "../modules/Auth/auth.route";
import CategoryRoute from "../modules/Category/category.route";
import IdeaRoute from "../modules/Idea/idea.route";
import CommentsRoutes from "../modules/Comments/comments.route";
import { voteRoutes } from "../modules/Vote/vote.route";

const router = Router();

const moduleRoutes = [
  {
    path: '/user',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: AuthRouter,
  },
  {
    path: '/category',
    route: CategoryRoute
  },
  {
    path: '/idea',
    route: IdeaRoute
  },
  {
    path: '/comment',
    route: CommentsRoutes
  },
  {
    path: '/vote',
    route: voteRoutes
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
