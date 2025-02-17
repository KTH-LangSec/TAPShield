// False positive

h = lbl(true);

if (h) {
	skip('Sink');
}
else {
	skip('Sink');
}
sink('Sink', '', urll("www.attacker.com"));

