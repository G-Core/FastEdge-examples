module.exports = async ({ github, context, core }) => {
  const releaseVersion = process.env.RELEASE_VERSION;
  const outputDir = process.env.BUILD_DIRECTORY;
  const github_token = process.env.PAT_GITHUB;
  const github_repo = process.env.GITHUB_REPOSITORY;

  let release;
  try {
    if (releaseVersion === "latest") {
      const { data: latestRelease } = await github.rest.repos.getLatestRelease({
        owner: context.repo.owner,
        repo: context.repo.repo,
      });
      release = latestRelease;
    } else {
      const { data: specificRelease } = await github.rest.repos.getReleaseByTag(
        {
          owner: context.repo.owner,
          repo: context.repo.repo,
          tag: releaseVersion,
        }
      );
      release = specificRelease;
    }

    const asset = release.assets.find((asset) => asset.name.endsWith(".zip"));
    if (!asset) {
      core.setFailed("No .zip asset found in the release.");
      return;
    }

    const downloadUrl = `https://api.github.com/repos/${github_repo}/releases/assets/${asset.id}`;
    core.info(`Assets download URL: ${downloadUrl}`);

    const { execSync } = require("child_process");
    const fs = require("fs");

    // Ensure output directory exists
    fs.mkdirSync(outputDir, { recursive: true });

    // Download and unzip the asset
    execSync(
      `curl -L "${downloadUrl}" -H "Authorization: Bearer ${github_token}" -H "Accept: application/octet-stream" -H "X-GitHub-Api-Version: 2022-11-28" -o ./${outputDir}/release.zip`
    );
    execSync(`cd ${outputDir} && unzip release.zip`);

    // remove the zip file
    execSync(`cd ${outputDir} && rm release.zip`);

    core.info(`RELEASE_ASSET_VERSION: ${release.tag_name}`);
    core.info(`Release downloaded successfully to ${outputDir}`);
    core.setOutput("RELEASE_ASSET_VERSION", release.tag_name);
  } catch (error) {
    core.setFailed(`Failed to download release: ${error.message}`);
  }
};
