# Wiki Setup and Synchronization

This document explains how the SideQuest wiki synchronization works.

## Overview

The wiki content is maintained in the `/wiki` folder of this repository and automatically synchronized to the GitHub Wiki feature using GitHub Actions.

## How It Works

1. **Wiki Content Storage**: All wiki markdown files are stored in the `/wiki` folder in the main repository
2. **Automatic Sync**: When changes are pushed to the `main` branch that affect files in the `/wiki` folder, a GitHub Actions workflow automatically syncs them to the GitHub Wiki
3. **GitHub Wiki Access**: The synchronized content appears at: `https://github.com/Kaelith69/SideQuest/wiki`

## Workflow Details

The synchronization is handled by `.github/workflows/wiki-sync.yml`:

- **Trigger**: Runs on push to `main` branch when wiki files change
- **Manual Trigger**: Can also be manually triggered via workflow_dispatch
- **Action Used**: `Andrew-Chen-Wang/github-wiki-action@v4`
- **Authentication**: Uses `GITHUB_TOKEN` automatically (no setup required)

## Adding or Editing Wiki Pages

To add or edit wiki pages:

1. Create or edit markdown files in the `/wiki` folder
2. Commit and push changes to the `main` branch
3. The workflow will automatically sync changes to the GitHub Wiki
4. Changes will appear at `https://github.com/Kaelith69/SideQuest/wiki`

## Important Notes

- **File Naming**: Use format like `Page-Name.md` (hyphens for spaces)
- **Home Page**: `Home.md` becomes the wiki home page
- **Links**: In wiki files, use links WITHOUT the `.md` extension: `[Link Text](Page-Name)`
  - Example: `[Home](Home)` not `[Home](Home.md)`
  - This follows GitHub Wiki conventions
- **First Sync**: The first time the workflow runs, it will create all wiki pages

## Viewing the Wiki

Once synchronized, the wiki can be accessed at:
- Direct Link: https://github.com/Kaelith69/SideQuest/wiki
- Via GitHub: Click the "Wiki" tab in the repository header

## Troubleshooting

If the wiki doesn't appear:
1. Check that the GitHub Actions workflow completed successfully in the "Actions" tab
2. Ensure the GitHub Wiki feature is enabled in repository settings
3. Verify that files follow the proper naming convention
4. Check workflow logs for any errors
