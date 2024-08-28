import { clerkMiddleware, createRouteMatcher} from "@clerk/nextjs/server";

// check if route is public
const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

// if route is not public, protect
export default clerkMiddleware((auth, request) => {
    if (!isPublicRoute(request)) {
        auth().protect()
    }
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
