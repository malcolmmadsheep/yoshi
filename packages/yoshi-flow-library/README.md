# Yoshi Library Flow

A zero configuraiton toolkit to create modern TypeScript libraries in Wix.

> See [App Flow](https://wix.github.io/yoshi/docs/guides/app-flow#__docusaurus) for developing client applications

### What is a library (in the scope of frontend development)?

A library is a chunk of code that you want to reuse between client applications, servers and other libraries. This toolkit focuses on **client libararies**, or libraries that will be consumed in JavaScript client applications.

### How can I use a library create by this Flow?

There are 2 main ways to consume a libaray:

1. `esm package` - Install the tranpiled library from `npm`, import it from the application's code and bundle it. (Using `yoshi`'s app flow is guaranteed to work)
2. `umd bundle` - Consume the already bundled library using a `<script>` tag.

|                                  | `esm` package | `umd` bundle |
| -------------------------------- | ------------- | ------------ |
| Consume as a GA'able\*           | X             | V            |
| Tree-shake unused code           | V             | X            |
| Affects app's build time         | V             | X            |
| Perform dynamic import           | V             | V            |
| Working with `requirejs`         | X             | V            |
| Share dependencies with your app | X             | V            |

Each method has pros and cons, here is a list:
library
Using the second method also enables the version of the library to be controlled by the library author, so things like `GA` of the library would be able to get to production without the application code need to be modified.
