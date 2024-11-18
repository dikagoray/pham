 'use strict';

window.routes = [
	{
		path: '/',
		componentUrl: './partials/screens/splash.html'
	},
	{
		path: '/walkthrough',
		componentUrl: './partials/screens/walkthrough.html'
	},
	{
		path: '/avatar',
		componentUrl: './partials/screens/avatar.html'
	},
	{
		path: '/home',
		componentUrl: './partials/screens/home.html'
	},
	{
		path: '/products',
		componentUrl: './partials/screens/products.html'
	},
	{
		path: '/categories',
		componentUrl: './partials/screens/categories.html'
	},
	{
		path: '/checkout',
		componentUrl: './partials/screens/checkout.html'
	},
	{
		path: '/cart',
		componentUrl: './partials/screens/cart.html'
	},
	{
		path: '/appointments',
		componentUrl: './partials/screens/appointments.html'
	},
	{
		path: '/profile',
		componentUrl: './partials/screens/user-profile.html'
	},
	{
		path: '/prescriptions',
		componentUrl: './partials/screens/prescriptions.html'
	},
	{
		path: '/info',
		componentUrl: './partials/screens/info.html'
	},
	{
		path: '/contacts',
		componentUrl: './partials/screens/contacts.html'
	},
	{
		path: '/login',
		componentUrl: './partials/screens/login.html'
	},
	{
		path: '/pres-upload',
		componentUrl: './partials/screens/pres-upload.html'
	},
	{
		path: '/pres',
		componentUrl: './partials/screens/pres.html'
	},
	{
		path: '/register',
		componentUrl: './partials/screens/profile-setup.html'
	},
	{
		path: '/orders',
		componentUrl: './partials/screens/orders.html'
	},
	{
		path: '/category-products',
		componentUrl: './partials/screens/category-products.html'
	},
	{
		path: '/themes',
		componentUrl: './partials/themes.html'
	},
	{
		path: '/more',
		componentUrl: './partials/more.html'
	},
	{
		path: '(.*)',
		componentUrl: './partials/screens/404.html'
	}
];