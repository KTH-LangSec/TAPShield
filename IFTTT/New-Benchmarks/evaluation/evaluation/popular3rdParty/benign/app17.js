//Maker: hotfirenet
//Link2Applet: https://ifttt.com/applets/184721p-myfox-sms-alert-intrusion
//Title of Applet:  MyFox SMS alert Intrusion
//Trigger service: Myfox HomeControl
//Action service: Android SMS
//Policy/Presence:  Availability / NO


alert = lbl("MyfoxHomecontrol.alertIntrusion.AlertType");
if (alert == 'Intrusion') { 
	sink('AndroidMessages.sendAMessage', 'setText', 'Intrusion Detected'); 	}
else { skip('AndroidMessages.sendAMessage'); }
