import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { test } from "node:test";
import { generateTangrams, Tan, Point, IntAdjoinSqrt2 } from "../dist/generator.js";

function random(seed) {
  return () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
}

test("generation preserves legacy tan placements, outlines and evaluation for fixed random sequences", () => {
  for (const seed of [1, 42, 2026]) {
    const math = Object.create(Math);
    math.random = random(seed);
    const output = [];
    const context = vm.createContext({ Math: math, console, self: { postMessage(value) { if (typeof value === "string" && value.startsWith("[")) output.push(JSON.parse(value)); }, addEventListener() {} } });
    context.importScripts = (...names) => { for (const name of names) vm.runInContext(readFileSync(new URL(`../Code/${name}`, import.meta.url), "utf8"), context); };
    vm.runInContext(readFileSync(new URL("../Code/generator.js", import.meta.url), "utf8"), context);
    vm.runInContext("generateTangrams(4)", context);
    const previous = Math.random;
    try {
      Math.random = random(seed);
      const progress = [];
      const actual = generateTangrams(4, (index) => progress.push(index));
      assert.deepEqual(JSON.parse(JSON.stringify(actual.map(t => t.tans))), output);
      assert.deepEqual(progress, [0, 1, 2, 3]);
      for (let i = 0; i < actual.length; i++) {
        const reference = vm.runInContext(`new Tangram(${JSON.stringify(output[i])}.map(t => new Tan(t.tanType, new Point(new IntAdjoinSqrt2(t.anchor.x.coeffInt,t.anchor.x.coeffSqrt), new IntAdjoinSqrt2(t.anchor.y.coeffInt,t.anchor.y.coeffSqrt)),t.orientation)))`, context);
        assert.deepEqual(JSON.parse(JSON.stringify(actual[i])), JSON.parse(JSON.stringify(reference)));
        assert.equal(actual[i].tans.length, 7);
        assert.ok(actual[i].outline.length > 0);
      }
    } finally { Math.random = previous; }
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
