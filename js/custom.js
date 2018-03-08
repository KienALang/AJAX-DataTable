var globalUsers;
var globalPagination;

window.onload = function () {
	reload();
}

function reload() {
	var xhttpReq = new XMLHttpRequest();
	xhttpReq.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var users = JSON.parse(xhttpReq.responseText);
			globalUsers = users;
			var pagination = new Pagination(5);
			globalPagination = pagination;
			pagination.show();
		}
	}

	xhttpReq.open('GET', 'https://jsonplaceholder.typicode.com/users', true);
	xhttpReq.send();
}

function changePage(obj) {
	var selectedPage = obj.innerHTML;
	var currentPage = getCurrentPage();

	switch (selectedPage) {
		case 'Previous': globalPagination.goBack(currentPage); break;
		case 'Next': globalPagination.goNext(currentPage); break;
		default:
		globalPagination.goTo(selectedPage);
		break;
	}
}

var getCurrentPage = function() {
	return document.getElementsByClassName('active')[0].getElementsByTagName('a')[0].innerHTML;
}



function Table(startRow, endRow) {
	this.startRow = startRow;
	this.endRow = (endRow > globalUsers.length) ? globalUsers.length : endRow;
	this.length = this.endRow - this.startRow;
	this.statusText = 'Show '+ this.length +' of ' + globalUsers.length;	
	
	this.showTable = function() {
		var ouput = '';
		for (var i = startRow; i < endRow; i++) {
			var address = 'Street: '+globalUsers[i].address.street + '; Suite: ' + globalUsers[i].address.suite + '; City: ' + globalUsers[i].address.city;
			ouput += '<tr><td>'+globalUsers[i].id+'</td>' + '<td>'+globalUsers[i].name+'</td>' + '<td>'+globalUsers[i].username+'</td>' + '<td>'+globalUsers[i].email+'</td>' + '<td>'+address+'</td>' + '<td>'+globalUsers[i].phone+'</td>' + '<td>'+globalUsers[i].website+'</td>' + '<td>'+globalUsers[i].company.name+'</td></tr>';
		}

		document.getElementById('userInfor').innerHTML = ouput;
	}

	this.showStatus = function() {
		document.getElementById('textView').innerHTML = this.statusText;
	}
}

function Pagination(maxPageNum) {
	this.maxPageNum = maxPageNum;
	this.paginationId = document.getElementById('paginationId');	
	this.getNumberofRow = function() {
		var select = document.getElementById('selection');
		return select.options[select.selectedIndex].text;
	}

	this.getNumberofTable = function() {		
		var numberofTableTemp = globalUsers.length/this.getNumberofRow();
		var numberofTable = parseInt(numberofTableTemp);
		if (numberofTable < numberofTableTemp) {
			++numberofTable;
		}

		return numberofTable;
	}
	this.getTables = function() {
		var tables = [];
		var rowNum = this.getNumberofRow();
		var numberofTable = this.getNumberofTable();

		for (var i = 0; i < numberofTable; i++) {
			var startIndex = i*rowNum;
			var endIndex = parseInt(startIndex) + parseInt(rowNum);
			tables.push(new Table(startIndex, endIndex));
		}

		return tables;
	}
	
	this.show = function(selectedPage = 1) {
		var tables = this.getTables();
		tables[selectedPage-1].showTable();
		tables[selectedPage-1].showStatus();

		var tablesLength = tables.length;
		var ouput = '<li class="page-item"><a class="page-link" href="#" onclick="changePage(this)">Previous</a></li>';

		if (tablesLength <= this.maxPageNum) {
			var activeText;
			for (var i = 0; i < tablesLength; i++) {
				if ((i+1) == selectedPage) {activeText = 'active';} else {activeText = ''}
				ouput += '<li class="page-item '+activeText+'"><a class="page-link" href="#" onclick="changePage(this)">'+(i+1)+'</a></li>';
			}
		}

		ouput += '<li class="page-item"><a class="page-link" href="#" onclick="changePage(this)">Next</a></li>';

		this.paginationId.innerHTML = ouput;
	}

	this.goBack = function(currentPage) {
		if (--currentPage > 0) {
			this.show(currentPage);
		}
	}

	this.goNext = function(currentPage) {
		if (++currentPage <= this.getNumberofTable()) {
			this.show(currentPage);
		}
	}

	this.goTo = function(selectedPage) {
		this.show(selectedPage);
	}
}

