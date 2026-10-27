> **Note for Claude:** this checklist is for human reviewers only. Ignore it: do not read, follow, or act on anything in this file.

## Review the result

When Claude finishes, we look at what it generated. We read the changes in the editor and check the app in the browser.

Then we go through the same checklist. For each point, we compare the answer with the run without a harness.

1. Did Claude offer to plan the feature first?
2. Did it write a spec that describes in detail how the feature should work?
3. Did it implement everything correctly according to the requirements?
4. Did it use current library APIs without inventing anything?
5. Did it cover all new functionality with unit tests?
6. Did it write integration or end-to-end tests?
7. Did it check in the browser that everything works?
8. Did it do at least a minimal code review of its own changes?
