import type {NextConfig} from "next";

const nextConfig: NextConfig = {
	/* config options here */
	devIndicators: false,
};

module.exports = {
	allowedDevOrigins: ['192.168.178.126'],
}

export default nextConfig;
