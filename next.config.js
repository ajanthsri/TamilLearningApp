/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Packs became Speak lessons; keep old links working
      { source: '/pack/:id', destination: '/lesson/speak/:id', permanent: false },
    ]
  },
}
module.exports = nextConfig
