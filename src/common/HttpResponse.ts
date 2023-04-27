const createSuccessHttpResonse = (data: any) => {
	return {
		statusCode: 200,
		message: "SUCCESS",
		data: data,
	};
};

const createErrorHttpResonse = (data: any) => {
	return {
		statusCode: 400,
		message: "FAILED",
		data: data,
	};
};

export { createSuccessHttpResonse, createErrorHttpResonse };
