function addSaveAsPdfButton() {
	Ext.BLANK_IMAGE_URL="./terrasoft.axd?rm=Terrasoft.UI.WebControls&r=s.gif";
	function openPdfFile(fileName) {
		//get applicationPath from NavigationTabs.aspx
		var applicationPath = window.top.frames[0].frames[0].window.Terrasoft.applicationPath;
		var windowUrl = 'WebHelpNui/' + fileName;
		var windowName = '_openPdfHelpFileWindow';
		Terrasoft.applicationPath = applicationPath;
		Terrasoft.openWindow(windowUrl, null, null, null, null, true, false, false, null, false, windowName);
	}
	Ext.BLANK_IMAGE_URL="./terrasoft.axd?rm=Terrasoft.UI.WebControls&r=s.gif";
	var saveAsPdfButton = new Terrasoft.Button({id:'saveAsPdfButton', menuConfig:[
		{id:"PageContainer_MenuItem2",xtype:"menuitem",caption:"Руководство", handler: function () { openPdfFile('BPMonline_marketing_UG.pdf');}}],
		imageConfig:{source:"ResourceManager", usePrimaryImageColumn:true, resourceManagerName:"Terrasoft.WebApp", resourceItemName:"save-as-pdf.png"}});
	saveAsPdfButton.render(Ext.fly("saveAsPdfButtonContainer"));
	saveAsPdfButton.on('click', function(){ openPdfFile('BPMonline_marketing_UG.pdf');}, saveAsPdfButton);
}
