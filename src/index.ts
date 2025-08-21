import { BunContext, BunRuntime } from "@effect/platform-bun";
import { Effect, Layer } from "effect";
import { Git } from "./services/Git";

const MainLayer = Layer.mergeAll(Git.Default);

const program = Effect.gen(function* () {
  const gitService = yield* Git;
  const branches = yield* gitService.getAllBranches;

  console.log("branches:", branches);
});

const runnable = program.pipe(Effect.provide(MainLayer));

const main = runnable.pipe(
  Effect.catchTags({
    BadArgument: (badArg) =>
      Effect.gen(function* () {
        console.error(badArg.toJSON());
      }),
    SystemError: (e) =>
      Effect.gen(function* () {
        console.error(`${e.description}`);
      }),
    // NoGitError: () =>
    //   Effect.gen(function* () {
    //     console.error(
    //       "No git repository initialized in the current working directory"
    //     );
    //   }),
  })
);

BunRuntime.runMain(main.pipe(Effect.provide(BunContext.layer)));
