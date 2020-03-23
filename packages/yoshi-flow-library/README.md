# Yoshi Library Flow

A zero configuraiton toolkit to create modern TypeScript libraries in Wix.

> See [App Flow](https://wix.github.io/yoshi/docs/guides/app-flow#__docusaurus) for developing client applications

### What is a library (in the scope of frontend development)?

A library is a chunk of code that you want to reuse between client applications, servers and other libraries. This toolkit focuses on **client libararies**, or libraries that will be consumed in JavaScript client applications.

## Features

- 100% TypeScript
- Bundle with webpack (optional)
- Support tree-shaking and dynamic imports
- Fast Slick watch mode
- Optimized, fast build process
- Zero configuration needed

## Installation

```sh
EXPERIMENTAL_FLOW_LIBRARY=true npx create-yoshi-app <my-library>
```

Choose `flow-library` & `TypeScript`

## Usage

- `yoshi-library start` - Start a development server which rebuilds on any change
- `yoshi-library test` - Run the tests using `jest`
- `yoshi-library lint` - Run `eslint`
- `yoshi-library build` - Prepare the library for production deployment/publish

## Configure

//TODO - how to configure the `umd` bundle, what are the defaults

## FAQ

## What `build` command produces?

```none
─── dist
    ├── cjs (commonjs files)
    ├── esm (esmodules files)
    ├── statics (umd bundle) - [optional]
    └── types (d.ts files)
```

> After installing the library through `npm` this is how its output is being routed using the following fields in its `package.json` file

```json
{
  "main": "dist/cjs/index.js", // for NodeJS, used in component tests
  "module": "dist/es/index.js", // for webpack, because of dynamic import and Tree-Shaking
  "types": "dist/types/index.d.ts", // for the IDE and other TypeScript projects
  ...
}
```

The bundle is deployed to the cdn (`parastorage`) and should be used from there

### Why do you support only TypeScript

In Wix more than 80% of the frontend code is written with `TypeScript`. When creating a reusable library, having types is important for IDE features such a auto-completions and auto-import to work. It also helps preventing mistakes on other `TypeScript` projects that uses the library. It's also important to remember that there is a trade-off regarding maintaining support in multiple different use-cases and this trade-off means that when doing that, we won't be able to invest time deliver more features or make this flow more optimize.

### How can I use a library create by this Flow?

There are 2 main ways to consume a libaray:

1. **from `npm`** - import the library from the application's code and bundle it (Using `yoshi`'s app flow is guaranteed to work)
2. **from the `cdn`** - Consume the already bundled library using a `<script src="library.umd.js">` tag. (You'll need to specify it in the [`externals`](https://wix.github.io/yoshi/docs/api/configuration#externals) configuration option)

Using the second method also enables the version of the library to be controlled by the library author, so things like `GA` of the library would be able to get to production without the application code needs to be modified.

> Here are some pros and cons

|                                  | from `npm` | form the `cdn` |
| -------------------------------- | ---------- | -------------- |
| Consume from a GA\*              | X          | V              |
| Tree-shake unused code           | V          | X              |
| Affects app's build time         | V          | X              |
| Perform dynamic import           | V          | V              |
| Working with `requirejs`         | X          | V              |
| Share dependencies with your app | X          | V              |
