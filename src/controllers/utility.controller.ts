import { Context } from "koa";
import fs from "fs";

export default class UtilityController {
  public static healthStats(ctx: Context) {
    const {
      git_commit_sha: gitCommitSha,
      transformer_build_version: imageVersion
    } = process.env;
    ctx.body = {
      service: "UP",
      ...(imageVersion && { version: imageVersion }),
      ...(gitCommitSha && { gitCommitSha })
    };
    ctx.status = 200;
    return ctx;
  }

  public static buildVersion(ctx: Context) {
    ctx.body =
      process.env.transformer_build_version || "Version Info not found";
    ctx.status = 200;
    return ctx;
  }

  public static version(ctx: Context) {
    ctx.body = process.env.npm_package_version || "Version Info not found";
    ctx.status = 200;
    return ctx;
  }

  public static features(ctx: Context) {
    const obj = JSON.parse(fs.readFileSync("../../features.json", "utf8"));
    ctx.body = JSON.stringify(obj);
  }
}
