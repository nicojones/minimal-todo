const isEmpty = (string) => {
	return (string || '').trim() === '';
};

exports.validateLoginData = (data) => {
	let errors = {};

	if (isEmpty(data.email)) errors.email = 'Must not be empty';
	if (isEmpty(data.password)) errors.password = 'Must not be empty';

	return {
		errors,
		valid: Object.keys(errors).length === 0
	};
};

const isEmail = (email) => {
	// eslint-disable-next-line no-useless-escape
	const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return Boolean(email.match(emailRegEx));
};

exports.validateSignUpData = (data) => {
	let errors = {};

	if (isEmpty(data.email)) {
		errors.email = 'Must not be empty';
	} else if (!isEmail(data.email)) {
		errors.email = 'Must be valid email address';
	}

	if (isEmpty(data.name)) {
		errors.name = 'Name must not be empty';
	}
	if (isEmpty(data.password)) {
		errors.password = 'Password must not be empty';
	}
	if (data.password !== data.confirm) {
		errors.confirmPassword = 'Passwords don\'t match';
	}
	if (data.password !== data.confirm) {
		return errors.password = 'Passwords don\'t match';
	}
	if (data.password === data.email) {
		return errors.password = 'Password can\'t match email';
	}

	return {
		errors,
		valid: Object.keys(errors).length === 0
	};
};
