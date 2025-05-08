"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = require("../modules/User/user.routes");
const auth_route_1 = require("../modules/Auth/auth.route");
const category_route_1 = __importDefault(require("../modules/Category/category.route"));
const idea_route_1 = __importDefault(require("../modules/Idea/idea.route"));
const comments_route_1 = __importDefault(require("../modules/Comments/comments.route"));
const vote_route_1 = require("../modules/Vote/vote.route");
const payment_route_1 = require("../modules/Payment/payment.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/user',
        route: user_routes_1.userRoutes,
    },
    {
        path: '/auth',
        route: auth_route_1.AuthRouter,
    },
    {
        path: '/category',
        route: category_route_1.default
    },
    {
        path: '/idea',
        route: idea_route_1.default
    },
    {
        path: '/comment',
        route: comments_route_1.default
    },
    {
        path: '/vote',
        route: vote_route_1.voteRoutes
    },
    {
        path: '/payments',
        route: payment_route_1.paymentRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
