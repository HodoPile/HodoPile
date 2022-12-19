# HodoPile
Friendly trip advisor guide where a user can have a personalized destination search experience 

## Minimum Viable Product I
### MVP I - User Stories:

GENERAL USER
- As a user I want to view a list of destination locations
- As a user I want to search for a location 
- As a user I want to view locations that are trending

BASIC USER    
- As a user I want to login/logout from my account
- As a user I want to create a profile 
- As a user I want to be able to navigate to view my profile
- As a user I want to be able to update their profile

- As a user I want to be able to save my favorate locations
- As a user I want to view a list of favorated locations
- As a user I want to be able to view locations by my personal interests
- As a user I want to be able to view locations by their rating

### MPV I - WireFrame

Version I
![Version I](/images/wireframes/figma.jpg)


## Git and GitHub Workflow

On Local Machine
- `git branch` list all local branches
- `git branch -r` list all remote branches

- `git switch dev` OR `git checkout dev` move you to dev branch
- `git checkout -b <new branchName>`  OR `git switch -c <new branchName>` 
  - create a new branch off of dev
  - creates a local branch only (not tracking any remote branch named: `<new branchName>`)
- Implent a feature based on issue
  - adding new code 

- `git add .` add all current changes and prepare for staging
- `git commit -m "message: what this commit does"` commit 
- `git push origin <new branchName>` 
  
On GH
- create a PR
- make sure you double check: base === dev
- wait for it to be approved / reviewed by team member