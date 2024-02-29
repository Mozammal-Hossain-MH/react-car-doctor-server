/**
 * ---------------------------
 * MAKE API SECURE
 * ---------------------------
 * The person who should have
 * 
 * concept:
 * 1.assign 2 tokens for each person
 * 2.access token contains: user identification (email,role etc.). valid for a shorter duration
 * 3.refresh token used: to recreate an access token that was expired
 * 4.if refresh token is invalid then logout the user
 * */ 

/**
 * 1.install jwt --> json web token
 * 2.generate a token by using jwt.sign
 * 3.create api set to cookie. httponly, secure, samesite
 * 4.from client side: axios withCredentials: true
 * 5.cors setup origin and credentials: true
 * */ 

/**
 * for secure api calls
 * 1.server side: install cookie-parser and use as a middleware
 * 2.req.cookies
 * 3.client side: make api calls using axios withCredentials: true or fetch credentials: "include"
 * */ 