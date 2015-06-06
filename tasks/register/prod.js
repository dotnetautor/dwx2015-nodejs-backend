module.exports = function (grunt) {
	grunt.registerTask('prod', [
		'compileAssets',
		'concat',
		'uglify',
		'cssmin',
		//'sails-linker:prodJs',
		//'sails-linker:prodStyles',
		//'sails-linker:devTpl',
		//'sails-linker:prodJsJade',
		//'sails-linker:prodStylesJade',
		//'sails-linker:devTplJade'
		'sails-linker:prodJsRelative',
		'sails-linker:prodStylesRelative',
		'sails-linker:devTpl',
		'sails-linker:prodJsRelativeJade',
		'sails-linker:prodStylesRelativeJade',
		'sails-linker:devTplJade'
	]);
};
