const {
	override,
	fixBabelImports,
	addLessLoader,
	adjustStyleLoaders,
} = require("customize-cra");

module.exports = override(
	fixBabelImports("import", {
		libraryName: "antd",
		libraryDirectory: "es",
		style: true,
	}),
	addLessLoader({
		lessOptions: {
			javascriptEnabled: true,
			modifyVars: { "@primary-color": "#3d73dd" },
			localIdentName: "[name]__[local]___[hash:base64:5]",
		},
	})
);
