async function generateApp() {
  const idea = document.getElementById("idea").value;
  const repoName = document.getElementById("repoName").value;

  const res = await fetch("http://localhost:3000/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idea, repoName })
  });

  const data = await res.json();
  document.getElementById("output").innerText = `App gerado! Veja no GitHub: ${data.githubUrl}`;
}
