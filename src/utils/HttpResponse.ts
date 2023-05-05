const createSuccessHttpResonse = (data: any) => {
	return {
		statusCode: 200,
		message: "SUCCESS",
		data: data.data ? data.data : data,
		totalRecords: data.totalRecords ? data.totalRecords : Array.isArray(data) ? data.length : 0,
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
