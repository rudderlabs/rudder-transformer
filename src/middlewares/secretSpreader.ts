// import { Context, Next } from 'koa';
// import { RouterTransformationRequest } from '../types';

// export class SpreaderMiddleware {
//   public static spreader(ctx: Context, next: Next) {
//     this.SpreadSecrets(ctx);
//     return next();
//   }

//   private static SpreadSecrets(ctx: Context) {
//     const { headers, body } = ctx.request;
//     let oauthSecret = '';
//     const oauthSecretHeader = headers['oauth-secret'];
//     if (oauthSecretHeader && !Array.isArray(oauthSecretHeader)) {
//       oauthSecret = JSON.parse(oauthSecretHeader);
//     }
//     if (oauthSecret !== '' && oauthSecret !== undefined) {
//       const routerRequest = body as RouterTransformationRequest;
//       if (routerRequest) {
//         routerRequest.input = routerRequest.input.map((event) => ({
//           ...event,
//           metadata: { ...event.metadata, secret: oauthSecret },
//         }));
//       }
//     }
//   }
// }
