/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.VERCEL_URL, // Remplacez par votre domaine
  generateRobotsTxt: true, // (Optionnel) Générer un fichier robots.txt
  // Les options suivantes sont facultatives
  changefreq: "daily",
  priority: 0.7,
  exclude: ["/admin/*", "/login"], // Exclure certains chemins
};
