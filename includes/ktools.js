//@author KOLANICH
// kTools means KOLANICH's tools

function kToolsModule(){};
kToolsModule.prototype.init=function(){
	//GlobalListener.addListener(this);
	this.menu=kTools.menu.addItem({
		text:this.name,
		cmd:this.use
	});
};
//bug: not working
/*kToolsModule.prototype.langs=null;
kToolsModule.prototype.BUFFERACTIVATED=function(v){
	alert(JSON.stringify(v));
	if(!this.langs||!v.lang||!Editor.langs[v.lang]){
		this.menu.disabled = false;
		return;
	}
	var lang=langs[v.lang].toLowerCase();
	alert(lang);
	this.menu.disabled = this.langs.indexOf(lang)>-1;
};*/

function kToolsCommandLineModule(){
	this.processArgument=this.processArgument.bind(this);
};

kToolsCommandLineModule.prototype=new kToolsModule();
kToolsCommandLineModule.prototype.arguments=[];
kToolsCommandLineModule.prototype.files={};
kToolsCommandLineModule.prototype.processArgument=function(arg){
	if(typeof arg=="function"){
		return (arg.bind(this))();
	}
	else return arg;
};
kToolsCommandLineModule.prototype.prepare=function(shared){
	shared.messages=[];
};
kToolsCommandLineModule.prototype.postprocess=function(shared){
	createGridViewDialog({
		arr:shared.messages,
		title:this.name,
		header: ["","file","line","message"],
		getCells:function(m){
			return ["<i class='"+m.type+"'/>",m.file,m.line,m.message];
		},
		
		onRowClick:function(row){
			var line = row.cells[2].innerText;
			Editor.currentView.line = 1*line -1;
		}
	});
};
kToolsCommandLineModule.prototype.processStream=function(stream,rx,lineProcesser,shared,name){
	if(stream.AtEndOfStream)return false;
	var line=stream.ReadLine();
	if(!line)return true;
	if(typeof rx=="object"){
		var parsedLine=line.match(rx);
		lineProcesser(parsedLine,line,shared);
	}
	else
		shared[name]+=line+"\n";
	return true;
}
kToolsCommandLineModule.prototype.exec=function(docPath){
	var args=this.arguments.slice(0).map(this.processArgument).join(' ').replace("$PATH$",docPath);
	var cmd='"'+this.executable+'" '+args;
	//alert(cmd);
	var shared={stdOut:"",stdErr:""};
	this.prepare(shared);
	var process=shell.exec(cmd);
	var parsedLine;
	while(1){
		if(!(0
			||this.processStream(process.StdOut,this.stdOutRx,this.stdOutLineProcesser,shared,"stdOut")
			||this.processStream(process.StdErr,this.stdErrRx,this.stdErrLineProcesser,shared,"stdErr")
			)
			&&process.Status
		){
			break;
		}
	}
	return this.postprocess(shared);
};
kToolsCommandLineModule.prototype.use=function(){
	//alert(this.executable.toString());
	this.exec(Editor.currentView.files[Editor.currentView.file]);
};

kToolsCommandLineModule.prototype.initArguments=function(){
	for(var i=0;i<this.arguments.length;i++){
		if(typeof this.arguments[i]==="string"){
			for(var file in this.files){
				this.arguments[i]=this.arguments[i].replace("$"+file.toUpperCase()+"$","\""+this.files[file]+"\"");
			}
			this.arguments[i]=this.arguments[i].replace(/\$BASE\$/g,this.base);
		}
	};
}
kToolsCommandLineModule.prototype.areFilesPresent=function(){
	if(!fso.FolderExists(this.base))return false;
	if(!fso.FileExists(this.executable))return false;
	for(var file in this.files){
		if(!fso.FileExists(this.files[file])){
			return false;
		}
	}
	return true;
}
kToolsCommandLineModule.prototype.initFilesPaths=function(){
	for(var file in this.files){
		this.files[file]=this.files[file].replace(/\$BASE\$/g,this.base);
	}
}
kToolsCommandLineModule.prototype.init=function(){
	this.initFilesPaths();
	if(this.areFilesPresent()){
		this.initArguments();
		kTools.menu.addItem({
			text:this.name,
			cmd:this.use.bind(this)
		});
	}
	else{
		//alert("files not present");
	}
};


function KTools(menuName,folderName){
	menuName=menuName||"kTools";
	this.menu = Editor.addMenu(menuName);
	this.initializeModules=this.initializeModules.bind(this);
	
	var kTools=this;
	//this.initializeModules();
}
KTools.prototype.modules=[];
KTools.prototype.menus={};
KTools.prototype.menuItems={};
KTools.prototype.submenu=function(name){
	if(typeof this.menus[name]==="undefined")
		this.menus[name]=this.menu.addMenu(name);
	return this.menus[name];
};
KTools.prototype.item=function(cfg){
	if(typeof this.menuItems[cfg.text]==="undefined")
		this.menuItems[cfg.text]=this.menu.addItem(cfg);
	return this.menuItems[cfg.text];
};
KTools.prototype.requireModules=function(folderName){
	folderName=folderName||"kTools";
	try{
		require(Editor.nppDir+"\\Plugins\\jN\\includes\\"+folderName);
	}catch(err){
		shell.Popup(
			err,
			0, "kTools: Error loading module",
			MessageBoxConstants.MB_OK|MessageBoxConstants.MB_ICONERROR|MessageBoxConstants.MB_SETFOREGROUND
		);
	}
};
KTools.prototype.initializeModules=function(){
	this.modules.forEach(function(module){module.init();});
};
KTools.prototype.addModule=function(module){
	this.modules.push(module);
};

var kTools=new KTools();
kTools.requireModules();
kTools.initializeModules();