import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { Effect } from "effect";
import { Git } from "../services/Git";
import { BunContext } from "@effect/platform-bun";
import { execSync } from "child_process";
import * as path from "path";
import * as fs from "fs";

const scriptDir = path.resolve(__dirname, "scripts");
const repoDir = path.resolve(scriptDir, "temp/test_repo");

describe("Git", () => {
  beforeAll(() => {
    execSync(`bash ${scriptDir}/git_setup.sh`);
    process.chdir(repoDir);
  });

  afterAll(() => {
    process.chdir(path.resolve(__dirname, "../.."));
    fs.rmSync(repoDir, { recursive: true, force: true });
  });

  test("getCurrentBranch", async () => {
    const program = Effect.gen(function* () {
      const git = yield* Git;
      return yield* git.getCurrentBranch;
    });

    const result = await Effect.runPromise(
      program.pipe(
        Effect.provide(Git.Default),
        Effect.provide(BunContext.layer)
      )
    );
    expect(result.trim()).toBe("feature/new-content");
  });

  test("getAllBranches", async () => {
    const program = Effect.gen(function* () {
      const git = yield* Git;
      return yield* git.getAllBranches;
    });

    const result = await Effect.runPromise(
      program.pipe(
        Effect.provide(Git.Default),
        Effect.provide(BunContext.layer)
      )
    );
    result.sort();
    expect(result).toEqual(["feature/new-content", "master"]);
  });

  test("getCommitMessages", async () => {
    const program = Effect.gen(function* () {
      const git = yield* Git;
      return yield* git.getCommitMessages("master", "feature/new-content");
    });

    const result = await Effect.runPromise(
      program.pipe(
        Effect.provide(Git.Default),
        Effect.provide(BunContext.layer)
      )
    );
    const commits = result
      .filter(Boolean)
      .map((line) => line.split(" ").slice(1).join(" "));

    expect(commits).toEqual([
      "docs: update documentation on new feature",
      "refactor: refactor module Y for better performance",
      "feat: implement a new feature",
    ]);
  });
});
