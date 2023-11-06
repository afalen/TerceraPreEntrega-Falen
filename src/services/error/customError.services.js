export class CustomError {
	static createError({ name, message, cause, errorCode }) {
		const error = new Error(message, { cause });
		error.name = name;
		error.code = errorCode;
		console.log("error: ", error);
		throw error;
	}
}