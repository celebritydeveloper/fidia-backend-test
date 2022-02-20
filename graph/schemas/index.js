import glob from 'glob'
import fs from 'fs'
import APP_ROOT from "app-root-path";

export default () => new Promise((resolve, reject) => {
	return glob(`${APP_ROOT}/graph/schemas/*.graphql`, null, (e, asts) => {
		if (e != null) {
			return reject(e)
		}
		console.info('reading AST schema files');
		console.log('\r========================\r');
		let ASTList = `\n`
		asts.forEach((ast) => {
			const f = fs.readFileSync(ast);
			ASTList += `${f}\r`
			console.info('⚡️ Loaded: ', ast);
		});
		console.log('\r========================\r');
		console.info('reading AST Schema files completed\r');
		return resolve(ASTList);
	});
})
