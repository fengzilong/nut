export default async function app( ctx ) {
  ctx.env // -> development / production
  await ctx.plugins.login.getUser() // use plugin exposed method
}