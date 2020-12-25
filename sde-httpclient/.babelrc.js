/*
Configuration file for Babel. This controls how JavaScript code is transpiled down to ES5 for
compatibility with a majority of browsers.
*/

// We only have one preset here
const preset0 = [];

// preset-env is probably a good starting point to avoid having to configure loads of stuff
// manually.
preset0.push('@babel/preset-env');

// esmodules: true allows the use of async - without this we get a strange runtime error about
// regeneratorRuntime not being defined.
preset0.push({targets: {esmodules: true}});

const presets = [];
presets.push(preset0);

const plugins = [];
/*
plugin-proposal-class-properties allows use of class properties syntax such as
class foo {
    bar = () => {
        // do something...
    }
}
*/
plugins.push('@babel/plugin-proposal-class-properties');

module.exports = { presets, plugins };
