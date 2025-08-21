import { Data, Effect } from "effect";
import { Command } from "@effect/platform";

export class NoGitError extends Data.TaggedError("NoGitError")<{}> {}

export class Git extends Effect.Service<Git>()("Git", {
  effect: Effect.gen(function* () {
    return {
      getStatus: Effect.gen(function* () {
        const cmd = Command.make("git", "status");
        const output = yield* Command.string(cmd);
        return output;
      }),

      getCurrentBranch: Effect.gen(function* () {
        const cmd = Command.make("git", "branch", "--show-current");
        const output = yield* Command.string(cmd);
        return output;
      }),

      getAllBranches: Effect.gen(function* () {
        const cmd = Command.make("git", "branch", "--format=%(refname:short)");
        const output = yield* Command.lines(cmd);
        return output;
      }),

      getCommitMessages: (targetBranch: string, currentBranch: string) =>
        Effect.gen(function* () {
          const cmd = Command.make(
            "git",
            "log",
            `${targetBranch}..${currentBranch}`,
            "--oneline"
          );
          const output = yield* Command.lines(cmd);
          return output;
        }),
    };
  }),
}) {}
