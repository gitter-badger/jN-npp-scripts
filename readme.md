jN-npp-scripts
==============
This is scripts for [jN plugin](https://code.google.com/p/jn-npp-plugin/) for [Notepad++](http://notepad-plus-plus.org/) editor.

Installation
------------

1. Clone to Notepad++ 'plugins\jN' folder (basically, it's C:\Program Files\Notepad++\plugins\jN)
2. Initialize submodules.
3. Restart Notepad++

"includes" Folder contains several JavaScript Files. They implement some functionality.

* zen coding.js - extends Npp with ["Zen Coding"](http://emmet.io/) functionality,
* decode.js - adds menu, that allows to decode text from some encoding to UTF-8,
* clearcase.js - adds menu, that allows to work with files under clearcase version control,
* gTranslate.js - adds menu, that allows you to translate some selected text,
* MenuCmds.js - allows you to execute some standard menu actions of Npp,
* run.js - adds menu and hotkey to run some javascript direkt from Npp,
* Dialog.js - adds Internet Explorer based dialog functionality, including gridview dialog about errors of different tools
* test.menu.js - some tests and samples of functionality of nppscripting plugin,
* includes.js - adds new Menu, that allows you to open files in includes.
* kTools.js - base for kTools. It provides base objects for modules with some useful functionality. Its architecture is not optimal - it depends on global variable, but I dont know how to sandbox every module. Maybe some kind of metadata block?
* ktools/ - modules for kTools are stored in this folder
	* GoogleClosureCompiler.js - allows you to optimize JS source with [Google Closure Compiler](https://closure-compiler.appspot.com/home) just from editor
	* leeter.js - allows you convert text to [1337 5?34|<](https://encyclopediadramatica.es/1337)
	* PHPLint.js - binding to [PHPLint](http://www.icosaedro.it/phplint/), you'll have to edit the file to write correct path to it
	* deobfusctators.js - some self-written deobfuscators generally for JS. The name of obfuscator is often unknown (I'll be glad if you will say me the name if you know it).

Move any of these files into "includes/disabled" to disable it. For example clearcase.js if you don't know what is this :-).