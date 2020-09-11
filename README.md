# Kydi
- MVP of a p2p ridesharing platform, intended for finnish audience who are currently using Facebook to organize
- Search, post, chat, feedback -system for finding and posting rides
- Achieved around 4k page-views and 200 users with DIY-FB marketing, but very minimal user-activity. The end result was that people seemed to be satisfied to their current way of organizing and they didn't really need the product.
- User interviews and research was properly conducted, but the pain point of FB-ridesharing wasn't big enough for users to transition into users. Project was terminated due to these reasons, I could have potentially pivoted to other ideas for the platform, but we just felt with the team, that we don't want to continue on with the project.
- Frontend: React, PWA-app, hosted from an S3 / Cloudfront-combo. AWS Cognito authentication
- Backend: Python, Infrastructure-As-Code, using DynamoDB, fully serverless Lambda-functions
- All AWS, deployed & built with Serverless-framework

### available at: (11.9.2020)
https://kydi.fi

### Team
- Ilmari (repository owner) # Full-stack, 80% of frontend, around 40% of current backend, CI/CD, setting up repo. I was full-time working on the project for the MVP-sprint.
- [Juho](https://github.com/JPaiv) # Backend.
- [Minja](https://github.com/MinjaSenna) # Assisting with design & frontend-code

### Please note when looking at the code:
- Git-history is destroyed for potentially vulnerable info. Repository was private and hosted in Gitlab when it was on active deployment
- Kydi was a MVP. A lot of things have been implemented in sub-optimal way, due to need to ship it out as fast as possible for feedback and testing traction, but MVP's don't have a reason be polished to the up-to perfection
- Security is okay, but still lacking. Lambda use should be authenticated with JWT's, but it was always a post MVP-feature
- Chat is not using WebSockets, but relies on HTTP-polling. The reason why chat it's not using ready-made package was that we had plans to implement quite a lot of custom-features meant to ease booking the ride and felt like custom-made solution would be easier than integrating it into existing ones.

### What it is lacking in the repository (due to it being an MVP):
- Private messaging, group messaging was very lackluster and just above the line.
- Authentication-state is in sessionstorage, not Context 🙈(where it really should be at)
- Way too much prop-drilling
- Code is violating Do-Not-Repeat-Yourself -principle *a lot*.
- Too little Atomic design in React -source files. Doing too many things, should be refactored into smaller pieces.
- Too much global CSS in src/index.css. Some of it is relevant, but there's a bunch of stuff that shouldn't be there, since it's only used in 1-2 places around the code.
- Not enough styled-components and too many semi-global CSS-styles applied to components.
- No typechecking or tests (or Typescript)
- Mix of finnish & english in the repository

### Run (backend is in AWS, working & deployed in 11.9.2020)
- `npm i`
- `npm start`
