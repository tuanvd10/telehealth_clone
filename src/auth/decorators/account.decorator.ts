import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentAccount = createParamDecorator((data: string, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	//console.log("CurrentAccount: ", request.user);
	const user = request.user;
	const returnData = data ? user?.[data] : user;
	return returnData;
});
