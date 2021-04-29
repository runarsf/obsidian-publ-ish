/*
import { Repository } from "nodegit";

var getMostRecentCommit = function (repository: any) {
  return repository.getBranchCommit("master");
};

var getCommitMessage = function (commit: any) {
  return commit.message();
};

export async function CheckStatus () {
  Repository.open("nodegit")
    .then((repo) => getMostRecentCommit(repo))
    .then((commit) => getCommitMessage(commit))
    .then((message: any) => {
      console.log(message);
    });
}
*/