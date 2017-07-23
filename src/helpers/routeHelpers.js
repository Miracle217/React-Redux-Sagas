
import Route from 'route-parser';
import * as routes from 'app/routes';

export const signupRoute = new Route(routes.signupStep);
export const checkoutRoute = new Route(routes.checkout);
export const checkoutUserRoute = new Route(routes.checkoutUser);
export const triggerExpressRoute = new Route(routes.triggerExpress);
