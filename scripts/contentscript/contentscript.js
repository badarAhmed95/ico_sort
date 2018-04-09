if (typeof ContentScript !== 'function') {
	ContentScript = function (window, document, $, chrome, selectors, sortOrder) {
		this.window = window;
		this.document = document;
		this.$ = $;
		this.chrome = chrome;
		this.selectors = selectors;
		this.sortOrder = sortOrder;
		this.initMessageListener();
		this.initFunctionality();
	};
	ContentScript.prototype = {
		constructor: ContentScript,
		tabActive: true,
		switchStatus:true,
		status: 'inactive',
    selectedVal: '',
    sortedRows:[],
		initFunctionality: function () {
			var self = this;
			this.status = 'active';
      self.enableArrive();
      // self.chrome.storage.sync.get({
      //   buttonState: false
      // }, function(items){
      //   if(items != undefined) {
      //     self.buttonState = items.buttonState;
      //     if(self.buttonState) {
      //
				// 	}
      //   } else {
      //     self.enableArrive();
      //   };
      // });
    },
		enableArrive:function() {
			var self = this;
      this.document.arrive(this.selectors.tableUpcomingIco, { existing: true, onceOnly:true }, function (e) {
        if (self.tabActive) {
        	self.table = e;
          self.changeTable(e);
          self.enableDropDown(e);
          }
      });
		},
		changeTable: function(element) {
			var self = this;
			if(self.selectedVal != '') {
				self.sortTable(element);
			}
		},
		sortTable: function(element) {
			var self = this;
      var tableTempEle = self.$(element).clone();
      self.sortedRows = [];
			switch (self.selectedVal) {
				case 'interest_asc':
          	self.categorySort('interest_asc',element, self.selectors.interestDiv);
						break;
				case 'interest_dsc':
      			self.categorySort('interest_dsc',element, self.selectors.interestDiv);
						break;
				case 'category_asc':
      			self.categorySort('category_asc',element, self.selectors.categoryDiv);
						break;
				case 'category_dsc':
						self.categorySort('category_dsc',element, self.selectors.categoryDiv);
						break;
				case 'recieved_asc':
      			self.sortRecievedCol(true, element, self.selectors.recievedDiv, 'recieved_asc');
						break;
				case 'recieved_dsc':
						self.sortRecievedCol(false, element, self.selectors.recievedDiv, 'recieved_dsc');
						break;
				case 'goal_asc':
          	self.sortRecievedCol(true, element, self.selectors.goalDiv, 'goal_asc');
						break;
				case 'goal_dsc':
          self.sortRecievedCol(false, element, self.selectors.goalDiv, 'goal_dsc');
          break;
      	}
      },
		categorySort:function(flag, element, selector){
			var self = this;
      self.sortOrder[flag].forEach((x) => {
        var rowsTemp = self.$(element).find(selector +':contains("'+x+'")');
      if(rowsTemp.length > 0) {
        self.$(rowsTemp).each(function(x){
          self.pushRow(this);
        })
      }
    });
      self.replaceRows(element);
		},
			sortRecievedCol:function(Asc, element, selector, flag){
				var self = this;
        var $rows = [];
        var status = '';
        var spanSelector = '';
        if(flag.indexOf('recieved') != -1) {
        	status = 'Pending';
        	spanSelector = 'span:first-child';
				} else {
        	status = 'Not Set';
        	spanSelector = '';
				}
        self.$("[id]").each(function(){
          if(self.$(this).attr("id")== selector){
            if(self.$(this).closest('div.tabs__content.active').length > 0) {
              $rows.push(self.$(this));
            }
          }
        });
        var $rowsWithoutPend = $rows.filter(function(ele) {
          return self.$(spanSelector,ele).text() != status;
        });
        var $rowsWithPend = $rows.filter(function(ele) {
          return self.$('span:first-child',ele).text() === status;
        })
        $rowsWithoutPend.sort(function(a, b) {
          if(flag.indexOf('recieved') != -1) {
            var keyA = self.convertInt(self.$('span:first-child',a).text());
            var keyB = self.convertInt(self.$('span:first-child',b).text());
					} else {
            var keyA = self.convertInt(a[0].innerText);
            var keyB = self.convertInt(b[0].innerText);
					}
          return (Asc)?(keyA - keyB):(keyB - keyA);
        });
        if(Asc){
          self.$($rowsWithPend).each(function(index, row){
            self.pushRow(this);
          });
				}
        self.$($rowsWithoutPend).each(function(index, row){
             self.pushRow(this);
        });
        if(!Asc) {
          self.$($rowsWithPend).each(function(index, row){
            self.pushRow(this);
          });
				}
        self.replaceRows(element);
			},
			pushRow:function(element) {
			var self = this;
        var temp = self.$(element).closest(self.selectors.ico_row);
        if(temp.length > 0) {
          self.sortedRows.push(temp);
        }
      },
			replaceRows:function(element){
			var self = this;
        element = self.$(element).find(self.selectors.category_desk + ' ' +self.selectors.ico_row);
        self.$(element).wrapAll('<div id="wrapper"></div>');
        self.$('#wrapper').replaceWith(self.sortedRows);
		},
		convertInt:function(str) {
			var self =  this;
			str = str.replace(/,/g,'');
			str = str.replace('$','');
			return parseInt(str);
		},
		enableDropDown:function(element){
			var self = this;
			var dropdown = `<label> Sort Order:</label> 
							<select id="dropdown">
							<option title="Select option" value="">Select</option>
						<option value="interest_asc">Interest Ascending</option>
						<option value="interest_dsc">Interest Descending</option>
						<option value="category_asc">Category Aescending</option>
						<option value="category_dsc">Category Descending</option>
						<option value="recieved_asc">Recieved Aescending</option>
						<option value="recieved_dsc">Recieved Descending</option>
						<option value="goal_asc">Goal Aescending</option>
						<option value="goal_dsc">Goal Descending</option>
					</select>
				<div id="dvDiv" style="display:none;position:absolute;padding:10px;border:1px solid #333333;;background-color:#fffedf;font-size:smaller;z-index:999;"></div>
        <iframe id="frm" style="display:none;position:absolute;z-index:998"></iframe>
				`;
			var header = self.$(element).closest('main').find(self.selectors.upcomingIco_header);
			self.$(header).append(dropdown);
			self.$('#dropdown').change(function() {
        self.selectedVal = this.value;
        self.selectedText = this.options[this.selectedIndex].text;
        self.changeTable(self.table);
			})
			self.$('#dropdown').mouseenter(function(event) {
				var e = event;
        if(!e){var e = window.event;}
        var obj = e.target;
        var objHeight = obj.offsetHeight;
        var optionCount = obj.options.length;
        var eX = e.offsetX;
        var eY = e.offsetY;
        //vertical position within select will roughly give the moused over option...
        var hoverOptionIndex = Math.floor(eY / (objHeight / optionCount));
        var tooltip = document.getElementById('dvDiv');
        if(obj.selectedOptions[0].value != "") {
          var array = self.sortOrder[obj.selectedOptions[0].value];
          var ele = "<h2>Sort Order</h2>";
          array.forEach(function(x) {
            ele = ele + "<div>"+x+"</div>";
          })
          tooltip.innerHTML = ele;
				} else {
          tooltip.innerHTML = 'Select option';
				}
        mouseX=event.pageX?event.pageX:event.clientX;
        mouseY=event.pageY?event.pageY:event.clientY;
        tooltip.style.left=mouseX+10;
        tooltip.style.top=mouseY;
        tooltip.style.display = 'block';
        var frm = document.getElementById("frm");
        frm.style.left = tooltip.style.left;
        frm.style.top = tooltip.style.top;
        frm.style.height = tooltip.offsetHeight;
        frm.style.width = tooltip.offsetWidth;
        frm.style.display = "block";
			})
      self.$('#dropdown').mouseleave(function() {
        var tooltip = document.getElementById('dvDiv');
        var iFrm = document.getElementById('frm');
        tooltip.innerHTML = '';
        tooltip.style.display = 'none';
        iFrm.style.display = 'none';
      })
		},
		initMessageListener: function () {
			var self = this;
			this.chrome.runtime.onMessage.addListener(function (message, sender, response) {
				if (!self[message.method]) {
					throw new Error('Method "' + message.method + '" does not exist');
				}
				var tab = sender;
				message.args = message.args || [];
				message.args.push(tab);
				message.args.push(response);
				self[message.method].apply(self, message.args || []);
				return true;
			});
		},
		sendMessageToBg: function (method, args, cb) {
			args = (args === null || typeof args === "undefined") ? [] : args;
			args = Array.isArray(args) ? args : [args];
			cb = typeof cb === "undefined" ? null : cb;
			if (typeof method === "undefined" || typeof method !== "string") {
				throw new Error("Missing required parameter 'method'");
			}
			this.chrome.runtime.sendMessage({
				method: method,
				args: args
			},cb);
		}
	}
}
var content = new ContentScript(window, document, jQuery, chrome, selectors, sortOrder);