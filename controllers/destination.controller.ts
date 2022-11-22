import { Context } from 'koa';

export class BaseController {

    public async getUpload(ctx: Context) {
        ctx.body = 'Hello world!';
    }
}