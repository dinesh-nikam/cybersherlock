module.exports = {
  reactStrictMode: true,
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/index",
        destination: "/",
        permanent: true,
      },
    ];
  },
};
