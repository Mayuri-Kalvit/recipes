export async function commitToGithub(path: string, content: string, message: string) {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_REPO = process.env.GITHUB_REPO; // e.g. "username/repo"
    const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

    if (!GITHUB_TOKEN || !GITHUB_REPO) {
        throw new Error('GITHUB_TOKEN and GITHUB_REPO environment variables are required.');
    }

    // 1. Get the current file SHA (if it exists) to update it
    let sha: string | undefined;
    try {
        const getFileResponse = await fetch(
            `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`,
            {
                headers: {
                    'Authorization': `Bearer ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                },
            }
        );

        if (getFileResponse.ok) {
            const fileData = await getFileResponse.json();
            sha = fileData.sha;
        }
    } catch (error) {
        console.log('File does not exist yet or error fetching SHA, assuming new file.');
    }

    // 2. Create or Update the file
    const pushResponse = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`,
        {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message,
                content: Buffer.from(content).toString('base64'),
                sha,
                branch: GITHUB_BRANCH,
            }),
        }
    );

    if (!pushResponse.ok) {
        const errorData = await pushResponse.json();
        throw new Error(`GitHub API Error: ${errorData.message}`);
    }

    return await pushResponse.json();
}

export async function deleteFromGithub(path: string, message: string) {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_REPO = process.env.GITHUB_REPO;
    const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

    if (!GITHUB_TOKEN || !GITHUB_REPO) {
        throw new Error('GITHUB_TOKEN and GITHUB_REPO environment variables are required.');
    }

    // 1. Get the current file SHA
    const getFileResponse = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`,
        {
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
            },
        }
    );

    if (!getFileResponse.ok) {
        throw new Error('File not found on GitHub.');
    }

    const fileData = await getFileResponse.json();
    const sha = fileData.sha;

    // 2. Delete the file
    const deleteResponse = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`,
        {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message,
                sha,
                branch: GITHUB_BRANCH,
            }),
        }
    );

    if (!deleteResponse.ok) {
        const errorData = await deleteResponse.json();
        throw new Error(`GitHub API Error: ${errorData.message}`);
    }

    return await deleteResponse.json();
}
