# softeng

<p align="center">
  <img alt="An orange robot at a workbench types on a beige retro computer, with code on the screens behind it"
    src="../../assets/skillbook-softeng-robot.webp" width="600">
</p>

The first idea of the softeng set. Nothing here is designed yet: the set comes after essentials is complete, and every line below is an idea that may change.

## What it is for

softeng is how good software is designed, built, tested, reviewed, shipped and maintained. Essentials already makes an agent understand the request, act with care, plan multipart work and check its claims. softeng adds what is particular to software: the practices, the stages and the know-how of each language and tool.

It builds on essentials and never repeats it. A software design still goes through essentials' design method; softeng adds what a software design needs, such as architecture. A code change still follows essentials' rules on risky actions and on checking work; softeng adds how to make the change well.

## Its stages

The set follows the life of a change, one stage per group:

- **design:** how software is designed, with architecture as its first part: how a system divides into parts, how they connect, and what each owns.
- **implement:** making the change.
  - **prototype:** a quick, throwaway version to learn what the real one needs.
  - **plan:** the software parts of a plan, such as slices and their order.
  - **git:** working with branches and worktrees, commits, and finishing a branch.
  - **web** and **agent-tools:** making web software, and tools that agents use.
  - **code:** language know-how, for Python, TypeScript, Bash, Go and Rust.
- **test:** showing the software works.
  - **tdd:** writing the test first.
  - **debug:** finding why something fails.
  - **browser:** testing in a real browser.
  - **experiment:** a small trial to answer a question.
- **review:** checking work before it lands.
  - **code:** reviewing a change.
  - **pr:** preparing and answering a pull request.
- **ship:** getting it to users.
  - **build**, **release**, **deploy** and **rollback:** from a build to a running version, and back when it fails.
  - **infra**, **monitor** and **incident:** where it runs, watching it, and handling an outage.
  - **wizard:** not yet defined.
- **maintain:** keeping a project healthy over time.
  - **repo:** setting up, creating and auditing a repository, closing the gaps an audit finds, and keeping it in shape.
  - **fork:** working on and keeping up with a fork.

## Open questions

- How architecture and essentials' design divide the work, so each rule has one home.
- Which language and tool know-how belongs here, and which belongs to a later set about the programs agents drive.
- How the stages hand work to each other, for example how review's findings reach implement.
- The engineering practice an agent keeps while writing code, such as file size and design patterns.
