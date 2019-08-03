Relic chunky parser

# Purpose

Here is a js implementation of dawn of war replay files format parsing.

# Environment

- Targeted for node.js.
- Typescript superset for coding.

# Version history

*  0.0.1 : Naive version relying on gulp for project tasking (concat / build / package.json moving).
*  0.0.2 : Fixing typings.
*  0.0.3 : Fixing an infinite loop which as occuring while parsing replays vs ai.
*  0.0.4 : Adding mod name to the data returned by parse.
*  0.0.5 : Removing null characters from the mod name...
*  0.0.6 : Adjusting mod name read pos...
*  0.0.7 : Mod name fetching fix.
*  0.0.8 : Returning undefined on parsing failure.