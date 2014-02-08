(function () {
	Dialog = function (cfg) {
		this.cfg = cfg || {};
		this.htmlDialog = createDialog(this.cfg);
		try {
			var d = this.htmlDialog.document;
			d.write(this.cfg.html || "<html><head><title>" + this.cfg.title + "</title></head><body></body></html>");
			d.close();
			
			// provide Dialog reference to IE
			d.Dialog = this;
			
			var styles = d.createElement('style');
			styles.setAttribute('type', 'text/css');
			styles.styleSheet.cssText = this.cfg.css || '\nbody {overflow: auto;}\n';
			
			var headRef = d.getElementsByTagName('head')[0];
			headRef.appendChild(styles);
			
			if (this.cfg.bodyHtml)
				d.body.innerHTML = this.cfg.bodyHtml;
			
			for (var el in this.cfg) {
				if (!/^(css|html|oncreate)$/i.test(el) && this.htmlDialog[el] != undefined) {
					this.htmlDialog[el] = this.cfg[el];
				}
			}
			
		} catch (e) {
			debug(e);
		}
		
		if (typeof(this.cfg.oncreate) == "function")
			this.cfg.oncreate.call(this.htmlDialog.document);
		
	};
	
	Dialog.prototype.show = function () {
		this.htmlDialog.visible = true;
	}
	Dialog.prototype.hide = function () {
		this.htmlDialog.visible = false;
	}
	Dialog.prototype.close = function () {
		this.htmlDialog.close();
	}
	
	Dialog.prompt = function (title, value, func) {
		new Dialog({
			npp : Editor,
			bodyHtml : "<input type='text' id='prompt_str' style='width:100%' onkeypress='Dialog.cfg.onKeyDown(window.event, Dialog);' />",
			height : 100,
			width : 300,
			title : title,
			css : "body{background-color: buttonface; overflow:auto;}",
			oncreate : function () {
				var el = this.getElementById("prompt_str");
				el.value = value;
				el.focus();
			},
			onKeyDown : function (evt, dialog) {
				var target = evt.srcElement || evt.target,
				keycode = evt.keyCode || evt.which;
				
				if (keycode == 27 || keycode == 13) {
					// escape or enter key pressed
					var value = null;
					if (keycode == 13)
						value = target.value;
					
					try {
						switch (typeof(func)) {
						case "object":
							if (func.cmd(value) == false)
								return;
							break;
						case "function":
							if (func(value) == false)
								return;
							break;
						}
					} catch (e) {}
					
					dialog.hide();
				}
			}
		});
	};
	
})();

createGridViewDialog = function createGridViewDialog(cfg) {
	var header = "";
	for (var i = 0; i < cfg.header.length; i++)
		header += "<th>" + cfg.header[i] + "</th>";
	
	new Dialog({
		npp : Editor,
		bodyHtml : "<table id='results' onMouseOver='Dialog.cfg.onMOver(window.event);' onMouseOut='Dialog.cfg.onMOut(window.event);' onclick='Dialog.cfg.onClick(window.event, Dialog);' onkeypress='Dialog.cfg.onKeyDown(window.event, Dialog);'><tr>" + header + "</tr></table>",
		height : cfg.height || 500,
		width : cfg.width || 800,
		top : cfg.top || 200,
		title : cfg.title,
		css : (cfg.css ? cfg.css + "\n" : "") + "body{overflow:auto;} .highlight{background-color:#eee;} #results{ font-size:12px; border-collapse:collapse} td{cursor:pointer;} td,th{border: 1px solid #d8d8d8; padding: 2px 10px} th{ background-color: #d8d8d8; padding-top:5px; text-align: center; vertical-align: middle;} " +
		"i.warning{ background-position:-16px 0;} i.fatal_error{ background-position:-32px 0;} i.notice{ background-position:-48px 0;}" +
		"i.notice,i.fatal_error,i.warning,i.error{width:16px; height:16px; background-repeat: no-repeat; background-image: URL(data:image/png;base64,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)}",
		
		oncreate : function () {
			var el = this.getElementById("results");
			
			var log = "";
			for (i = 0, len = cfg.arr.length; i < len; i++) {
				var row = el.insertRow();
				this.Dialog.cfg.cell(row, cfg.getCells(cfg.arr[i]));
			}
			el.focus();
		},
		cell : function (r, arr) {
			for (var i = 0, c = arr.length; i < c; i++)
				r.insertCell().innerHTML = arr[i];
		},
		parent : function (el, name) {
			if (el.tagName == name)
				return el;
			return this.parent(el.parentNode, name);
		},
		onMOver : function (evt) {
			var target = evt.srcElement || evt.target;
			var row = this.parent(target, "TR");
			row.className = "highlight";
		},
		onMOut : function (evt) {
			var target = evt.srcElement || evt.target;
			var row = this.parent(target, "TR");
			row.className = "";
		},
		onClick : function (evt, d) {
			if (typeof(cfg.onRowClick) != "function")
				return;
			
			var target = evt.srcElement || evt.target;
			var row = this.parent(target, "TR");
			
			cfg.onRowClick(row, target);
		},
		onKeyDown : function (evt, dialog) {
			var target = evt.srcElement || evt.target,
			keycode = evt.keyCode || evt.which;
			
			if (keycode == 27 || keycode == 13) {
				dialog.hide();
			}
		}
	});
}
/*
new Dialog({
	onbeforeclose : function () {
		alert('bc');
		return false;
	},
	onclose : function () {
		alert('aa')
	},
	oncreate : function () {
		this.getElementById('prompt_str').focus();
	},
	css : "body{background-color: buttonface; overflow:auto;}",
	html : "<input type='text' id='prompt_str' style='width:100%' onkeypress='Dialog.close()' /><br/><a href='http://www.softwarecanoe.de' target='_blank'>www.softwarecanoe.de</a>"
});*/
