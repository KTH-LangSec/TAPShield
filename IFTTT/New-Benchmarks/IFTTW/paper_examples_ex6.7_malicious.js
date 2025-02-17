// Filter code in Example 6.7
// Maker: ---
// Link : ---

// Trigger: ---
// Action: ---

// Policy/Presence: Confidentiality of trigger data / No

h = lbl(true);
url = urll("www.attacker.com");
if (h) {
	sink('Sink', '', url);
}
