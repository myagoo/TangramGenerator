import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { test } from "node:test";
import { generateTangrams, createRandom, Tan, Point, IntAdjoinSqrt2 } from "../dist/generator.js";

function random(seed) {
  return () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
}

test("injected random streams reproduce independent batches without patching Math.random", () => {
  const first = generateTangrams(2, undefined, createRandom(42));
  generateTangrams(1, undefined, createRandom(2026));
  assert.deepEqual(generateTangrams(2, undefined, createRandom(42)), first);
  assert.notDeepEqual(generateTangrams(2, undefined, createRandom(43)), first);
  const stream = createRandom(42);
  const batch = generateTangrams(2, undefined, stream);
  assert.deepEqual(batch, first);
  assert.notDeepEqual(generateTangrams(2, undefined, stream), first);
});

test("random streams validate seeds, include zero, and preserve the recorded sequence", () => {
  const stream = createRandom(42);
  assert.deepEqual(Array.from({ length: 3 }, stream), [0.2523451747838408, 0.08812504541128874, 0.5772811982315034]);
  assert.equal(createRandom(0)(), 0.23606797284446657);
  for (const seed of [0, 0xffffffff]) {
    const values = Array.from({ length: 1000 }, createRandom(seed));
    assert.ok(values.every(value => value >= 0 && value < 1));
  }
  for (const seed of [-1, 0.5, NaN, Infinity, 4294967296, null, "42"]) {
    assert.throws(() => createRandom(seed), RangeError);
  }
  assert.equal(createRandom(), Math.random);
});

function legacyWorker() {
  const output = [];
  let receive;
  const context = vm.createContext({ console, self: {
    postMessage(value) { output.push(value); },
    addEventListener(type, callback) { receive = callback; },
  } });
  context.importScripts = (...names) => { for (const name of names) vm.runInContext(readFileSync(new URL(`../Code/${name}`, import.meta.url), "utf8"), context); };
  context.importScripts("generator.js");
  return message => {
    output.length = 0;
    receive({ data: message });
    return [...output];
  };
}

test("legacy worker messages accept seeds and reproduce the TypeScript engine", () => {
  const run = legacyWorker();
  const first = run({ count: 2, seed: 42 });
  assert.equal(first[0], "Worker started!");
  assert.equal(first.at(-1), "Generating done!");
  const puzzles = first.filter(value => typeof value === "string" && value.startsWith("["));
  assert.equal(puzzles.length, 2);
  assert.deepEqual(puzzles.map(JSON.parse), JSON.parse(JSON.stringify(generateTangrams(2, undefined, createRandom(42)).map(t => t.tans))));
  assert.deepEqual(run({ count: 2, seed: 42 }), first);
  assert.notDeepEqual(run({ count: 2, seed: 43 }), first);
  assert.equal(run(1).filter(value => typeof value === "string" && value.startsWith("[")).length, 1);
});

test("both legacy pages seed worker batches independently of reproducible hint shuffles", () => {
  const session = (script, search) => {
    const messages = [];
    const context = vm.createContext({ console: { log() {} }, window: {}, location: { search }, URLSearchParams,
      Worker: class { postMessage(message) { messages.push(message); } },
    });
    for (const file of ["helpers.js", "intadjoinsqrt2.js", "point.js", "lineSegement.js", "directions.js", "tan.js", "evaluation.js", "tangram.js", "exampleTangrams.js", script]) {
      vm.runInContext(readFileSync(new URL(`../Code/${file}`, import.meta.url), "utf8"), context);
    }
    vm.runInContext("numTangrams = 2; startGenerator()", context);
    const hints = vm.runInContext("shuffleArray([0,1,2,3,4,5,6])", context);
    vm.runInContext("startGenerator()", context);
    return JSON.parse(JSON.stringify({ messages, hints }));
  };
  for (const script of ["script.js", "evalscript.js"]) {
    const first = session(script, "?seed=42");
    assert.deepEqual(session(script, "?seed=42"), first);
    assert.notDeepEqual(session(script, "?seed=43").hints, first.hints);
    assert.deepEqual(first.messages, [{ count: 2, seed: 42 }, { count: 2, seed: 43 }]);
    assert.deepEqual(session(script, "?seed=4294967295").messages, [{ count: 2, seed: 4294967295 }, { count: 2, seed: 0 }]);
    for (const search of ["", "?seed=", "?seed=-1", "?seed=nope", "?seed=1.5", "?seed=4294967296"]) {
      assert.deepEqual(session(script, search).messages, [{ count: 2 }, { count: 2 }]);
    }
  }
});

test("generation preserves legacy tan placements, outlines and evaluation for fixed random sequences", () => {
  for (const seed of [...Array.from({ length: 50 }, (_, index) => index + 1), 2026]) {
    const math = Object.create(Math);
    math.random = random(seed);
    const output = [];
    const context = vm.createContext({ Math: math, console, self: { postMessage(value) { if (typeof value === "string" && value.startsWith("[")) output.push(JSON.parse(value)); }, addEventListener() {} } });
    context.importScripts = (...names) => { for (const name of names) vm.runInContext(readFileSync(new URL(`../Code/${name}`, import.meta.url), "utf8"), context); };
    vm.runInContext(readFileSync(new URL("../Code/generator.js", import.meta.url), "utf8"), context);
    vm.runInContext("generateTangrams(4)", context);
    const progress = [];
    const actual = generateTangrams(4, (index) => progress.push(index), createRandom(seed));
    assert.deepEqual(JSON.parse(JSON.stringify(actual.map(t => t.tans))), output);
    assert.deepEqual(progress, [0, 1, 2, 3]);
    for (let i = 0; i < actual.length; i++) {
      const reference = vm.runInContext(`new Tangram(${JSON.stringify(output[i])}.map(t => new Tan(t.tanType, new Point(new IntAdjoinSqrt2(t.anchor.x.coeffInt,t.anchor.x.coeffSqrt), new IntAdjoinSqrt2(t.anchor.y.coeffInt,t.anchor.y.coeffSqrt)),t.orientation)))`, context);
      assert.deepEqual(JSON.parse(JSON.stringify(actual[i])), JSON.parse(JSON.stringify(reference)));
      assert.equal(actual[i].tans.length, 7);
      assert.ok(actual[i].outline.length > 0);
    }
  }
});

test("generation validates counts and supports an empty batch", () => {
  assert.deepEqual(generateTangrams(0), []);
  for (const value of [-1, 0.5, Infinity, NaN]) assert.throws(() => generateTangrams(value), RangeError);
});

test("all tan orientations preserve geometry, including the reflected parallelogram", () => {
  const areas = [144, 72, 36, 72, 72, 72];
  for (let type = 0; type < 6; type++) {
    for (let orientation = 0; orientation < 8; orientation++) {
      const tan = new Tan(type, new Point(), orientation);
      const points = tan.getPoints();
      const signedArea = points.reduce((sum, point, index) => {
        const next = points[(index + 1) % points.length];
        return sum + point.toFloatX() * next.toFloatY() - next.toFloatX() * point.toFloatY();
      }, 0) / 2;
      assert.ok(Math.abs(Math.abs(signedArea) - areas[type]) < 1e-9);
      assert.equal(Math.sign(signedArea), type === 5 ? -1 : 1);
    }
  }
});

test("legacy coefficient division remains unchanged during migration", () => {
  // The original div omits the denominator. Keep this characterized, not silently fixed.
  assert.equal(new IntAdjoinSqrt2(2, 0).div(new IntAdjoinSqrt2(2, 0)).toFloat(), 4);
});
