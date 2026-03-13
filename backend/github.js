import fetch from "node-fetch";

export async function createRepoWithFiles(repoName, codeContent) {
  const token = process.env.GITHUB_TOKEN;

  // Criar repositório
  const res = await fetch("https://api.github.com/user/repos", {
    method: "POST",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name: repoName, private: false })
  });

  const repo = await res.json();

  // Commit inicial com o código
  await fetch(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/contents/app.js`, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "Initial commit",
      content: Buffer.from(codeContent).toString("base64")
    })
  });

  return repo.html_url;
}
