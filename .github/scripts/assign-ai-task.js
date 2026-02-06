import { Octokit } from '@octokit/rest';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const [OWNER, REPO] = process.env.GITHUB_REPOSITORY.split('/');

async function main() {
	// Obtener issues abiertas con label "ai-ready"
	const res = await octokit.rest.issues.listForRepo({
		owner: OWNER,
		repo: REPO,
		state: 'open',
		labels: 'ai-ready',
	});

	if (res.data.length === 0) {
		console.log('No hay issues AI-ready.');
		return;
	}

	// Seleccionamos la primera
	const issue = res.data[0];

	// Comentario para invocar Cloud Code
	const comment = `@claude do this issue`;

	await octokit.rest.issues.createComment({
		owner: OWNER,
		repo: REPO,
		issue_number: issue.number,
		body: comment,
	});

	console.log(`Issue #${issue.number} asignada a Cloud Code.`);
}

main().catch((err) => {
	console.error('Error ejecutando scheduler:', err);
	process.exit(1);
});
