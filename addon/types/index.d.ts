// Type definitions for ember-qunit 5.0
// Project: https://github.com/emberjs/ember-qunit#readme
// Definitions by: Dan Freeman <https://github.com/dfreeman>
//                 Chris Krycho <https://github.com/chriskrycho>
//                 James C. Davis <https://github.com/jamescdavis>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// Minimum TypeScript Version: 4.4

import EmberTestAdapter from '@ember/test/adapter';
import { Resolver } from '@ember/owner';
import { TestContext } from '@ember/test-helpers';

/**
 * Sets a Resolver globally which will be used to look up objects from each test's container.
 */
export function setResolver(resolver: Resolver): void;

/**
 * Options for configuring the test runner. Normally, you will not need to
 * customize this. It is exported primarily so that end user app code can name
 * it when passing it back to the framework.
 */
export interface SetupTestOptions {
  /**
   * The resolver to use when instantiating container-managed entities in the test.
   */
  resolver?: Resolver | undefined;
}

/**
 * Sets up acceptance tests.
 *
 * The `setupApplicationTest` function is used for all acceptance tests. It
 * is invoked in the callback scope of a QUnit module (aka "nested module").
 *
 * Once invoked, all subsequent hooks.beforeEach and test invocations will
 * have access to the following:
 * * `this.owner` - the owner object that been set on the test context.
 * * `this.pauseTest` and `this.resumeTest` - allow easy pausing/resuming of tests.
 * * `this.element` which returns the DOM element representing the application's root element.
 */
export function setupApplicationTest(
  hooks: NestedHooks,
  options?: SetupTestOptions
): void;

/**
 * Sets up tests that need to render snippets of templates.
 *
 * The setupRenderingTest method is used for tests that need to render
 * snippets of templates. It is also invoked in the callback scope of a
 * QUnit module (aka "nested module").
 *
 * Once invoked, all subsequent hooks.beforeEach and test invocations will
 * have access to the following:
 * * All of the methods / properties listed for `setupTest`
 * * this.render(...) - Renders the provided template snippet returning a
 * promise that resolves once rendering has completed
 * * An importable render function that de-sugars into this.render will be
 * the default output of blueprints
 * * this.element - Returns the native DOM element representing the element
 * that was rendered via this.render
 * * this.$(...) - When jQuery is present, executes a jQuery selector with
 * the current this.element as its root
 */
export function setupRenderingTest(
  hooks: NestedHooks,
  options?: SetupTestOptions
): void;

/**
 * Sets up tests that do not need to render snippets of templates.
 *
 * The `setupTest` method is used for all types of tests except for those
 * that need to render snippets of templates. It is invoked in the callback
 * scope of a QUnit module (aka "nested module").
 *
 * Once invoked, all subsequent hooks.beforeEach and test invocations will
 * have access to the following:
 * * this.owner - This exposes the standard "owner API" for the test environment.
 * * this.set / this.setProperties - Allows setting values on the test context.
 * * this.get / this.getProperties - Retrieves values from the test context.
 */
export function setupTest(hooks: NestedHooks, options?: SetupTestOptions): void;

export class QUnitAdapter extends EmberTestAdapter {}

export { module, test, skip, only, todo } from 'qunit';

interface QUnitStartOptions {
  /**
   * If `false` the test container will not be setup based on `devmode`,
   * `dockcontainer`, or `nocontainer` URL params.
   */
  setupTestContainer?: boolean | undefined;

  /**
   * If `false` tests will not be automatically started (you must run
   * `QUnit.start()` to kick them off).
   */
  startTests?: boolean | undefined;

  /**
   * If `false` the default Ember.Test adapter will not be updated.
   */
  setupTestAdapter?: boolean | undefined;

  /**
   * `false` opts out of the default behavior of setting `Ember.testing`
   * to `true` before all tests and back to `false` after each test will.
   */
  setupEmberTesting?: boolean | undefined;

  /**
   * If `false` test isolation validation will be disabled.
   */
  setupTestIsolationValidation?: boolean | undefined;
}

export function setupEmberOnerrorValidation(): void;

export function start(options?: QUnitStartOptions): void;

// SAFETY: all of the `TC extends TestContext` generics below are just wildly,
// impossibly unsafe. QUnit cannot -- ever! -- guarantee that the test context
// is properly set up in a type-safe way to match this. However, it is the only
// way to handle setting state in a TS-visible way prior to Ember RFC 0785,
// which is slooooowly rolling out across the ecosystem in conjunction with the
// `<template>` feature.

declare global {
  // NOTE: disables `no-unnecessary-generics` inline because, unfortunately,
  // the design of Ember's test tooling (and indeed *QUnit's* test system)
  // requires that we allow users to update the type of the context of the
  // test. This is indeed strictly *wrong*! However, changing it will require
  // changing how Ember handles testing. See [the PR][pr] for further details.
  //
  // [pr]: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/56494

  interface NestedHooks {
    /**
     * Runs after the last test. If additional tests are defined after the
     * module's queue has emptied, it will not run this hook again.
     */
    after<TC extends TestContext>(
      fn: (this: TC, assert: Assert) => void | Promise<void>
    ): void;

    /**
     * Runs after each test.
     */
    afterEach<TC extends TestContext>(
      fn: (this: TC, assert: Assert) => void | Promise<void>
    ): void;

    /**
     * Runs before the first test.
     */
    // SAFETY: this is just wildly, impossibly unsafe. QUnit cannot -- ever! --
    before<TC extends TestContext>(
      fn: (this: TC, assert: Assert) => void | Promise<void>
    ): void;

    /**
     * Runs before each test.
     */
    // SAFETY: this is just wildly, impossibly unsafe. QUnit cannot -- ever! --
    beforeEach<TC extends TestContext>(
      fn: (this: TC, assert: Assert) => void | Promise<void>
    ): void;
  }

  interface QUnit {
    /**
     * Adds a test to exclusively run, preventing all other tests from running.
     *
     * Use this method to focus your test suite on a specific test. QUnit.only
     * will cause any other tests in your suite to be ignored.
     *
     * Note, that if more than one QUnit.only is present only the first instance
     * will run.
     *
     * This is an alternative to filtering tests to run in the HTML reporter. It
     * is especially useful when you use a console reporter or in a codebase
     * with a large set of long running tests.
     *
     * @param name Title of unit being tested
     * @param callback Function to close over assertions
     */
    // SAFETY: this is just wildly, impossibly unsafe. QUnit cannot -- ever! --
    // provide this guarantee. However, it's also the only way to support TS
    // in tests in Ember until we move the community over entirely to using
    // `<template>` and local scope.
    only<TC extends TestContext>(
      name: string,
      callback: (this: TC, assert: Assert) => void | Promise<unknown>
    ): void;

    /**
     * Use this method to test a unit of code which is still under development (in a “todo” state).
     * The test will pass as long as one failing assertion is present.
     *
     * If all assertions pass, then the test will fail signaling that `QUnit.todo` should
     * be replaced by `QUnit.test`.
     *
     * @param name Title of unit being tested
     * @param callback Function to close over assertions
     */
    // SAFETY: this is just wildly, impossibly unsafe. QUnit cannot -- ever! --
    // provide this guarantee. However, it's also the only way to support TS
    // in tests in Ember until we move the community over entirely to using
    // `<template>` and local scope.
    todo<TC extends TestContext>(
      name: string,
      callback: (this: TC, assert: Assert) => void | Promise<unknown>
    ): void;

    /**
     * Adds a test like object to be skipped.
     *
     * Use this method to replace QUnit.test() instead of commenting out entire
     * tests.
     *
     * This test's prototype will be listed on the suite as a skipped test,
     * ignoring the callback argument and the respective global and module's
     * hooks.
     *
     * @param name Title of unit being tested
     * @param callback Function to close over assertions
     */
    // SAFETY: this is just wildly, impossibly unsafe. QUnit cannot -- ever! --
    // provide this guarantee. However, it's also the only way to support TS
    // in tests in Ember until we move the community over entirely to using
    // `<template>` and local scope.
    skip<TC extends TestContext>(
      name: string,
      callback?: (this: TC, assert: Assert) => void | Promise<unknown>
    ): void;
  }

  namespace QUnit {
    interface TestFunction {
      // SAFETY: this is just wildly, impossibly unsafe. QUnit cannot -- ever! --
      // provide this guarantee. However, it's also the only way to support TS
      // in tests in Ember until we move the community over entirely to using
      // `<template>` and local scope.
      <TC extends TestContext>(
        name: string,
        callback: (this: TC, assert: Assert) => void | Promise<unknown>
      ): void;
    }

    interface SkipFunction {
      <TC extends TestContext>(
        name: string,
        callback?: (this: TC, assert: Assert) => void | Promise<unknown>
      ): void;
    }

    interface TodoFunction {
      <TC extends TestContext>(
        name: string,
        callback?: (this: TC, assert: Assert) => void | Promise<unknown>
      ): void;
    }

    interface OnlyFunction {
      <TC extends TestContext>(
        name: string,
        callback: (this: TC, assert: Assert) => void | Promise<unknown>
      ): void;
    }

    interface EachFunction {
      <TC extends TestContext, T>(
        name: string,
        dataset: T[],
        callback: (this: TC, assert: Assert, data: T) => void | Promise<unknown>
      ): void;
    }
  }
}
