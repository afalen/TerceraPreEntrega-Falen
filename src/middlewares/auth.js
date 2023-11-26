const checkUserAuthenticatedView = (req, res, next) => {
	if (req.user) {
		next();
	} else {
		res.send("<p>Debes estar autenticado <a href='/login'> <button> Ir al login </button> </a></p>");
	}
};

const showAuthView = (req, res, next) => {
	if (req.user) {
		res.redirect("/profile");
	} else {
		next();
	}
};

const checkRoles = (urlRoles) => {
	return (req, res, next) => {
		if (!urlRoles.includes(req.user.role)) {
			return res.redirect("/denied");
		} else {
			next();
		}
	};
};

export { checkUserAuthenticatedView, showAuthView, checkRoles };